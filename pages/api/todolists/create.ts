import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../src/utils/db'

const createTodoList = async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log('todolists/create')
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }
    
    const todoListCreateInput = req.body

    const savedTodoList = await prisma.todoList.create({
        data: todoListCreateInput
    })

    res.json(savedTodoList)
}

export default createTodoList