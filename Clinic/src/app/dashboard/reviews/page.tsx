'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  StarIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  UserIcon,
  HeartIcon,
  FlagIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface Review {
  id: string
  patient: {
    name: string
    avatar: string
    isVerified: boolean
  }
  rating: number
  title: string
  content: string
  date: string
  treatment: string
  helpful: number
  response?: {
    content: string
    date: string
  }
  images?: string[]
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: { [key: number]: number }
  monthlyTrend: number
  responseRate: number
}

export default function ReviewsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const reviewStats: ReviewStats = {
    averageRating: 4.8,
    totalReviews: 234,
    ratingDistribution: {
      5: 180,
      4: 32,
      3: 15,
      2: 5,
      1: 2
    },
    monthlyTrend: 12.5,
    responseRate: 95
  }

  const reviews: Review[] = [
    {
      id: '1',
      patient: {
        name: 'Sarah Johnson',
        avatar: 'SJ',
        isVerified: true
      },
      rating: 5,
      title: 'Exceptional dental care and service!',
      content: 'Dr. Smith and his team provided outstanding care during my dental implant procedure. The clinic is modern, clean, and the staff is incredibly professional. I felt comfortable throughout the entire process and the results exceeded my expectations.',
      date: '2024-01-14',
      treatment: 'Dental Implant',
      helpful: 12,
      response: {
        content: 'Thank you so much for your kind words, Sarah! We\'re thrilled that you had such a positive experience with us. Your comfort and satisfaction are our top priorities.',
        date: '2024-01-15'
      }
    },
    {
      id: '2',
      patient: {
        name: 'Mike Chen',
        avatar: 'MC',
        isVerified: true
      },
      rating: 5,
      title: 'Professional and caring team',
      content: 'I was nervous about my root canal treatment, but the team made me feel at ease. The procedure was painless and the follow-up care was excellent. Highly recommend this clinic!',
      date: '2024-01-12',
      treatment: 'Root Canal Treatment',
      helpful: 8
    },
    {
      id: '3',
      patient: {
        name: 'Emma Davis',
        avatar: 'ED',
        isVerified: false
      },
      rating: 4,
      title: 'Great results with teeth whitening',
      content: 'Very happy with my teeth whitening results. The process was quick and effective. The only minor issue was the waiting time, but the results made it worth it.',
      date: '2024-01-10',
      treatment: 'Teeth Whitening',
      helpful: 5,
      response: {
        content: 'Thank you for your feedback, Emma! We\'re glad you\'re happy with the whitening results. We\'re working on reducing wait times and appreciate your patience.',
        date: '2024-01-11'
      }
    },
    {
      id: '4',
      patient: {
        name: 'John Smith',
        avatar: 'JS',
        isVerified: true
      },
      rating: 5,
      title: 'Outstanding orthodontic treatment',
      content: 'The Invisalign treatment was exactly what I needed. Dr. Johnson explained everything clearly and the results are perfect. The clinic uses the latest technology and the staff is very knowledgeable.',
      date: '2024-01-08',
      treatment: 'Invisalign',
      helpful: 15
    },
    {
      id: '5',
      patient: {
        name: 'Lisa Anderson',
        avatar: 'LA',
        isVerified: true
      },
      rating: 3,
      title: 'Good service but room for improvement',
      content: 'The dental cleaning was thorough and the hygienist was gentle. However, the appointment was delayed by 30 minutes and the communication could be better.',
      date: '2024-01-05',
      treatment: 'Dental Cleaning',
      helpful: 3
    }
  ]

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    }
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.treatment.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'responded' && review.response) ||
                         (selectedFilter === 'unresponded' && !review.response) ||
                         (selectedFilter === 'high' && review.rating >= 4) ||
                         (selectedFilter === 'low' && review.rating <= 3)
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
          <p className="text-gray-600 mt-2">Monitor patient feedback and manage your clinic's reputation</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
          <button className="btn-primary flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Analytics Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          className="card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-center mb-4">
            {renderStars(reviewStats.averageRating, 'lg')}
          </div>
          <p className="text-3xl font-bold text-gray-900">{reviewStats.averageRating}</p>
          <p className="text-sm text-gray-500">Average Rating</p>
          <p className="text-xs text-green-600 flex items-center justify-center mt-2">
            <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
            +0.2 this month
          </p>
        </motion.div>

        <motion.div 
          className="card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{reviewStats.totalReviews}</p>
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-xs text-green-600 flex items-center justify-center mt-2">
            <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
            +{reviewStats.monthlyTrend}% this month
          </p>
        </motion.div>

        <motion.div 
          className="card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <HeartIcon className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{reviewStats.responseRate}%</p>
          <p className="text-sm text-gray-500">Response Rate</p>
          <p className="text-xs text-green-600 flex items-center justify-center mt-2">
            <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
            +5% this month
          </p>
        </motion.div>

        <motion.div 
          className="card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <StarIcon className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round((reviewStats.ratingDistribution[5] / reviewStats.totalReviews) * 100)}%
          </p>
          <p className="text-sm text-gray-500">5-Star Reviews</p>
          <p className="text-xs text-green-600 flex items-center justify-center mt-2">
            <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
            +3% this month
          </p>
        </motion.div>
      </div>

      {/* Rating Distribution */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Rating Distribution</h2>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviewStats.ratingDistribution[rating]
            const percentage = (count / reviewStats.totalReviews) * 100
            
            return (
              <div key={rating} className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <StarIconSolid className="h-4 w-4 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-red-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                <span className="text-sm text-gray-500 w-12 text-right">{percentage.toFixed(0)}%</span>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Patient Reviews</h2>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            {['all', 'high', 'low', 'responded', 'unresponded'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                <option value="">All Treatments</option>
                <option value="cleaning">Dental Cleaning</option>
                <option value="whitening">Teeth Whitening</option>
                <option value="implant">Dental Implant</option>
                <option value="root-canal">Root Canal</option>
              </select>
              <input
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </motion.div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {review.patient.avatar}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{review.patient.name}</h3>
                      {review.patient.isVerified && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      {renderStars(review.rating, 'sm')}
                      <span className="text-sm text-gray-500">{review.treatment}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <FlagIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                <p className="text-gray-700">{review.content}</p>
              </div>

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <HeartIcon className="h-4 w-4 mr-1" />
                    {review.helpful} helpful
                  </button>
                </div>
                
                {!review.response && (
                  <button className="btn-primary text-sm">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Respond
                  </button>
                )}
              </div>

              {/* Clinic Response */}
              {review.response && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">Response from SmileCare Dental</span>
                    <span className="text-xs text-blue-700">
                      {new Date(review.response.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800">{review.response.content}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}