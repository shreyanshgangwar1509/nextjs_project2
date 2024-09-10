'use client'
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from './ui/button';

function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user as User

    
    

    return (
       <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 md:p-6 shadow-lg">
  <div className="container mx-auto flex justify-between items-center">
    <a href="#" className="text-2xl font-extrabold text-white tracking-wide hover:scale-105 transform transition duration-300">
      Mystry Message
    </a>
    {
      session ? (
        <>
          <span className="text-white text-lg mr-4">
            Welcome, {user.username || user.email}
          </span>
          <Button onClick={() => signOut()} className="bg-white text-indigo-600 px-5 py-2 rounded-full shadow-md hover:bg-indigo-600 hover:text-white hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            Logout
          </Button>
        </>
      ) : (
        <Link href="/sign-in">
          <Button className="bg-white text-pink-600 px-5 py-2 rounded-full shadow-md hover:bg-pink-600 hover:text-white hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            Login
          </Button>
        </Link>
      )
    }
  </div>
</nav>

  )
}

export default Navbar