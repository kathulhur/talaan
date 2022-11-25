import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../src/utils/db'


const handleItemUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log('todolists/delete')
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }
    const todoItem = req.body
    const deletedItem = await prisma.item.delete({
        where: {
            id: parseInt(todoItem.id as string)
        }
    })

    res.json(deletedItem)
}

export default handleItemUpdate