import React from 'react'
import Navbar from './Navbar'
import VoteSvg from '../assets/Election.png'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
        <div><Navbar/></div>
        <div className='grid grid-cols-2'>
        <div className='flex items-center h-[600px]'>
            <img className='h-[500px]' src={VoteSvg} alt="" />
        </div>
            <div className='flex flex-col gap-10 items-center  mt-32'>
                <p className='font-bold text-5xl'>Be A Part Of Decision</p>
                <p className='text-5xl font-bold text-blue-500'>Vote Today</p>
                <div className='flex gap-10'>
                    <Link to='/aboutus'><button className='w-[200px] bg-blue-500 p-3 text-white font-bold rounded-3xl cursor-pointer hover:opacity-80'>About</button></Link>
                    <Link to='/login'><button className='w-[200px] bg-blue-500 p-3 text-white font-bold rounded-3xl cursor-pointer hover:opacity-80'>Log In</button></Link>
                </div>
                <p className='font-bold mt-32 text-xl'>Secure and transparent e-voting at your fingertips. Make your voice heard.</p>
            </div>
        </div>
    </div>
  )
}

export default HomePage