'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  SparklesIcon,
  TrashIcon,
  SunIcon,
  MoonIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

interface ChatSidebarProps {
  isOpen: boolean
  isDarkMode: boolean
  chatSessions: ChatSession[]
  currentSessionId: string | null
  onToggleDarkMode: () => void
  onCreateNewSession: () => void
  onSwitchSession: (sessionId: string) => void
  onDeleteSession: (sessionId: string) => void
}

export default function ChatSidebar({
  isOpen,
  isDarkMode,
  chatSessions,
  currentSessionId,
  onToggleDarkMode,
  onCreateNewSession,
  onSwitchSession,
  onDeleteSession
}: ChatSidebarProps) {
  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return 'Today'
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const groupSessionsByDate = (sessions: ChatSession[]) => {
    const groups: { [key: string]: ChatSession[] } = {}
    
    sessions.forEach(session => {
      const dateKey = formatDate(session.createdAt)
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(session)
    })
    
    return groups
  }

  const sessionGroups = groupSessionsByDate(chatSessions)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={clsx(
            'w-80 border-r flex flex-col transition-colors duration-300 shadow-lg',
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          )}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#D35C2F] to-[#B8491F] rounded-lg flex items-center justify-center">
                  <SparklesIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">Prodense AI</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Powered by Prodense
                  </p>
                </div>
              </div>
              <button
                onClick={onToggleDarkMode}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                )}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            
            <button
              onClick={onCreateNewSession}
              className="w-full bg-gradient-to-r from-[#D35C2F] to-[#B8491F] text-white px-4 py-3 rounded-xl hover:from-[#B8491F] hover:to-[#A03D1A] transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="font-medium">New Chat</span>
            </button>
          </div>

          {/* Chat Sessions */}
          <div className="flex-1 overflow-y-auto p-4">
            {chatSessions.length === 0 ? (
              <div className="text-center py-8">
                <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No chat sessions yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  Start a new conversation to begin
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(sessionGroups).map(([dateGroup, sessions]) => (
                  <div key={dateGroup}>
                    <div className="flex items-center space-x-2 mb-2">
                      <ClockIcon className="h-3 w-3 text-gray-400" />
                      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {dateGroup}
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {sessions.map((session) => (
                        <motion.div
                          key={session.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={clsx(
                            'group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200',
                            currentSessionId === session.id
                              ? isDarkMode 
                                ? 'bg-gray-700 shadow-lg border border-gray-600' 
                                : 'bg-gray-100 shadow-lg border border-gray-200'
                              : isDarkMode 
                                ? 'hover:bg-gray-700' 
                                : 'hover:bg-gray-50'
                          )}
                          onClick={() => onSwitchSession(session.id)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className={clsx(
                              'text-sm font-medium truncate',
                              currentSessionId === session.id && 'text-[#D35C2F]'
                            )}>
                              {session.title}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {session.messages.length} messages
                              </p>
                              <span className="text-xs text-gray-400">•</span>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {session.createdAt.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteSession(session.id)
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-all duration-200"
                            title="Delete chat"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={clsx(
            'p-4 border-t text-center',
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          )}>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Prodense AI Chat v1.0
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Built with ❤️ for Prodense
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}