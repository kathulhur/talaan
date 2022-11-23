import Footer from '../../src/components/Footer'
import Header from '../../src/components/Header'
import {PlusIcon} from '@heroicons/react/24/outline'
import TodoLists from '../../src/components/TodoLists'
import AddTodoModal from '../../src/components/AddTodoModal'
import { useState } from 'react'
import {  NextPage } from 'next'
import { TodoList, User } from '@prisma/client'
import { useRouter } from 'next/router'



export interface HomePageProps {
    initialTodoLists: TodoList[]
}

 const HomePage: NextPage<HomePageProps> = ({initialTodoLists}) => {
    // database
    const router = useRouter()
    const { userId } = router.query
    const [show, setShow] = useState(false)


    const handleCreate = (title: string, note: string) => {
      // const newTodoList = {
      //   title: title,
      //   note,
      //   authorId: userId as string
      // }
      
      // setTodoLists([newTodoList, ...todoLists])
      // setShow(!show)
    }

    return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex-1 mx-24 mt-12'>
        <Header />
        <div className='mt-12'>
          <button 
            className='flex align-center gap-2 font-bold rounded-full text-white bg-green-500 hover:bg-green-600 py-2 px-4'
            onClick={() => setShow(!show)}
          >
            <PlusIcon className='className="h-6 w-6 text-white-500'/>
            Add New List
          </button>
        </div>
        <TodoLists userId={userId as string}/>
      </div>
      <Footer />

      <AddTodoModal show={show} setShow={setShow} onCreate={handleCreate}/>
    </div>
  )
}

export default HomePage