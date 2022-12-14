import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../src/utils/db'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.query
    if (email) {
        const storedUser = await prisma.user.findUnique({
            where: {
                email: email as string
            }
        })

        if (storedUser) {
            return res.json({ storedUser })
        } else {
            return res.status(400).json({ message: 'User not found'})
        }
    }

    return res.status(400).json({ message: 'Missing email query parameter' })
}