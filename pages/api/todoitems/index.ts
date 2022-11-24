import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../src/utils/db'


export default async function getTodoItems(req: NextApiRequest, res: NextApiResponse) {
    // console.log('todoItems/index')
    const { todoId } = req.query
    if (todoId) {
        const todoItems = await prisma.item.findMany({
            where: {
                todoListId: parseInt(todoId as string),
                deleted: false
            }
        })
        return res.json({ todoItems: todoItems})
    }
    return res.status(404).json({message: 'Error Fetching todoLists'})

}