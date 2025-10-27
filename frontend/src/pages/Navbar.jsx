import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
        <div className='flex items-center'>
        <Link className='cursor-pointer' to='/'><p className='w-full p-5 text-5xl font-bold text-blue-500'>TrueVote</p></Link>
        <ul className=' flex items-center justify-end w-full p-8 gap-10'>
            <li><Link to='/aboutus'><button className='p-2 font-serif hover:bg-blue-500 cursor-pointer hover:text-white hover:font-bold text-lg rounded-4xl'>About</button></Link></li>
            <li><Link to='/contactus'><button className='p-2 font-serif hover:bg-blue-500 cursor-pointer hover:text-white hover:font-bold text-lg rounded-4xl'>Contact</button></Link></li>
            <li><Link to='/signup'><button className='p-2 font-serif hover:bg-blue-500 cursor-pointer hover:text-white hover:font-bold text-lg rounded-4xl'>Register</button></Link></li>
        </ul>

        </div>
    </div>
  )
}

export default Navbar