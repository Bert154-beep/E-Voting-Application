import React, { useState } from 'react'
import { User, Calendar, Mail, Phone, CreditCard, Lock, Eye, EyeOff } from 'lucide-react'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpSchema } from "../lib/schemas"

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  })

  const onSubmit = (data) => {
    console.log('Signup Data:', data)
  }

  return (
    <div>
      <div><Navbar /></div>
      <div className='min-h-screen flex items-center justify-center py-2 px-4'>
        <div className='bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-2xl'>
          <h1 className='text-5xl font-bold text-blue-600 mb-8'>Sign Up</h1>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div>
              <label className='block text-sm font-bold text-gray-900 mb-2'>Full Name</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <User className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  {...register('fullname')}
                  className='w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                  placeholder='Enter your full name'
                />
              </div>
              {errors.fullname && <p className='text-red-500 text-sm mt-1'>{errors.fullname.message}</p>}
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-900 mb-2'>Father Name</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <User className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  {...register('father_name')}
                  className='w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                  placeholder="Enter father's name"
                />
              </div>
              {errors.father_name && <p className='text-red-500 text-sm mt-1'>{errors.father_name.message}</p>}
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-900 mb-2'>Mother Name</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <User className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  {...register('mother_name')}
                  className='w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                  placeholder="Enter mother's name"
                />
              </div>
              {errors.mother_name && <p className='text-red-500 text-sm mt-1'>{errors.mother_name.message}</p>}
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-900 mb-2'>Date of Birth</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <Calendar className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='date'
                  {...register('date_of_birth')}
                  className='w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                />
              </div>
              {errors.date_of_birth && <p className='text-red-500 text-sm mt-1'>{errors.date_of_birth.message}</p>}
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-900 mb-2'>Email Address</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='email'
                  {...register('email_address')}
                  className='w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                  placeholder='Enter your email'
                />
              </div>
              {errors.email_address && <p className='text-red-500 text-sm mt-1'>{errors.email_address.message}</p>}
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-900 mb-2'>Phone Number</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <Phone className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='tel'
                  {...register('phone_no')}
                  className='w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                  placeholder='Enter your phone number'
                />
              </div>
              {errors.phone_no && <p className='text-red-500 text-sm mt-1'>{errors.phone_no.message}</p>}
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-900 mb-2'>CNIC</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <CreditCard className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  {...register('cnic_number')}
                  className='w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                  placeholder='xxxxx-xxxxxxx-x'
                />
              </div>
              {errors.cnic_number && <p className='text-red-500 text-sm mt-1'>{errors.cnic_number.message}</p>}
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-900 mb-2'>Password</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className='w-full pl-12 pr-12 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                  placeholder='Enter your password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-4 flex items-center'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  ) : (
                    <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  )}
                </button>
              </div>
              {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-900 mb-2'>Confirm Password</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirm_password')}
                  className='w-full pl-12 pr-12 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                  placeholder='Confirm your password'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute inset-y-0 right-0 pr-4 flex items-center'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  ) : (
                    <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className='text-red-500 text-sm mt-1'>{errors.confirm_password.message}</p>
              )}
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-3 px-6 rounded-full font-bold text-lg hover:bg-blue-700 transition-colors mt-8'
            >
              Register
            </button>

            <div className='text-center mt-6'>
              <span className='text-gray-900 font-medium'>Already Have An Account? </span>
              <Link to='/login' className='text-blue-600 font-bold hover:text-blue-700'>
                Log In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp
