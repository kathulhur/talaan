import { PlusIcon } from "@heroicons/react/24/outline"
import { Prisma, TodoList } from "@prisma/client"
import { SetStateAction, useEffect, useState } from "react"
import AddTodoModal from "./AddTodoModal"
import TodoItems from "./TodoItems"
import TodoListComponent from "./TodoList"

export interface TodoListsProps {
    userId?: string
}

async function saveTodoList(todoListCreateInput: Prisma.TodoListCreateInput) {
    const response = await fetch('/api/todolists/create', {
        method: 'POST',
        body: JSON.stringify(todoListCreateInput)
    })

    if (!response.ok) {
        throw new Error(response.statusText)
    }

    return await response.json()
}

const TodoLists: React.FC<TodoListsProps> = ({userId}) => {
    const [show, setShow] = useState(false)
    const [todoLists, setTodoLists] = useState<TodoList[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    useEffect(() => {
        // console.log('TodoLists: fetchTodolists')
        setIsLoading(true)
        async function fetchTodoLists() {
            const response = await fetch(`/api/todolists?userId=${userId}`)

            if(!response.ok) {
                setHasError(true)
                setIsLoading(false)
                return
            }

            const data = await response.json()
            if (data.todoLists) {
                setTodoLists(data.todoLists)
                setIsLoading(false)
            }
        }
        
        fetchTodoLists()

    }, [userId])

    const handleUpdate = (updatedTodoList: TodoList) => {
        // console.log('TodoLists: handleUpdate')
        const updatedTodoListIndex = todoLists.findIndex((t) => t.id == updatedTodoList.id)
        const updatedList = [...todoLists]
        updatedList[updatedTodoListIndex] = updatedTodoList
        setTodoLists(updatedList)
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
        const newlyStoredTodoItem = await saveTodoList(newTodoListInput)
        setTodoLists([...todoLists, newlyStoredTodoItem])
    }

    const handleDelete = async (todoList: TodoList) => {
        // console.log('TodoLists: handleDelete')
        const response = await fetch(`/api/todolists/delete`, {
            method: 'POST',
            body: JSON.stringify({todoList})
        })

        if (!response.ok) {
            throw new Error(response.statusText)
        }

        const deletedTodoList = await response.json()

        const deletedTodoListIndex = todoLists.findIndex(tl => tl.id == deletedTodoList.id)
        const updatedList = [...todoLists]
        updatedList.splice(deletedTodoListIndex, 1)
        setTodoLists(updatedList)
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
            {!isLoading && !hasError && todoLists.map( (todoList, i) => {
                return <TodoListComponent key={todoList.id} todoList={todoList} onUpdate={handleUpdate} onDelete={handleDelete}/>
            })}
        </div>
    </>
    )
}

export default TodoLists