import React from 'react'
import Navbar from './Navbar'
import { AlertCircle, Lock, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';


const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Navbar/>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">
          {/* Illustration Side */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-32 h-32 text-blue-600" strokeWidth={1.5} />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-600 rounded-lg opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-600 rounded-lg opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

          {/* Content Side */}
          <div className="flex-1 text-center md:text-left">
            <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              Oops! The page you're looking for seems to have wandered off the ballot. 
              Let's get you back on track to make your voice heard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/"><button className="flex items-center justify-center gap-2 cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
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

export default NotFoundPage