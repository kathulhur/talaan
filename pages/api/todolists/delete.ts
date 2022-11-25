import { TodoList } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../src/utils/db'


const handleTodoListDelete = async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log('todolists/delete')
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }
    const todoList = req.body as TodoList

    const deletedTodoItems = await prisma.item.deleteMany({
        where: {
            todoListId: todoList.id
        }
    })

    const deletedTodoList = await prisma.todoList.delete({
        where: {
            id: todoList.id
        }
    })


    res.json(deletedTodoList)
}

export default handleTodoListDelete