import { PlusIcon } from "@heroicons/react/24/outline"
import { Prisma, TodoList } from "@prisma/client"
import axios from "axios"
import { Reducer, useEffect, useReducer, useState } from "react"
import AddTodoModal from "./AddTodoModal"
import TodoListComponent from "./TodoList"

export interface TodoListsProps {
    userId?: string
}

export interface todoListsState {
    data: TodoList[]
    isLoading: boolean
    hasError: boolean
}

type TodoListsAction = {
    type: 'TODOLISTS_FETCH_INIT' | 'TODOLISTS_FETCH_SUCCESS' | 'TODOLISTS_FETCH_ERROR' | 'DELETE_TODOLIST' | 'CREATE_TODOLIST' | 'UPDATE_TODOLIST'
    payload?: any
}


const todoListsReducer: Reducer<todoListsState, TodoListsAction> = (state: todoListsState, action: TodoListsAction): todoListsState => {
    switch (action.type) {
        case 'TODOLISTS_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                hasError: false,
            }

        case 'TODOLISTS_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                hasError: false,
                data: action.payload as TodoList[]
            }

        case 'TODOLISTS_FETCH_ERROR':
            return {
                ...state,
                isLoading: false,
                hasError: true,
                data: action.payload as TodoList[]
            }

        case 'DELETE_TODOLIST':
            return {
                ...state,
                isLoading: false,
                hasError: false,
                data: state.data.filter(tdl => (action.payload as TodoList).id !== tdl.id)
            }

        
        case 'CREATE_TODOLIST':
            const newList = [...state.data]
            newList.push(action.payload as TodoList)
            return {
                ...state,
                isLoading: false,
                hasError: false,
                data: newList
            }

        case 'UPDATE_TODOLIST':
            const updatedTodoList = (action.payload as TodoList)
            const updatedTodoListIndex = state.data.findIndex((t) => t.id == updatedTodoList.id)
            const updatedList = [...state.data]
            updatedList[updatedTodoListIndex] = updatedTodoList

            return {
                ...state,
                isLoading: false,
                hasError: false,
                data: updatedList
            }


        default:
            throw new Error()
    }
}



async function saveTodoList(todoListCreateInput: Prisma.TodoListCreateInput) {
    const response = await axios.post('/api/todolists/create', todoListCreateInput)

    if (response.statusText !== 'OK') {
        throw new Error(response.statusText)
    }
    return response.data
}

const TodoLists: React.FC<TodoListsProps> = ({userId}) => {
    const [state, dispatch] = useReducer(todoListsReducer, { data: [], isLoading: false, hasError: false})
    const [show, setShow] = useState(false)

    useEffect(() => {
        
        const fetchTodoLists = async () => {
            try {
                const response = await axios.get(`/api/todolists?userId=${userId}`)
                dispatch({ type: 'TODOLISTS_FETCH_SUCCESS', payload: response.data.todoLists })
            } catch {
                dispatch({ type: 'TODOLISTS_FETCH_ERROR'})
            }
        }
        dispatch({ type: 'TODOLISTS_FETCH_INIT'})
        fetchTodoLists()

    }, [userId])

    const handleUpdate = (updatedTodoList: TodoList) => {
        // console.log('TodoLists: handleUpdate')
        // throw new Error('TodoLists:handleUpdate:Unimplemented')
        // const updatedTodoListIndex = todoLists.findIndex((t) => t.id == updatedTodoList.id)
        // const updatedList = [...todoLists]
        // updatedList[updatedTodoListIndex] = updatedTodoList
        // setTodoLists(updatedList)
    }

    const handleCreate = async (title: string, note: string) => {
        // console.log('TodoLists: handleCreate')
        const newTodoListInput: Prisma.TodoListCreateInput = {
            author : {connect: {
                id: userId
            }},
            title,
            note
        }

        const newTodoList = await saveTodoList(newTodoListInput)
        dispatch({ type: 'CREATE_TODOLIST', payload: newTodoList})
        // throw new Error('Handle Create: Feature Unimplemented')
    }

    const handleDelete = async (todoList: TodoList) => {
        // console.log('TodoLists: handleDelete')
        try {
            const response = await axios.post(`/api/todolists/delete`, todoList)
            if (response.statusText !== 'OK') {
                throw new Error(response.statusText)
            }

            const deletedTodoList = response.data
            dispatch({ type: 'DELETE_TODOLIST', payload: deletedTodoList })

        } catch {
            // throw new Error('Handle DELETE: Feature Unimplemented')
        }
    }

return (
    <>
        <AddTodoModal show={show} setShow={setShow} onCreate={handleCreate}/>
        <div className='mt-12'>
                        <button 
                            className='flex align-center gap-2 font-bold rounded-full text-white bg-green-500 hover:bg-green-600 py-2 px-4'
                            onClick={() => setShow(!show)}
                        >
                            <PlusIcon className='className="h-6 w-6 text-white-500'/>
                            Add New List
                        </button>
        </div>
        <div className='grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12 my-12'>
            {!state.isLoading && !state.hasError && state.data.map( (todoList) => {
                return <TodoListComponent key={todoList.id} todoList={todoList} onUpdate={handleUpdate} onDelete={handleDelete}/>
            })}
        </div>
    </>
    )
}

export default TodoLists