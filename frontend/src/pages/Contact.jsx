import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, MessageCircle, Shield, Globe, CheckCircle, MoveLeftIcon } from 'lucide-react';


const Contact = () => {
    return (
        <div>
            <div className='p-5 flex items-center  '>
                <div><Link to="/"><MoveLeftIcon className='text-blue-500' size={32} /></Link></div>
                <p className='text-5xl flex justify-center w-full font-bold text-blue-500'>Contact Us</p>
            </div>
            <div>
                <div className="bg-gray-50 min-h-screen">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                       

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                                <div className="flex items-start mb-4">
                                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                        <Mail className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">General Inquiries</h3>
                                        <p className="text-gray-700 mb-3">For all non-technical questions about our mission, vision, or general operations, please email us at:</p>
                                        <a href="mailto:info@truevoteapp.com" className="text-blue-600 hover:text-blue-700 font-medium text-lg">
                                            info@truevoteapp.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                                <div className="flex items-start mb-4">
                                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                        <Mail className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Technical Support ⚙️</h3>
                                        <p className="text-gray-700 mb-3">If you are experiencing issues with the app, need help registering, or have a security concern, contact our dedicated support team:</p>
                                        <a href="mailto:support@truevoteapp.com" className="text-blue-600 hover:text-blue-700 font-medium text-lg">
                                            abc@truevoteapp.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                                <div className="flex items-start mb-4">
                                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                        <Mail className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Partnerships & Media 🤝</h3>
                                        <p className="text-gray-700 mb-3">For media inquiries, potential collaborations, or business partnerships:</p>
                                        <a href="mailto:partnerships@truevoteapp.com" className="text-blue-600 hover:text-blue-700 font-medium text-lg">
                                            abc@gmail.com
                                        </a>
                                    </div>
                                </div>
                            </div> */}

                            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                                <div className="flex items-start mb-4">
                                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                        <Phone className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Phone Support 📞</h3>
                                        <p className="text-gray-700 mb-3">You can speak to a representative during business hours (Mon-Fri, 9am - 5pm PKT):</p>
                                        <a href="tel:+15551234567" className="text-blue-600 hover:text-blue-700 font-medium text-lg">
                                            012-34568-910
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
                            <div className="flex items-start">
                                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                    <MapPin className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Mailing Address</h3>
                                    <div className="text-gray-700 text-lg leading-relaxed">
                                        <p className="font-semibold">TrueVote Headquarters</p>
                                        <p>Karachi, Sindh</p>
                                        <p>Pakistan</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                      
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact