'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon,
  HeartIcon,
  BookmarkIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TagIcon,
  UserIcon,
  ClockIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

interface ForumPost {
  id: string
  author: {
    name: string
    avatar: string
    specialty: string
    isVerified: boolean
    reputation: number
  }
  title: string
  content: string
  tags: string[]
  timestamp: string
  likes: number
  replies: number
  views: number
  isLiked: boolean
  isBookmarked: boolean
  category: 'question' | 'discussion' | 'case-study' | 'announcement'
}

interface Reply {
  id: string
  author: {
    name: string
    avatar: string
    specialty: string
    isVerified: boolean
  }
  content: string
  timestamp: string
  likes: number
  isLiked: boolean
}

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null)

  const categories = [
    { id: 'all', name: 'All Posts', count: 156 },
    { id: 'question', name: 'Questions', count: 45 },
    { id: 'discussion', name: 'Discussions', count: 67 },
    { id: 'case-study', name: 'Case Studies', count: 28 },
    { id: 'announcement', name: 'Announcements', count: 16 }
  ]

  const popularTags = [
    'Orthodontics', 'Implants', 'Cosmetic', 'Pediatric', 'Endodontics', 
    'Periodontics', 'Oral Surgery', 'Preventive', 'Emergency', 'Technology'
  ]

  const forumPosts: ForumPost[] = [
    {
      id: '1',
      author: {
        name: 'Dr. Sarah Mitchell',
        avatar: 'SM',
        specialty: 'Orthodontist',
        isVerified: true,
        reputation: 2450
      },
      title: 'Best practices for Invisalign treatment planning in complex cases',
      content: 'I\'ve been working on a particularly challenging case involving severe crowding and a Class II malocclusion. The patient is an adult who specifically requested Invisalign over traditional braces. I\'m curious about your experiences with similar cases and any tips for treatment planning...',
      tags: ['Orthodontics', 'Invisalign', 'Treatment Planning'],
      timestamp: '2024-01-15T10:30:00Z',
      likes: 24,
      replies: 12,
      views: 156,
      isLiked: false,
      isBookmarked: true,
      category: 'discussion'
    },
    {
      id: '2',
      author: {
        name: 'Dr. Michael Chen',
        avatar: 'MC',
        specialty: 'Oral Surgeon',
        isVerified: true,
        reputation: 3200
      },
      title: 'Question: Post-operative care for wisdom tooth extraction in diabetic patients',
      content: 'I have a 45-year-old diabetic patient (HbA1c: 8.2%) who needs all four wisdom teeth extracted. I\'m looking for advice on modified post-operative protocols and any special considerations for healing in diabetic patients...',
      tags: ['Oral Surgery', 'Diabetes', 'Post-operative Care'],
      timestamp: '2024-01-14T15:45:00Z',
      likes: 18,
      replies: 8,
      views: 89,
      isLiked: true,
      isBookmarked: false,
      category: 'question'
    },
    {
      id: '3',
      author: {
        name: 'Dr. Emily Rodriguez',
        avatar: 'ER',
        specialty: 'Pediatric Dentist',
        isVerified: true,
        reputation: 1890
      },
      title: 'Case Study: Managing dental anxiety in a 6-year-old with autism',
      content: 'I wanted to share a recent case that challenged my approach to pediatric care. The patient is a 6-year-old with autism spectrum disorder who needed multiple restorations. Here\'s how we successfully completed the treatment...',
      tags: ['Pediatric', 'Special Needs', 'Behavior Management'],
      timestamp: '2024-01-13T09:20:00Z',
      likes: 31,
      replies: 15,
      views: 203,
      isLiked: false,
      isBookmarked: false,
      category: 'case-study'
    },
    {
      id: '4',
      author: {
        name: 'Dr. James Wilson',
        avatar: 'JW',
        specialty: 'Endodontist',
        isVerified: true,
        reputation: 2750
      },
      title: 'New research on regenerative endodontics - thoughts?',
      content: 'Just read an interesting paper on regenerative endodontic procedures in immature permanent teeth. The success rates are quite promising. Has anyone here started incorporating these techniques into their practice?',
      tags: ['Endodontics', 'Research', 'Regenerative'],
      timestamp: '2024-01-12T14:10:00Z',
      likes: 22,
      replies: 9,
      views: 134,
      isLiked: false,
      isBookmarked: true,
      category: 'discussion'
    }
  ]

  const replies: Reply[] = [
    {
      id: '1',
      author: {
        name: 'Dr. Lisa Park',
        avatar: 'LP',
        specialty: 'Orthodontist',
        isVerified: true
      },
      content: 'Great question! I\'ve had success with similar cases by using auxiliary appliances like TADs for better anchorage control. The key is detailed biomechanical analysis before starting.',
      timestamp: '2024-01-15T11:15:00Z',
      likes: 8,
      isLiked: false
    },
    {
      id: '2',
      author: {
        name: 'Dr. Robert Kim',
        avatar: 'RK',
        specialty: 'Orthodontist',
        isVerified: false
      },
      content: 'I agree with Dr. Park. Also consider staging the treatment - sometimes breaking it into phases can help achieve better results in complex cases.',
      timestamp: '2024-01-15T12:30:00Z',
      likes: 5,
      isLiked: true
    }
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'question':
        return 'bg-blue-100 text-blue-800'
      case 'discussion':
        return 'bg-green-100 text-green-800'
      case 'case-study':
        return 'bg-purple-100 text-purple-800'
      case 'announcement':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredPosts = forumPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
          <p className="text-gray-600 mt-2">Connect with fellow dental professionals and share knowledge</p>
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
            <PlusIcon className="h-5 w-5 mr-2" />
            New Post
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Categories */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-medium">{category.name}</span>
                  <span className="text-sm text-gray-500">{category.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
            <div className="space-y-3">
              {forumPosts.slice(0, 3).map((post, index) => (
                <div key={post.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {post.author.avatar}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{post.author.name}</p>
                      {post.author.isVerified && (
                        <CheckBadgeIcon className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{post.author.reputation} points</p>
                  </div>
                  <div className="text-sm font-medium text-primary-600">#{index + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm">
                  <option>Most Recent</option>
                  <option>Most Popular</option>
                  <option>Most Replies</option>
                </select>
              </div>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-gray-50 rounded-xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    <option value="">All Specialties</option>
                    <option value="orthodontics">Orthodontics</option>
                    <option value="oral-surgery">Oral Surgery</option>
                    <option value="pediatric">Pediatric</option>
                    <option value="endodontics">Endodontics</option>
                  </select>
                  <input
                    type="date"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    <option value="">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </motion.div>
            )}
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {post.author.avatar}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900">{post.author.name}</h3>
                        {post.author.isVerified && (
                          <CheckBadgeIcon className="h-4 w-4 text-blue-500" />
                        )}
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{post.author.specialty}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4" />
                        <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          <TagIcon className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button className={`flex items-center space-x-1 text-sm transition-colors ${
                          post.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                        }`}>
                          {post.isLiked ? (
                            <HeartIconSolid className="h-4 w-4" />
                          ) : (
                            <HeartIcon className="h-4 w-4" />
                          )}
                          <span>{post.likes}</span>
                        </button>
                        
                        <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary-600 transition-colors">
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                          <span>{post.replies}</span>
                        </button>
                        
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <EyeIcon className="h-4 w-4" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className={`p-2 rounded-lg transition-colors ${
                          post.isBookmarked ? 'text-yellow-600 bg-yellow-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }`}>
                          <BookmarkIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                          <ShareIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                          <EllipsisHorizontalIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPost(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedPost.title}</h2>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <EllipsisHorizontalIcon className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            {/* Post Content */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedPost.author.avatar}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{selectedPost.author.name}</h3>
                    {selectedPost.author.isVerified && (
                      <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{selectedPost.author.specialty} • {selectedPost.author.reputation} points</p>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700">{selectedPost.content}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    <TagIcon className="h-4 w-4 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Replies */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Replies ({replies.length})</h3>
              <div className="space-y-4">
                {replies.map((reply) => (
                  <div key={reply.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {reply.author.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{reply.author.name}</h4>
                        {reply.author.isVerified && (
                          <CheckBadgeIcon className="h-4 w-4 text-blue-500" />
                        )}
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{reply.author.specialty}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{new Date(reply.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{reply.content}</p>
                      <div className="flex items-center space-x-4">
                        <button className={`flex items-center space-x-1 text-sm transition-colors ${
                          reply.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                        }`}>
                          {reply.isLiked ? (
                            <HeartIconSolid className="h-4 w-4" />
                          ) : (
                            <HeartIcon className="h-4 w-4" />
                          )}
                          <span>{reply.likes}</span>
                        </button>
                        <button className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Reply Form */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <textarea
                  rows={3}
                  placeholder="Write your reply..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
                <div className="flex justify-end mt-3">
                  <button className="btn-primary">Post Reply</button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}