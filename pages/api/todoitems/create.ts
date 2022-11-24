import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../src/utils/db'

const createTodoItem = async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log('todoitems/create')
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const todoItemInput = req.body

    const savedTodoItem = await prisma.item.create({
        data: todoItemInput
    })

    res.json(savedTodoItem)
}

export default createTodoItem