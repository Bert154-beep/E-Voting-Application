import React from 'react'
import Navbar from './Navbar'
import { EyeIcon, EyeOff, Lock, UserIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Login = () => {

    const [Password, setPassword] = useState(false)

    return (
        <div>
            <div><Navbar /></div>
            <div className='flex items-center justify-center w-full mt-15'>
                <div className='shadow-2xl w-[500px] h-[500px] rounded-3xl'>
                    <div className='p-5'><p className='text-5xl font-bold text-blue-500'>Login</p></div>
                    <div className='p-5'>
                        <p className='ml-1 font-bold'>Email Address</p>
                        <div className='p-3 rounded-2xl gap-2 flex items-center border-2 border-black  focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent w-full transition-all w-full'>
                            <UserIcon className='text-gray-400' />
                            <input type="text" className='outline-none w-full' placeholder='Enter Your Email Address' />
                        </div>
                    </div>
                    <div className='p-5'>
                        <p className='ml-1 font-bold'>Password</p>
                        <div className='p-3 rounded-2xl gap-2 flex items-center border-2 border-black focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent w-full transition-all'>
                            <Lock className='text-gray-400' />
                            <input
                                type={Password ? 'text' : 'password'}
                                className='outline-none w-full'
                                placeholder='Enter Your Password'
                            />
                            <button
                                type='button'
                                onClick={() => setPassword(!Password)}
                            >
                                {Password ? <EyeOff className='text-gray-400'/> : <EyeIcon className='text-gray-400'/>}
                            </button>
                        </div>
                    </div>
                    <div className='flex items-center justify-center mt-5'><button className='w-[200px] bg-blue-500 p-3 rounded-3xl font-bold text-white hover:opacity-90 cursor-pointer'>Log In</button></div>
                    <div className='mt-5 p-5'><p className='font-bold'>Dont Have An Account? <Link to='/signup' className='text-blue-500 hover:opacity-70'>Create Account</Link></p></div>
                </div>
            </div>
        </div>
    )
}

export default Login