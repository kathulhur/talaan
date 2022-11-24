import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../src/utils/db'


const handleItemUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log('todolists/delete')
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }
    const data = JSON.parse(req.body)
    const deletedItem = await prisma.item.update({
        where: {
            id: parseInt(data.deletedItem.id as string)
        },
        data: {
            deleted: true
        }
    })


    res.json(deletedItem)
}

export default handleItemUpdate