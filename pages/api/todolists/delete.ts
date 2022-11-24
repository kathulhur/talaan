import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../src/utils/db'


const handleTodoListDelete = async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log('todolists/delete')
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }
    const data = JSON.parse(req.body)
    const deletedTodoList = await prisma.todoList.update({
        where: {
            id: parseInt(data.todoList.id as string)
        },
        data: {
            deleted: true
        }
    })


    res.json(deletedTodoList)
}

export default handleTodoListDelete