import TodoItems from "./TodoItems"
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'
import { useState } from "react"
import { TodoListProps } from "../types/propTypes"


const TodoList: React.FC<TodoListProps> = ({todoList, onUpdate, onDelete}) => {
    // console.log('TodoList')
    const [menuClicked, setMenuClicked] = useState(false)


    return (
        <div className="flex flex-col border px-12 py-14 rounded-lg shadow">
            <div className="flex flex-row justify-between items-center mb-6">
                <h2 className="text-4xl font-bold">{todoList.title}</h2>
                <div className="group relative flex items-center">
                    <button
                        className={`${menuClicked && 'duration-75 -rotate-45'}`}
                        onClick={() => setMenuClicked(!menuClicked)}
                    >
                        {!menuClicked && <Bars3Icon className="w-6 h-6"/>}
                        {menuClicked && <XMarkIcon className={`w-6 h-6 rotate-45`}/>}
                    </button>
                    <div className={`${!menuClicked && 'hidden'} text-center p-2 bg-red-500 hover:bg-red-600 rounded-lg absolute right-0 top-8 w-40`}>
                        <button 
                            className="w-full text font-semibold text-white"
                            onClick={() => {
                                onDelete(todoList)
                            }}    
                        >
                            Delete Todo
                        </button>
                    </div>
                </div>
            </div>
            <p className="font-semibold">Notes:</p>
            <p className="italic mb-6">{todoList.note}</p>

            <hr />
            <div className="flex-1">
                <TodoItems todoListId={todoList.id}/>
            </div>

            <p className="text-xs font-semibold italic opacity-75 mt-8">Created: December 20, 2022</p>
        </div>
    )
}


export default TodoList