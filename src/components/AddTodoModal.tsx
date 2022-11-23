import { Prisma } from "@prisma/client"
import { SetStateAction, useState } from "react"

export interface AddTodoModalProps {
    show: boolean
    setShow: React.Dispatch<SetStateAction<boolean>>
    onCreate: (title: string, note: string) => void
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({show, setShow, onCreate}) => {
    const [title, setTitle] = useState('')
    const [note, setNote] = useState('')
    return (
        <div className={`${!show && 'hidden'}`}>
            <div 
                className="fixed inset-0 bg-white flex justify-center items-center opacity-40">
            </div>
            <div 
                className="fixed inset-0 flex justify-center items-center w-">
                <div className="p-12 bg-white border drop-shadow-lg rounded">
                    <h2 className="text-2xl font-bold mb-8">New Todo</h2>
                    <form 
                        className="flex flex-col gap-y-8"
                        onSubmit={(e) => {
                            e.preventDefault()
                            onCreate(title, note)
                            setTitle('')
                            setNote('')
                            setShow(!show)
                            
                        }}
                        onReset={(e) => {
                            e.preventDefault()
                            setTitle('')
                            setNote('')
                            setShow(!show)
                        }}
                    
                    >
                        <label htmlFor="title">
                            <span className="block text-sm font-medium mr-4">Title</span>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text text-sm font-medium border rounded h-10 py-2 px-4 w-96"
                                />
                        </label>
                        <label htmlFor="note">
                            <span className="block text-sm font-medium mr-4">Note</span>
                            <textarea
                                id="note"
                                rows={5}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="text text-sm border w-full rounded py-2 px-4"
                                />
                        </label>
                        <div
                            className="flex flex-col gap-y-2"
                        >
                            <button
                                type="submit"
                                className="text-white font-medium border rounded-full py-2 bg-green-500"
                                >
                                Create
                            </button>
                            <button
                                type='reset'
                                className="text-white font-medium border rounded-full py-2 bg-red-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default AddTodoModal