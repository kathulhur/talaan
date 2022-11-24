import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { Item, Prisma } from "@prisma/client"
import axios from "axios"
import { useEffect, useState } from "react"
import { TodoItemsProps } from "../types/propTypes"
import TodoItem from "./TodoItem"


async function saveTodoItem(todoItemInput: Prisma.ItemCreateInput) {
    const response = await axios.post('/api/todoitems/create', todoItemInput)

    if (response.statusText !== 'OK') {
        throw new Error(response.statusText)
    }

    return await response.data
}


const TodoItems: React.FC<TodoItemsProps> = ({todoListId}) => {
    // console.log('TodoItems')
    const [itemOnUpdateId, setItemOnUpdateId] = useState(-1)
    const [text, setText] = useState('')
    
    const [todoItems, setTodoItems] = useState<Item[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        async function fetchTodoItems() {
            // console.log('TodoItems: fetchTodoItems')
            const response = await axios.get(`/api/todoitems?todoId=${todoListId}`)
            
            if(response.statusText !== 'OK') {
                setHasError(true)
                setIsLoading(false)
                return
            }
            const data = await response.data

            if (data.todoItems) {
                setTodoItems(data.todoItems)
                setIsLoading(false)
            }
        }
    
        fetchTodoItems()
    }, [todoListId])
    

    const handleUpdate = async (todoItem: Item, itemUpdateInput: Prisma.ItemUpdateInput) => {
        // console.log('TodoItems: handleUpdate')
        const response = await axios.post(`/api/todoitems/update`,{
            todoItem, 
            itemUpdateInput
        })

        if (response.statusText !== 'OK') {
            throw new Error(response.statusText)
        }

        const updatedTodoItem = await response.data
        const updatedTodoItemIndex = todoItems.findIndex(i => i.id == todoItem.id)
        const updatedList = [...todoItems]
        updatedList[updatedTodoItemIndex] = updatedTodoItem
        setTodoItems(updatedList)

    }

    const handleDelete = async (deletedItem: Item) => {
        // console.log('TodoItems: handleUpdate')
        const response = await axios.post(`/api/todoitems/delete`, deletedItem)

        if (response.statusText !== 'OK') {
            throw new Error(response.statusText)
        }

        const deletedTodoItem = await response.data

        const deletedTodoItemIndex = todoItems.findIndex(i => i.id == deletedItem.id)
        const updatedList = [...todoItems]
        updatedList.splice(deletedTodoItemIndex, 1)
        setTodoItems(updatedList)
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
                    const newlyStoredTodoItem = await saveTodoItem(newTodoItemInput)
                    setTodoItems([...todoItems, newlyStoredTodoItem])
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
            {!isLoading && !hasError && todoItems?.map((item, i) => (
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