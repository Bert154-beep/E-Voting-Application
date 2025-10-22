import React from 'react'
import Navbar from './Navbar'
import { MoveLeftIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, MessageCircle, Shield, Globe, CheckCircle } from 'lucide-react';


const About = () => {
  return (
    <div>
        <div className='p-5 flex items-center  '>
            <div><Link to="/"><MoveLeftIcon className='text-blue-500' size={32}/></Link></div>
            <p className='text-5xl flex justify-center w-full font-bold text-blue-500'>About TrueVote</p>
        </div>
         <div className="bg-gray-50 min-h-screen">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
     

      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-12">
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          TrueVote is dedicated to making the democratic process more accessible, secure, and transparent for everyone.
        </p>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          In an age where technology drives connection, we believe the power of your vote should be as close as your fingertips. Our platform replaces traditional, time-consuming methods with a modern, streamlined e-voting system. We utilize cutting-edge security and encryption protocols to ensure every ballot is private, verifiable, and counted accurately.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          We are committed to increasing voter participation and restoring confidence in elections.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">With TrueVote, you get:</h2>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
            <div className="inline-block p-4 bg-blue-600 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Security</h3>
            <p className="text-gray-700">Your vote is protected by the highest standards of digital security.</p>
          </div>

          <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
            <div className="inline-block p-4 bg-blue-600 rounded-full mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Accessibility</h3>
            <p className="text-gray-700">Vote anytime, anywhere, from your own device.</p>
          </div>

          <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
            <div className="inline-block p-4 bg-blue-600 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Transparency</h3>
            <p className="text-gray-700">A clear, auditable trail ensures the integrity of every election.</p>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-2xl font-bold text-gray-900 mb-4">Be a part of the decision.</p>
          <p className="text-3xl font-bold text-blue-600">Vote Today.</p>
        </div>
      </div>
    </div>
  </div>
    </div>
  )
}

export default About