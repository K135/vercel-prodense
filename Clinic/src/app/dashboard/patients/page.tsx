'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon,
  UserIcon,
  PhoneIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  SparklesIcon,
  ClockIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  status: 'online' | 'offline' | 'away'
  isBookedPatient: boolean
}

interface Message {
  id: string
  senderId: string
  senderType: 'patient' | 'clinic' | 'ai'
  content: string
  timestamp: string
  type: 'text' | 'image' | 'document' | 'treatment-plan'
  isRead: boolean
}

export default function PatientsPage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const patients: Patient[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      avatar: 'SJ',
      lastMessage: 'Thank you for the treatment plan. When can we schedule the next appointment?',
      lastMessageTime: '2 min ago',
      unreadCount: 2,
      status: 'online',
      isBookedPatient: true
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 (555) 234-5678',
      avatar: 'MC',
      lastMessage: 'I have some questions about post-treatment care.',
      lastMessageTime: '15 min ago',
      unreadCount: 1,
      status: 'online',
      isBookedPatient: true
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      phone: '+1 (555) 345-6789',
      avatar: 'ED',
      lastMessage: 'The whitening results look amazing! Thank you so much.',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      status: 'away',
      isBookedPatient: true
    },
    {
      id: '4',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 456-7890',
      avatar: 'JS',
      lastMessage: 'Is there any follow-up needed for my implant?',
      lastMessageTime: '2 hours ago',
      unreadCount: 0,
      status: 'offline',
      isBookedPatient: true
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      phone: '+1 (555) 567-8901',
      avatar: 'LA',
      lastMessage: 'Hi, I would like to book an appointment for a consultation.',
      lastMessageTime: '3 hours ago',
      unreadCount: 1,
      status: 'online',
      isBookedPatient: false
    }
  ]

  const messages: Message[] = [
    {
      id: '1',
      senderId: '1',
      senderType: 'patient',
      content: 'Hi Dr. Smith, I wanted to ask about the treatment plan you sent me.',
      timestamp: '2024-01-15T10:30:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: '2',
      senderId: 'clinic',
      senderType: 'clinic',
      content: 'Hello Sarah! I\'m happy to discuss the treatment plan with you. What specific questions do you have?',
      timestamp: '2024-01-15T10:32:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: '3',
      senderId: '1',
      senderType: 'patient',
      content: 'I was wondering about the timeline for the procedures and the total cost.',
      timestamp: '2024-01-15T10:35:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: '4',
      senderId: 'clinic',
      senderType: 'clinic',
      content: 'The complete treatment will take approximately 3 months with 4 visits. I\'ll send you a detailed breakdown.',
      timestamp: '2024-01-15T10:37:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: '5',
      senderId: '1',
      senderType: 'patient',
      content: 'Thank you for the treatment plan. When can we schedule the next appointment?',
      timestamp: '2024-01-15T10:40:00Z',
      type: 'text',
      isRead: false
    }
  ]

  const aiSuggestions = [
    "I'd be happy to schedule your next appointment. What days work best for you?",
    "Let me check our availability and get back to you with some options.",
    "Based on your treatment plan, I recommend scheduling within the next 2 weeks.",
    "I'll have our scheduling coordinator reach out to you today."
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-400'
      case 'away':
        return 'bg-yellow-400'
      case 'offline':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedPatient) {
      // Handle sending message
      console.log('Sending message:', messageInput)
      setMessageInput('')
      setShowAISuggestions(false)
    }
  }

  const handleAISuggestion = (suggestion: string) => {
    setMessageInput(suggestion)
    setShowAISuggestions(false)
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex">
      {/* Patients List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Patient Messages</h1>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <FunnelIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedPatient(patient)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedPatient?.id === patient.id ? 'bg-primary-50 border-primary-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {patient.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(patient.status)}`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 truncate">{patient.name}</p>
                    <div className="flex items-center space-x-2">
                      {patient.isBookedPatient && (
                        <CheckIcon className="h-4 w-4 text-green-500" />
                      )}
                      {patient.unreadCount > 0 && (
                        <span className="bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {patient.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-1">{patient.lastMessage}</p>
                  <p className="text-xs text-gray-400 mt-1">{patient.lastMessageTime}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedPatient ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedPatient.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(selectedPatient.status)}`}></div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selectedPatient.name}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{selectedPatient.email}</span>
                      <span>{selectedPatient.phone}</span>
                      {selectedPatient.isBookedPatient && (
                        <span className="flex items-center text-green-600">
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Booked Patient
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <PhoneIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <VideoCameraIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <DocumentTextIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderType === 'clinic' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderType === 'clinic'
                      ? 'bg-primary-500 text-white'
                      : message.senderType === 'ai'
                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {message.senderType === 'ai' && (
                      <div className="flex items-center mb-1">
                        <SparklesIcon className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">AI Suggestion</span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderType === 'clinic' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Suggestions */}
            {showAISuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-3 border-t border-gray-200 bg-blue-50"
              >
                <div className="flex items-center mb-2">
                  <SparklesIcon className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-900">AI Suggestions</span>
                </div>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleAISuggestion(suggestion)}
                      className="block w-full text-left p-2 text-sm text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Message Input */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAISuggestions(!showAISuggestions)}
                  className={`p-2 rounded-lg transition-colors ${
                    showAISuggestions 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <SparklesIcon className="h-5 w-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 pr-12"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <DocumentTextIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a patient to start messaging</h3>
              <p className="text-gray-500">Choose a patient from the list to view and respond to their messages.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}