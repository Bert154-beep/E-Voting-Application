import React from 'react'
import Navbar from './Navbar'
import { AlertCircle, Lock, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';


const AccessDeniedPage = () => {
  return (
     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar/>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 bg-red-100 rounded-full flex items-center justify-center">
                <Lock className="w-32 h-32 text-red-600" strokeWidth={1.5} />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-red-600 rounded-lg opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-red-600 rounded-lg opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="text-8xl font-bold text-red-600 mb-4">403</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-lg text-gray-600 mb-8">
              You don't have permission to access this page. Please verify your credentials 
              or contact support if you believe this is an error.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
              <p className="text-sm text-gray-700">
                <strong>Need access?</strong> Make sure you're logged in with the correct account 
                or register if you haven't already.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/login"><button className="flex cursor-pointer items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                Log In
              </button></Link>
              <Link to="/"><button className="flex cursor-pointer items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors border-2 border-blue-600">
                <Home className="w-5 h-5" />
                Go Home
              </button></Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-600">
        Secure and transparent e-voting at your fingertips. Make your voice heard.
      </div>
    </div>
  )
}

export default AccessDeniedPage