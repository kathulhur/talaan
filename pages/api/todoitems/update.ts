import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../src/utils/db'


const handleItemUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log('todolists/udpate')
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }
    const data = JSON.parse(req.body)
    const updatedItem = await prisma.item.update({
        where: {
            id: parseInt(data.todoItem.id as string)
        },
        data: data.itemUpdateInput
    })


    res.json(updatedItem)
}

export default handleItemUpdate