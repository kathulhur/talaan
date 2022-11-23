import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

const createTodoItem = async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log('todoitems/create')
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const todoItemData = JSON.parse(req.body)

    const savedTodoItem = await prisma.item.create({
        data: todoItemData
    })

    res.json(savedTodoItem)
}

export default createTodoItem