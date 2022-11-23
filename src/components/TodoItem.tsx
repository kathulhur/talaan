import { use, useState } from "react";
import { TodoItemProps } from "../types/propTypes";
import { PencilIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Prisma } from "@prisma/client";

const TodoItem: React.FC<TodoItemProps> = ({ todoItem, onUpdate, onDelete, itemOnUpdateIndex, onItemOnUpdateIndexChanged}) => {
    // console.log('TodoItem')
    const [text, setText] = useState(todoItem.text)

    return (
        <div className={`group items-center ${todoItem.done && 'line-through opacity-50'}`}>
            { itemOnUpdateIndex != -1 && itemOnUpdateIndex == todoItem.id
                ?
                    <form
                        className="flex"
                        onSubmit={
                            (e) =>{
                                e.preventDefault()
                                const updatedTodoItem = todoItem
                                updatedTodoItem.text = text
                                onUpdate(todoItem, updatedTodoItem)
                                onItemOnUpdateIndexChanged(-1)
                            }
                        }
                    >
                        <input 
                            className='flex-1 text-lg border rounded p-2'
                            value={text} 
                            onChange={(e) => setText(e.target.value)}
                        />
                        <button
                            className="mx-2"
                            type="submit"
                        >
                            <CheckIcon className="w-4 h-4" color="green"/>
                        </button>
                        <button
                            className="mx-2"
                            onClick={(e) => {
                                e.preventDefault()
                                onItemOnUpdateIndexChanged(-1)
                            }}   
                        >
                            <XMarkIcon className="w-4 h-4" color="red"/>
                        </button>
                    </form>   
                :
                    <div className="flex flex-row items-center">
                        <div className="flex-1 flex flex-row gap-2 items-center">
                            <input 
                                type='checkbox' 
                                checked={todoItem.done} 
                                    onChange={(e) => {
                                        onUpdate(todoItem, { done: !todoItem.done } as Prisma.ItemUpdateInput)
                                    }
                                }
                            />
                            <p className={`text-lg font-medium`}>{text}</p>
                        </div>
                        <div className="invisible group-hover:visible">
                            <button
                                className="mx-2"
                                onClick={() => onItemOnUpdateIndexChanged(todoItem.id)}    
                            >
                                <PencilIcon className="w-4 h-4"/>
                            </button>
                            <button
                                className="mx-2"
                                onClick={() => {
                                        onDelete(todoItem)

                                    }
                                }    
                            >
                                <XMarkIcon className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>
            }
        </div>
    )
}

export default TodoItem