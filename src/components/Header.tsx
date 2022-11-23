import Image from 'next/image'
import { useSession, signIn, signOut } from "next-auth/react"


const Header: React.FC = () => {
    const { data: session } = useSession()
    return (
        <div className="flex justify-between bg-gray-100 p-6 rounded">
            <div className='flex items-center'>
                <h2 className='text-2xl font-bold'>Talaan</h2>
            </div>
            <div>
                {session && (
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={() => signOut()}
                            >
                            SignOut
                        </button>
                        <Image
                            className='rounded-full'
                            src={session.user?.image as string}
                            alt='a user avatar'
                            width={64}
                            height={64}
                            placeholder={'blur'}
                        />
                    </div>
                )}
                {!session && (
                    <button
                        onClick={() => signIn()}
                    >
                        SignIn
                    </button>
                )}
            </div>
        </div>
    )
}



export default Header