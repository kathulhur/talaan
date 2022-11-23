import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

const createTodoList = async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log('todolists/create')
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const todoListData = JSON.parse(req.body)

    const savedTodoList = await prisma.todoList.create({
        data: todoListData
    })

    res.json(savedTodoList)
}

export default createTodoList