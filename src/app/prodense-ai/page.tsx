'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PaperAirplaneIcon, 
  TrashIcon,
  Bars3Icon,
  AcademicCapIcon
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
      'min-h-screen flex transition-colors duration-300',
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    )}>
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={clsx(
          'border-b px-6 py-4 flex items-center justify-between transition-colors duration-300',
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              )}
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-lg font-semibold">Prodense AI Chat</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Powered by Prodense AI
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTrainingManager(true)}
              className={clsx(
                'px-4 py-2 rounded-lg transition-colors flex items-center space-x-2',
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              )}
            >
              <AcademicCapIcon className="h-4 w-4" />
              <span>Training</span>
            </button>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className={clsx(
                  'px-4 py-2 rounded-lg transition-colors flex items-center space-x-2',
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                )}
              >
                <TrashIcon className="h-4 w-4" />
                <span>Clear Chat</span>
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <WelcomeScreen 
              isDarkMode={isDarkMode} 
              onSuggestedPrompt={handleSuggestedPrompt}
            />
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isDarkMode={isDarkMode}
                  onOptionSelect={handleOptionSelect}
                />
              ))}
              
              <AnimatePresence>
                {isLoading && (
                  <TypingIndicator isDarkMode={isDarkMode} />
                )}
              </AnimatePresence>
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className={clsx(
          'border-t p-6 transition-colors duration-300',
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                className={clsx(
                  'w-full resize-none rounded-2xl border px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#D35C2F] transition-colors',
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                )}
                rows={1}
                style={{ minHeight: '48px', maxHeight: '200px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = Math.min(target.scrollHeight, 200) + 'px'
                }}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className={clsx(
                  'absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-all',
                  inputValue.trim() && !isLoading
                    ? 'bg-[#D35C2F] text-white hover:bg-[#B8491F] shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                )}
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>AI responses may contain inaccuracies. Please verify important information.</span>
              <span className={clsx(
                inputValue.length > 3500 && 'text-orange-500',
                inputValue.length > 3800 && 'text-red-500'
              )}>
                {inputValue.length}/4000
              </span>
            </div>
          </div>
        </div>
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