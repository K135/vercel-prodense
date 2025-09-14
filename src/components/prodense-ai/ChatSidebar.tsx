'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  SparklesIcon,
  TrashIcon,
  SunIcon,
  MoonIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  HeartIcon,
  StarIcon
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
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={clsx(
            'w-80 border-r flex flex-col transition-all duration-300 backdrop-blur-xl relative',
            isDarkMode 
              ? 'bg-slate-800/90 border-slate-700/50' 
              : 'bg-white/90 border-slate-200/50'
          )}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#E6B862]/5 via-transparent to-[#D35C2F]/5 pointer-events-none" />
          
          {/* Sidebar Header */}
          <div className={clsx(
            'p-6 border-b backdrop-blur-sm relative z-10',
            isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'
          )}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#E6B862] to-[#D35C2F] rounded-xl flex items-center justify-center shadow-lg">
                    <SparklesIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-[#D35C2F] to-[#E6B862] bg-clip-text text-transparent">
                    Prodense AI
                  </h1>
                  <p className={clsx(
                    'text-xs transition-colors',
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  )}>
                    Dental Tourism Assistant
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleDarkMode}
                className={clsx(
                  'p-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm',
                  isDarkMode 
                    ? 'hover:bg-slate-700/50 border border-slate-600/30' 
                    : 'hover:bg-slate-100/50 border border-slate-200/30'
                )}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <SunIcon className="h-4 w-4 text-amber-400" />
                ) : (
                  <MoonIcon className="h-4 w-4 text-slate-600" />
                )}
              </motion.button>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCreateNewSession}
              className="w-full bg-gradient-to-r from-[#D35C2F] to-[#E6B862] text-white px-4 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl font-medium"
            >
              <PlusIcon className="h-4 w-4" />
              <span>New Conversation</span>
            </motion.button>
          </div>

          {/* Chat Sessions */}
          <div className="flex-1 overflow-y-auto p-4 relative z-10">
            {chatSessions.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className={clsx(
                  'w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center',
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'
                )}>
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-[#D35C2F]" />
                </div>
                <p className={clsx(
                  'text-sm font-medium mb-2',
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                )}>
                  No conversations yet
                </p>
                <p className={clsx(
                  'text-xs leading-relaxed max-w-48 mx-auto',
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                )}>
                  Start your dental tourism journey by asking about treatments, costs, or destinations
                </p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {Object.entries(sessionGroups).map(([dateGroup, sessions]) => (
                  <div key={dateGroup}>
                    <div className="flex items-center space-x-2 mb-3">
                      <ClockIcon className="h-3 w-3 text-[#D35C2F]" />
                      <h3 className={clsx(
                        'text-xs font-semibold uppercase tracking-wider',
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      )}>
                        {dateGroup}
                      </h3>
                      <div className={clsx(
                        'flex-1 h-px',
                        isDarkMode ? 'bg-slate-700/50' : 'bg-slate-200/50'
                      )} />
                    </div>
                    <div className="space-y-2">
                      {sessions.map((session, index) => (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className={clsx(
                            'group relative flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 backdrop-blur-sm',
                            currentSessionId === session.id
                              ? isDarkMode 
                                ? 'bg-slate-700/60 shadow-lg border border-[#D35C2F]/30' 
                                : 'bg-slate-100/60 shadow-lg border border-[#D35C2F]/30'
                              : isDarkMode 
                                ? 'hover:bg-slate-700/40 border border-transparent hover:border-slate-600/30' 
                                : 'hover:bg-slate-50/60 border border-transparent hover:border-slate-200/50'
                          )}
                          onClick={() => onSwitchSession(session.id)}
                        >
                          {/* Active indicator */}
                          {currentSessionId === session.id && (
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#D35C2F] to-[#E6B862] rounded-r-full" />
                          )}
                          
                          <div className="flex-1 min-w-0 ml-2">
                            <p className={clsx(
                              'text-sm font-medium truncate transition-colors',
                              currentSessionId === session.id 
                                ? 'text-[#D35C2F]' 
                                : isDarkMode ? 'text-slate-200' : 'text-slate-800'
                            )}>
                              {session.title}
                            </p>
                            <div className="flex items-center space-x-2 mt-1.5">
                              <div className="flex items-center space-x-1">
                                <ChatBubbleLeftRightIcon className="h-3 w-3 text-[#D35C2F]/60" />
                                <p className={clsx(
                                  'text-xs',
                                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                )}>
                                  {session.messages.length}
                                </p>
                              </div>
                              <span className={clsx(
                                'text-xs',
                                isDarkMode ? 'text-slate-500' : 'text-slate-400'
                              )}>•</span>
                              <p className={clsx(
                                'text-xs',
                                isDarkMode ? 'text-slate-400' : 'text-slate-500'
                              )}>
                                {session.createdAt.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteSession(session.id)
                            }}
                            className={clsx(
                              'opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all duration-200',
                              isDarkMode 
                                ? 'hover:bg-red-900/30 text-red-400' 
                                : 'hover:bg-red-50 text-red-500'
                            )}
                            title="Delete conversation"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className={clsx(
            'p-4 border-t backdrop-blur-sm relative z-10',
            isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'
          )}>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <HeartIcon className="h-3 w-3 text-red-400" />
                <p className={clsx(
                  'text-xs font-medium',
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                )}>
                  Prodense AI Assistant
                </p>
                <StarIcon className="h-3 w-3 text-amber-400" />
              </div>
              <p className={clsx(
                'text-xs',
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              )}>
                Transforming dental tourism with AI
              </p>
              <div className="flex items-center justify-center space-x-1 pt-1">
                <div className="w-1 h-1 bg-[#D35C2F] rounded-full animate-pulse" />
                <div className="w-1 h-1 bg-[#E6B862] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="w-1 h-1 bg-[#D35C2F] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}