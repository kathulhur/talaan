import NextAuth, { Account, Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import GithubProvider from "next-auth/providers/github"

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()


export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, account }: {token: JWT, account: Account}): Promise<JWT> {
      // Persist the OAuth access_token to the token right after signin
      const storedUser = await prisma.user.findUnique({
        where: {
          id: token.sub
        } 
      })

      if (!storedUser) {
        await prisma.user.create({
          data: {
            id: token.sub as string,
            name: token.name,
            email: token.email as string,
            photo: token.picture
          }
        })
      }

      if (account) {
        token.accessToken = account.access_token
      }

      return token
    },
    async session({ session, token, user }: {session: Session, token: JWT, user: User}): Promise<Session>{
      // Send properties to the client, like an access_token from a provider.
      if (session?.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  }
}





//@ts-ignore
export default NextAuth(authOptions)