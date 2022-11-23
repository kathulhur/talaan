import Footer from '../src/components/Footer'
import Header from '../src/components/Header'
import {PlusIcon} from '@heroicons/react/24/outline'
import TodoLists from '../src/components/TodoLists'
import AddTodoModal from '../src/components/AddTodoModal'
import { useEffect, useState } from 'react'
import {  GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
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
        router.push('/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F')
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