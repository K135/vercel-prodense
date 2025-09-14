'use client'

import { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { 
  SparklesIcon, 
  PaperAirplaneIcon, 
  MicrophoneIcon,
  XMarkIcon,
  HeartIcon,
  MapPinIcon,
  CalendarIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import GeminiBorder from '../GeminiBorder'

const quickSuggestions = [
  {
    icon: HeartIcon,
    text: "I need a smile makeover",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: MapPinIcon,
    text: "Best dental clinics in Jaipur",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: CalendarIcon,
    text: "Plan my dental vacation",
    color: "from-purple-500 to-violet-500"
  },
  {
    icon: HeartIcon,
    text: "What are the costs?",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: MapPinIcon,
    text: "Show me before/after photos",
    color: "from-[#D35C2F] to-red-500"
  }
]

const dentalQuestions = [
  "My tooth aches, what should I do?",
  "Why do my gums bleed when I brush?",
  "How often should I visit the dentist?",
  "What's the best way to prevent cavities?",
  "Do I need my wisdom teeth removed?",
  "How does teeth whitening work?",
  "Will whitening make my teeth sensitive?",
  "My filling fell out, what should I do?",
  "Do root canals hurt?",
  "Can a chipped tooth be fixed?",
  "How long do dental implants last?",
  "What's the difference between braces and Invisalign?",
  "My tooth is loose, can it be saved?",
  "How much does a dental check-up cost?",
  "Can I replace a missing tooth?",
  "Are veneers permanent?",
  "How long does a crown last?",
  "What counts as a dental emergency?",
  "Can you fix a knocked-out tooth?",
  "Why do my teeth feel sensitive to hot or cold?",
  "Do you accept my insurance?",
  "What payment plans do you offer?",
  "How long does Invisalign treatment take?",
  "Will it hurt?",
  "My wisdom tooth hurts, do I need it removed?",
  "Can I bring headphones during treatment?",
  "How do you make kids comfortable at the dentist?",
  "Can bonding fix a small chip?",
  "How can I get rid of bad breath?",
  "What should I eat after a tooth extraction?"
]

const ProdenseAIAssistant = ({ className }: { className?: string }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [currentChatId, setCurrentChatId] = useState('current')
  const [savedChats, setSavedChats] = useState([
    {
      id: 'chat-1',
      title: 'Smile Makeover Consultation',
      lastMessage: 'Thank you for the information about veneers...',
      timestamp: '2 hours ago',
      messageCount: 12
    },
    {
      id: 'chat-2', 
      title: 'Dental Tourism in Jaipur',
      lastMessage: 'The clinic looks perfect for my needs...',
      timestamp: 'Yesterday',
      messageCount: 8
    },
    {
      id: 'chat-3',
      title: 'Root Canal Questions',
      lastMessage: 'How long is the recovery time?',
      timestamp: '3 days ago',
      messageCount: 15
    }
  ])
  const [messages, setMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp?: string}>>([
    {
      id: '1',
      text: "Hi! I'm your Prodense AI assistant 👋 How can I help you with your dental journey today?",
      isUser: false,
      timestamp: 'now'
    }
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Typing effect for dental questions
  useEffect(() => {
    const currentQuestion = dentalQuestions[currentQuestionIndex]
    const typingSpeed = 100
    const pauseTime = 2000

    const timeout = setTimeout(() => {
      // Typing
      if (displayedText.length < currentQuestion.length) {
        setDisplayedText(currentQuestion.slice(0, displayedText.length + 1))
      } else {
        // Finished typing, move to next question after pause
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => (prev + 1) % dentalQuestions.length)
          setDisplayedText('') // Reset text for next question
        }, pauseTime)
      }
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [displayedText, currentQuestionIndex])

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: 'now'
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response with more realistic responses
    setTimeout(() => {
      const responses = [
        "Great choice! I'd love to help you with that. Let me connect you with our dental specialists who can provide detailed information about your treatment options and destinations.",
        "Excellent question! Our dental tourism packages include comprehensive care with certified specialists. Would you like me to show you some popular treatment options?",
        "Perfect! I can help you plan your entire dental vacation. Let me gather some information about your preferences and connect you with our travel coordinators.",
        "That's a wonderful decision! Our dental clinics in India offer world-class treatments at affordable prices. Let me help you find the perfect match for your needs."
      ]
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: 'now'
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1200)
  }

  const handleQuickSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion)
    if (!isExpanded) {
      setIsExpanded(true)
    }
  }

  const handleExpand = () => {
    setIsExpanded(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 300)
  }

  const handleClose = () => {
    setIsExpanded(false)
  }

  const handleNewChat = () => {
    setCurrentChatId('current')
    setMessages([
      {
        id: '1',
        text: "Hi! I'm your Prodense AI assistant 👋 How can I help you with your dental journey today?",
        isUser: false,
        timestamp: 'now'
      }
    ])
    setInputValue('')
  }

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId)
    // In a real app, you'd load the messages for this chat from storage/API
    // For demo purposes, we'll show some sample messages
    const sampleMessages = [
      {
        id: '1',
        text: "Hi! I'm your Prodense AI assistant 👋 How can I help you with your dental journey today?",
        isUser: false,
        timestamp: '2 hours ago'
      },
      {
        id: '2',
        text: "I'm interested in a smile makeover. What are my options?",
        isUser: true,
        timestamp: '2 hours ago'
      },
      {
        id: '3',
        text: "Great choice! For a smile makeover, we offer several options including veneers, teeth whitening, and orthodontic treatments. Our dental tourism packages in India provide world-class care at affordable prices. Would you like me to show you some before/after photos and treatment options?",
        isUser: false,
        timestamp: '2 hours ago'
      }
    ]
    setMessages(sampleMessages)
  }

  return (
    <>
      <div className={clsx('relative w-full max-w-4xl ml-7', className)}>
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            // Collapsed State - Compact Chat Box
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative cursor-pointer"
              onClick={handleExpand}
            >
              {/* Gemini-Style Border Effect */}
              <GeminiBorder 
                className="p-[6px]"
                primaryColor="#D35C2F"
                secondaryColor="#E6B862"
                animationSpeed={0.015}
              >
                {/* Compact Chat Interface */}
                <div 
                  className="relative overflow-hidden rounded-3xl bg-white hover:scale-[1.02] transition-all duration-500"
                >
                
                {/* Content Container */}
                <div className="relative z-10">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D35C2F]/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#D35C2F]/10 to-transparent rounded-full translate-y-12 -translate-x-12" />

                  {/* Preview Messages */}
                  <div className="p-6 pt-8 space-y-4 relative">
                  <div className="flex items-center gap-3 mb-4 -ml-[20px]">
                    <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[#D35C2F] to-[#D35C2F] flex items-center justify-center p-2">
                      <img 
                        src="/images/prodence p white.png" 
                        alt="Prodence Logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold bg-gradient-to-r from-[#D35C2F] to-[#D35C2F] bg-clip-text text-transparent">
                        Talk to us
                      </div>
                    </div>
                  </div>
                  

                  <div className="flex justify-start ml-[2px]">
                    <div className="bg-gradient-to-r from-white to-purple-50/50 px-5 py-3 rounded-2xl rounded-bl-md border border-purple-100/50 max-w-md backdrop-blur-sm shadow-lg">
                      <p className="text-gray-800 text-sm font-medium ml-[5px] whitespace-nowrap">Your D-AI-Y smile assistant - right here!</p>
                    </div>
                  </div>
                </div>

                {/* Input Preview Section */}
                <div className="p-6 pt-4 bg-gradient-to-t from-white to-transparent relative">
                  {/* Input Preview */}
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl border border-gray-200/50 shadow-inner backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center ml-[5px]">
                      <UserCircleIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-600 text-sm flex-1 font-medium ml-[5px]">
                      {displayedText}
                      <span className="animate-pulse">|</span>
                    </span>
                    <div className="w-10 h-10 bg-gradient-to-r from-[#D35C2F] to-[#D35C2F] rounded-xl flex items-center justify-center transition-all">
                      <PaperAirplaneIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D35C2F]/5 to-[#D35C2F]/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>
              </GeminiBorder>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={handleClose}
            />
            
            {/* Full Screen Chat */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, type: "spring", damping: 25 }}
              className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-3xl shadow-2xl z-50 flex overflow-hidden border border-gray-200"
            >
              {/* Sidebar - Chat History */}
              <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center mb-4">
                    <img 
                      src="/images/prodense orange.png" 
                      alt="Prodense Logo" 
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                  </div>
                </div>

                {/* Current Chat */}
                <div className="p-4">
                  <button
                    onClick={() => handleNewChat()}
                    className={clsx(
                      'w-full text-left p-3 rounded-xl transition-all duration-200 border',
                      currentChatId === 'current'
                        ? 'bg-gradient-to-r from-[#D35C2F]/10 to-[#FF4A2B]/10 border-[#D35C2F]/30 shadow-sm'
                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D35C2F] to-[#FF4A2B] flex items-center justify-center flex-shrink-0 p-1.5">
                        <img 
                          src="/images/prodence p white.png" 
                          alt="Prodence AI" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 text-sm">New Conversation</div>
                        <div className="text-xs text-gray-500 truncate">Start a new chat with AI assistant</div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Saved Chats */}
                <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Previous Chats</div>
                  {savedChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => handleSelectChat(chat.id)}
                      className={clsx(
                        'w-full text-left p-3 rounded-xl transition-all duration-200 border group',
                        currentChatId === chat.id
                          ? 'bg-gradient-to-r from-[#D35C2F]/10 to-[#FF4A2B]/10 border-[#D35C2F]/30 shadow-sm'
                          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-300 transition-colors">
                          <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 text-sm truncate">{chat.title}</div>
                          <div className="text-xs text-gray-500 truncate mb-1">{chat.lastMessage}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <ClockIcon className="w-3 h-3" />
                            <span>{chat.timestamp}</span>
                            <span>•</span>
                            <span>{chat.messageCount} messages</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Close Button */}
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-3 hover:bg-white/50 rounded-2xl group backdrop-blur-sm shadow-lg"
                  >
                    <XMarkIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </button>
                </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 pt-16 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={clsx(
                      'flex items-end gap-3',
                      message.isUser ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {!message.isUser && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D35C2F] to-[#FF4A2B] flex items-center justify-center flex-shrink-0 p-1.5">
                        <img 
                          src="/images/prodence p white.png" 
                          alt="Prodence AI" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className={clsx(
                      'max-w-md lg:max-w-lg px-4 py-3 rounded-2xl relative',
                      message.isUser 
                        ? 'bg-gradient-to-r from-[#D35C2F] to-[#FF4A2B] text-white rounded-br-md shadow-lg' 
                        : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                    )}>
                      <p className="text-sm lg:text-base leading-relaxed">{message.text}</p>
                      {message.timestamp && (
                        <p className={clsx(
                          'text-xs mt-1',
                          message.isUser ? 'text-white/70' : 'text-gray-500'
                        )}>
                          {message.timestamp}
                        </p>
                      )}
                    </div>
                    {message.isUser && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                        <UserCircleIcon className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-end gap-3 justify-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D35C2F] to-[#FF4A2B] flex items-center justify-center flex-shrink-0 p-1.5">
                      <img 
                        src="/images/prodence p white.png" 
                        alt="Prodence AI" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#D35C2F] rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-[#D35C2F] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-[#D35C2F] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions */}
              {messages.length <= 1 && (
                <div className="px-6 py-4 bg-white border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-500 font-medium mb-2 w-full">Quick suggestions:</span>
                    {quickSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSuggestion(suggestion.text)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-[#D35C2F]/10 text-gray-700 hover:text-[#D35C2F] rounded-full text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-[#D35C2F]/30 hover:scale-105"
                      >
                        <suggestion.icon className="w-4 h-4" />
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-gray-100 flex-shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                        placeholder="Ask me about treatments, destinations, costs, or anything else..."
                        className="w-full px-6 py-4 pr-14 rounded-2xl border-2 border-gray-200 focus:border-[#D35C2F] focus:ring-4 focus:ring-[#D35C2F]/10 focus:outline-none transition-all text-base bg-gray-50 focus:bg-white"
                      />
                      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D35C2F] transition-colors p-1 hover:bg-[#D35C2F]/10 rounded-lg">
                        <MicrophoneIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim()}
                      className="bg-gradient-to-r from-[#D35C2F] to-[#FF4A2B] hover:from-[#B8280F] hover:to-[#D35C2F] disabled:from-gray-300 disabled:to-gray-300 text-white p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProdenseAIAssistant