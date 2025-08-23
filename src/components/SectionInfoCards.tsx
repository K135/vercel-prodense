'use client'

import React, { useState } from 'react'

interface SectionInfoCardsProps {
  className?: string
}

// Star Rating Component
const StarRating = () => {
  return (
    <div className="flex justify-center gap-1">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className="w-6 h-6 text-yellow-400 animate-pulse"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

const SectionInfoCards: React.FC<SectionInfoCardsProps> = ({ className = '' }) => {
  const [selectedCity, setSelectedCity] = useState('')

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
    'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
    'Faridabad', 'Meerut'
  ]

  return (
    <section className={`pt-4 pb-8 lg:pt-6 lg:pb-12 ${className}`}>
      {/* Soft light-blue background */}
      <div className="bg-gradient-to-br from-blue-50 to-sky-50 py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Card 1: Reviews */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                {/* Rating with stars */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Rated 4.9/5</p>
                  <div className="mb-4">
                    <StarRating />
                  </div>
                </div>
                
                {/* Main text */}
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  3 Lakh+ Happy Reviews
                </h3>
                
                {/* Google Verified */}
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Google Verified</span>
                </div>
              </div>
            </div>

            {/* Card 2: Clinics */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
                  600+ Clinics across 26 cities
                </h3>
                
                {/* City Dropdown */}
                <div className="mb-4">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 bg-white"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Find Clinic Button */}
                <button className="w-full bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                  Start Your Journey
                </button>
              </div>
            </div>

            {/* Card 3: Global Presence */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  Support over 94 countries
                </h3>
                <p className="text-gray-600 font-medium mb-6">
                  Global partnerships ensure continuous care and peace of mind, wherever you are
                </p>
                
                {/* Talk to Expert Button */}
                <button className="w-full bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                  Talk to an expert
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default SectionInfoCards