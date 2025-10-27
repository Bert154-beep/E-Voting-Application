import React from 'react'
import { User, Calendar, Mail, Phone, CreditCard, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    return (
        <div>
            <div><Navbar/></div>
        <div className="min-h-screen  flex items-center justify-center py-2 px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-2xl">
                <h1 className="text-5xl font-bold text-blue-600 mb-8 ">Sign Up</h1>

                <div className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    {/* Father Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Father Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                placeholder="Enter father's name"
                            />
                        </div>
                    </div>

                    {/* Mother Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Mother Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                placeholder="Enter mother's name"
                            />
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Date of Birth
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="date"
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>

                    {/* CNIC */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            CNIC
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <CreditCard className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                placeholder="xxxxx-xxxxxxx-x"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full pl-12 pr-12 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full pl-12 pr-12 py-3 border-2 border-gray-900 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-full font-bold text-lg hover:bg-blue-700 transition-colors mt-8"
                    >
                        Register
                    </button>

                    <div className="text-center mt-6">
                        <span className="text-gray-900 font-medium">Already Have An Account? </span>
                        <Link to='/login' className="text-blue-600 font-bold hover:text-blue-700">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default SignUp