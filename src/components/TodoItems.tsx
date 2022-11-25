import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { Item, Prisma } from "@prisma/client"
import axios from "axios"
import { Reducer, useEffect, useReducer, useState } from "react"
import { TodoItemsProps } from "../types/propTypes"
import TodoItem from "./TodoItem"


async function saveTodoItem(todoItemInput: Prisma.ItemCreateInput) {
    const response = await axios.post('/api/todoitems/create', todoItemInput)

    if (response.statusText !== 'OK') {
        throw new Error(response.statusText)
    }

    return await response.data
}

export interface todoItemState {
    data: Item[]
    isLoading: boolean
    hasError: boolean
}

type TodoListsAction = {
    type: 'TODOITEMS_FETCH_INIT' | 'TODOITEMS_FETCH_SUCCESS' | 'TODOITEMS_FETCH_ERROR' | 'DELETE_TODOITEM' | 'CREATE_TODOITEM' | 'UPDATE_TODOITEM'
    payload?: any
}

const todoItemsReducer: Reducer<todoItemState, TodoListsAction> = (state: todoItemState, action: TodoListsAction): todoItemState => {
    switch (action.type) {
        case 'TODOITEMS_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                hasError: false,
            }

        case 'TODOITEMS_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                hasError: false,
                data: action.payload as Item[]
            }

        case 'TODOITEMS_FETCH_ERROR':
            return {
                ...state,
                isLoading: false,
                hasError: true,
                data: action.payload as Item[]
            }

        case 'DELETE_TODOITEM':
            return {
                ...state,
                isLoading: false,
                hasError: false,
                data: state.data.filter(tdl => (action.payload as Item).id !== tdl.id)
            }

        
        case 'CREATE_TODOITEM':
            const newList = [...state.data]
            newList.push(action.payload as Item)
            return {
                ...state,
                isLoading: false,
                hasError: false,
                data: newList
            }

        case 'UPDATE_TODOITEM':
            const updatedTodoItem = (action.payload as Item)
            const updatedTodoItemIndex = state.data.findIndex((t) => t.id == updatedTodoItem.id)
            const updatedList = [...state.data]
            updatedList[updatedTodoItemIndex] = updatedTodoItem

            return {
                ...state,
                isLoading: false,
                hasError: false,
                data: updatedList
            }


        default:
            console.log('default')
            throw new Error()
    }
}


const TodoItems: React.FC<TodoItemsProps> = ({todoListId}) => {
    console.log(process.env.NODE_ENV)
    // console.log('TodoItems')
    const [itemOnUpdateId, setItemOnUpdateId] = useState(-1)
    const [text, setText] = useState('')
    const [state, dispatch] = useReducer(todoItemsReducer, { data: [], isLoading: false, hasError: false})

    useEffect(() => {
        async function fetchTodoItems() {
            // console.log('TodoItems: fetchTodoItems')

            try {
                const response = await axios.get(`/api/todoitems?todoId=${todoListId}`)
                const {todoItems} = await response.data           
                dispatch({ type: 'TODOITEMS_FETCH_SUCCESS', payload: todoItems })
            } catch {
                dispatch({ type: 'TODOITEMS_FETCH_ERROR'})
            }
        
        }
        dispatch({ type: 'TODOITEMS_FETCH_INIT'})
        fetchTodoItems()
    }, [todoListId])
    

    const handleUpdate = async (todoItem: Item, itemUpdateInput: Prisma.ItemUpdateInput) => {
        // console.log('TodoItems: handleUpdate')
        try {
            const response = await axios.post(`/api/todoitems/update`,{
                todoItem, 
                itemUpdateInput
            })
            if (response.statusText !== 'OK') {
                throw new Error(response.statusText)
            }
            const updatedTodoItem = await response.data

            dispatch({ type: 'UPDATE_TODOITEM', payload: updatedTodoItem})

        } catch {
            // throw new Error('TodoItems: Handle Update: Feature Unimplemented')
        }
    }

    const handleDelete = async (deletedItem: Item) => {
        // console.log('TodoItems: handleUpdate')

        try {
            const response = await axios.post(`/api/todoitems/delete`, deletedItem)
    
            if (response.statusText !== 'OK') {
                throw new Error(response.statusText)
            }
    
            const deletedTodoItem = await response.data
            dispatch({ type: 'DELETE_TODOITEM', payload: deletedTodoItem })

        } catch {
            // throw new Error('TodoItems: Handle Delete: Feature Unimplemented')
        }

    }

    const handleCreate = async (newTodoItemInput: Prisma.ItemCreateInput) => {
        try {
            const newTodoItem = await saveTodoItem(newTodoItemInput)

            dispatch({ type: 'CREATE_TODOITEM', payload: newTodoItem})
        } catch {

            // throw new Error('TodoItems: Handle Create: Feature Unimplemented')

        }
    }

    const handleItemOnUpdateIdChanged = (itemId: number) => {
        setItemOnUpdateId(itemId)
    }


    return (
        <>
            <form 
                className="flex justify-between mt-4 items-center"
                onSubmit={async (e) => {
                    e.preventDefault()
                    const newTodoItemInput: Prisma.ItemCreateInput = {
                        todoList: {connect: {
                            id: todoListId
                        }},
                        text: text
                    }
                    handleCreate(newTodoItemInput)
                    setText('')
                }}
            >
                <input 
                    name='text' 
                    className="border rounded p-4 flex-1" 
                    placeholder="Enter new item here" 
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    required
                />
                <button type='submit'>
                    <PlusCircleIcon className="w-8 h-12 ml-8"/>
                </button>
            </form>
            {!state.isLoading && !state.hasError && state.data?.map((item, i) => (
                <div key={i} className='mt-4'>
                    <TodoItem
                        key={item.id}
                        todoItem={item}
                        itemOnUpdateIndex={itemOnUpdateId}
                        onItemOnUpdateIndexChanged={handleItemOnUpdateIdChanged}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}/>
                </div>
            )
            )}
        </>
    )
}

export default TodoItems