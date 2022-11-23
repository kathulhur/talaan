import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    // console.log('todolists/index')
    const {userId} = req.query
    if (userId) {
        const todoLists = await prisma.todoList.findMany({
            where: {
                authorId: userId as string,
                deleted: false
            }
        })
        return res.json({ todoLists: todoLists})
    }
    return res.status(404).json({message: 'Error Fetching todoLists'})

}