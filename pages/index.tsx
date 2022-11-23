import Footer from '../src/components/Footer'
import Header from '../src/components/Header'
import TodoLists from '../src/components/TodoLists'
import { NextPage } from 'next'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

export interface HomePageProps {
  // session: Session
}

 const HomePage: NextPage<HomePageProps> = ({}) => {
    // database
    const { data: session, status } = useSession()
    const router = useRouter()

    

    if (status === 'loading') {
        return <p>Loading...</p>
    }

    if (status === 'unauthenticated') {
        signIn()
    }


    


      return (
        <div className='flex flex-col min-h-screen'>
            <div className='flex-1 mx-24 mt-12'>
                <Header />
                {session?.user && <TodoLists userId={session.user.id}/> }
            </div>
            <Footer />
            
        </div>
    )
}

export default HomePage