import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import NextAuth from "next-auth/next"
import { NextApiRequest, NextApiResponse } from "next"

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await unstable_getServerSession(req, res, authOptions as any)
    if (session) {
        res.send({
        content:
            "This is protected content. You can access this content because you are signed in.",
        })
    } else {
        res.send({
        error: "You must be signed in to view the protected content on this page.",
        })
    }
}

export default restricted