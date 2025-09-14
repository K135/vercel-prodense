'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PaperAirplaneIcon, 
  TrashIcon,
  Bars3Icon,
  AcademicCapIcon,
  SparklesIcon,
  MoonIcon,
  SunIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

// Components
import ChatSidebar from '@/components/prodense-ai/ChatSidebar'
import ChatMessage from '@/components/prodense-ai/ChatMessage'
import TypingIndicator from '@/components/prodense-ai/TypingIndicator'
import WelcomeScreen from '@/components/prodense-ai/WelcomeScreen'
import TrainingDataManager from '@/components/prodense-ai/TrainingDataManager'

// Hooks and utilities
import { useProdenseAIChat } from '@/hooks/useProdenseAIChat'
import { ChatStorage } from '@/lib/storage'

export default function ProdenseAIChatPage() {
  const [inputValue, setInputValue] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showTrainingManager, setShowTrainingManager] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  
  // Use the custom hook for chat functionality
  const {
    messages,
    chatSessions,
    currentSessionId,
    currentSession,
    isLoading,
    error,
    sendMessage,
    createNewSession,
    switchSession,
    deleteSession,
    updateSessionTitle,
    clearChat,
    handleOptionSelect
  } = useProdenseAIChat()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load user settings
  useEffect(() => {
    const settings = ChatStorage.getSettings()
    setIsDarkMode(settings.darkMode)
    setSidebarOpen(settings.sidebarOpen)
  }, [])

  // Save user settings when they change
  useEffect(() => {
    ChatStorage.saveSettings({ darkMode: isDarkMode, sidebarOpen })
  }, [isDarkMode, sidebarOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N for new chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        createNewSession()
      }
      // Ctrl/Cmd + K to focus input
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [createNewSession])

  // Handle sending messages
  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim()
    if (!textToSend || isLoading) return

    setInputValue('')
    await sendMessage(textToSend)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt)
    handleSendMessage(prompt)
  }

  return (
    <div className={clsx(
      'min-h-screen flex transition-all duration-500 ease-in-out',
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
    )}>
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className={clsx(
          'absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse',
          isDarkMode ? 'bg-gradient-to-br from-[#E6B862] to-[#D35C2F]' : 'bg-gradient-to-br from-[#E6B862]/30 to-[#D35C2F]/30'
        )} style={{ animationDuration: '4s' }} />
        <div className={clsx(
          'absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse',
          isDarkMode ? 'bg-gradient-to-tr from-[#D35C2F] to-[#E6B862]' : 'bg-gradient-to-tr from-[#D35C2F]/30 to-[#E6B862]/30'
        )} style={{ animationDuration: '6s', animationDelay: '2s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#E6B862]/40 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-[#D35C2F]/40 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-[#E6B862]/30 rounded-full animate-bounce" style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
      </div>

      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        isDarkMode={isDarkMode}
        chatSessions={chatSessions}
        currentSessionId={currentSessionId}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onCreateNewSession={createNewSession}
        onSwitchSession={switchSession}
        onDeleteSession={deleteSession}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-screen">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={clsx(
            'backdrop-blur-xl border-b px-6 py-4 flex items-center justify-between transition-all duration-300 relative flex-shrink-0',
            isDarkMode 
              ? 'border-slate-700/50 bg-slate-800/80' 
              : 'border-slate-200/50 bg-white/80'
          )}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#E6B862]/5 via-transparent to-[#D35C2F]/5" />
          
          <div className="flex items-center space-x-4 relative z-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={clsx(
                'p-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm',
                isDarkMode 
                  ? 'hover:bg-slate-700/50 border border-slate-600/30' 
                  : 'hover:bg-slate-100/50 border border-slate-200/30'
              )}
            >
              <Bars3Icon className="h-5 w-5" />
            </motion.button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#E6B862] to-[#D35C2F] rounded-xl flex items-center justify-center shadow-lg">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-semibold bg-gradient-to-r from-[#D35C2F] to-[#E6B862] bg-clip-text text-transparent">
                  Prodense AI Assistant
                </h2>
                <p className={clsx(
                  'text-sm transition-colors',
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                )}>
                  Your intelligent dental care companion
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 relative z-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={clsx(
                'p-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm',
                isDarkMode 
                  ? 'hover:bg-slate-700/50 border border-slate-600/30' 
                  : 'hover:bg-slate-100/50 border border-slate-200/30'
              )}
            >
              {isDarkMode ? (
                <SunIcon className="h-4 w-4 text-amber-400" />
              ) : (
                <MoonIcon className="h-4 w-4 text-slate-600" />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTrainingManager(true)}
              className={clsx(
                'px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm',
                isDarkMode 
                  ? 'hover:bg-slate-700/50 border border-slate-600/30' 
                  : 'hover:bg-slate-100/50 border border-slate-200/30'
              )}
            >
              <AcademicCapIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Training</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={createNewSession}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D35C2F] to-[#E6B862] text-white transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="text-sm font-medium">New Chat</span>
            </motion.button>
            
            {messages.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearChat}
                className={clsx(
                  'p-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm',
                  isDarkMode 
                    ? 'hover:bg-red-900/20 border border-red-800/30 text-red-400' 
                    : 'hover:bg-red-50/50 border border-red-200/30 text-red-600'
                )}
              >
                <TrashIcon className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto relative min-h-0">
          {messages.length === 0 ? (
            <WelcomeScreen 
              isDarkMode={isDarkMode} 
              onSuggestedPrompt={handleSuggestedPrompt}
            />
          ) : (
            <div className="p-6 pb-0">
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ChatMessage
                      message={message}
                      isDarkMode={isDarkMode}
                      onOptionSelect={handleOptionSelect}
                    />
                  </motion.div>
                ))}
                
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                    >
                      <TypingIndicator isDarkMode={isDarkMode} />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
                {/* Add bottom padding to ensure last message is visible above input */}
                <div className="h-6" />
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Input Area - Now Sticky */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={clsx(
            'backdrop-blur-xl border-t p-6 transition-all duration-300 relative flex-shrink-0',
            isDarkMode 
              ? 'border-slate-700/50 bg-slate-800/80' 
              : 'border-slate-200/50 bg-white/80'
          )}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#E6B862]/5 via-transparent to-[#D35C2F]/5" />
          
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="relative">
              <div className={clsx(
                'relative rounded-2xl border-2 transition-all duration-200 backdrop-blur-sm',
                isDarkMode 
                  ? 'border-slate-600/30 bg-slate-700/50' 
                  : 'border-slate-200/50 bg-white/50',
                inputValue.trim() && 'border-[#D35C2F]/50 shadow-lg shadow-[#D35C2F]/10'
              )}>
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about dental care, treatments, or travel planning..."
                  className={clsx(
                    'w-full resize-none rounded-2xl px-6 py-4 pr-16 focus:outline-none transition-all duration-200 bg-transparent',
                    isDarkMode 
                      ? 'text-white placeholder-slate-400' 
                      : 'text-slate-900 placeholder-slate-500'
                  )}
                  rows={1}
                  style={{ minHeight: '56px', maxHeight: '200px' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = 'auto'
                    target.style.height = Math.min(target.scrollHeight, 200) + 'px'
                  }}
                />
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className={clsx(
                    'absolute right-3 top-1/2 transform -translate-y-1/2 p-3 rounded-xl transition-all duration-200',
                    inputValue.trim() && !isLoading
                      ? 'bg-gradient-to-r from-[#D35C2F] to-[#E6B862] text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : isDarkMode 
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  )}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowUpIcon className="h-4 w-4" />
                  )}
                </motion.button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs">
              <div className="flex items-center space-x-4">
                <span className={clsx(
                  'flex items-center space-x-1',
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                )}>
                  <ChatBubbleLeftRightIcon className="h-3 w-3" />
                  <span>AI responses may contain inaccuracies. Please verify important information.</span>
                </span>
              </div>
              <span className={clsx(
                'font-mono transition-colors',
                inputValue.length > 3500 && 'text-amber-500',
                inputValue.length > 3800 && 'text-red-500',
                inputValue.length <= 3500 && (isDarkMode ? 'text-slate-400' : 'text-slate-600')
              )}>
                {inputValue.length}/4000
              </span>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center justify-center mt-4 space-x-2">
              <div className={clsx(
                'text-xs px-2 py-1 rounded-full',
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              )}>
                Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">Enter</kbd> to send, 
                <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs ml-1">Shift + Enter</kbd> for new line
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Training Data Manager */}
      <TrainingDataManager
        isDarkMode={isDarkMode}
        isOpen={showTrainingManager}
        onClose={() => setShowTrainingManager(false)}
      />
    </div>
  )
}