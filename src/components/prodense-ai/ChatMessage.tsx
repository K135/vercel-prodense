'use client'

import { motion } from 'framer-motion'
import { 
  SparklesIcon,
  UserIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  HeartIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useState } from 'react'
import { Message, MessageOption } from '@/types/prodense-ai'

interface ChatMessageProps {
  message: Message
  isDarkMode: boolean
  onOptionSelect?: (messageId: string, optionValue: string, optionText: string) => void
}

export default function ChatMessage({ message, isDarkMode, onOptionSelect }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const formatContent = (content: string) => {
    // Enhanced markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#D35C2F]">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md text-sm font-mono">$1</code>')
      .replace(/\n/g, '<br>')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={clsx(
        'flex space-x-4 group',
        message.role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {message.role === 'assistant' && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-shrink-0"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-[#E6B862] to-[#D35C2F] rounded-2xl flex items-center justify-center shadow-lg">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
          </div>
        </motion.div>
      )}
      
      <div className={clsx(
        'max-w-4xl rounded-2xl group relative backdrop-blur-sm',
        message.role === 'user'
          ? 'bg-[#D35C2F] text-white shadow-lg'
          : isDarkMode 
            ? 'bg-slate-800/80 border border-slate-700/50 shadow-lg' 
            : 'bg-white/80 border border-slate-200/50 shadow-lg'
      )}>
        {/* Message content */}
        <div className="px-6 py-4">
          <div className="prose prose-sm max-w-none">
            <div 
              className={clsx(
                'leading-relaxed',
                message.role === 'user' 
                  ? 'text-white font-bold' 
                  : message.role === 'assistant' && (isDarkMode ? 'text-slate-100' : 'text-slate-800')
              )}
              dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
            />
          </div>
        </div>
        
        {/* Interactive Options */}
        {message.role === 'assistant' && message.options && message.options.length > 0 && (
          <div className="px-6 pb-4">
            <div className="border-t border-slate-200/20 dark:border-slate-700/20 pt-4">
              <p className={clsx(
                'text-sm font-medium mb-3',
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              )}>
                Quick actions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {message.options.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onOptionSelect?.(message.id, option.value, option.text)}
                    className={clsx(
                      'group/option flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium backdrop-blur-sm',
                      isDarkMode
                        ? 'border-slate-600/30 bg-slate-700/30 hover:bg-slate-600/50 hover:border-[#D35C2F]/50 text-slate-100'
                        : 'border-slate-200/50 bg-slate-50/50 hover:bg-white/80 hover:border-[#D35C2F]/50 text-slate-700'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      {option.emoji && (
                        <span className="text-lg">{option.emoji}</span>
                      )}
                      <span>{option.text}</span>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 opacity-0 group-hover/option:opacity-100 transition-opacity text-[#D35C2F]" />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Show selected option */}
        {message.role === 'assistant' && message.selectedOption && (
          <div className="px-6 pb-4">
            <div className={clsx(
              'flex items-center space-x-2 text-sm p-3 rounded-lg',
              isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600'
            )}>
              <CheckIcon className="h-4 w-4" />
              <span>You selected: {message.selectedOption}</span>
            </div>
          </div>
        )}
        
        {/* Copy button for assistant messages */}
        {message.role === 'assistant' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            onClick={() => copyToClipboard(message.content)}
            className={clsx(
              'absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all duration-200 backdrop-blur-sm',
              isDarkMode 
                ? 'hover:bg-slate-700/50 border border-slate-600/30' 
                : 'hover:bg-slate-100/50 border border-slate-200/30'
            )}
            title="Copy message"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <DocumentDuplicateIcon className="h-4 w-4" />
            )}
          </motion.button>
        )}
        
        {/* Message footer */}
        <div className={clsx(
          'px-6 py-3 border-t flex items-center justify-between text-xs',
          message.role === 'user' 
            ? 'text-white/60 border-white/10' 
            : isDarkMode 
              ? 'text-slate-400 border-slate-700/20' 
              : 'text-slate-500 border-slate-200/20'
        )}>
          <span>{message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}</span>
          {message.role === 'assistant' && (
            <div className="flex items-center space-x-1">
              <HeartIcon className="h-3 w-3 text-red-400" />
              <span className="font-medium">Prodense AI</span>
            </div>
          )}
        </div>
      </div>

      {message.role === 'user' && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-shrink-0"
        >
          <div className="relative">
            <div className={clsx(
              'w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm',
              isDarkMode 
                ? 'bg-slate-700/80 border border-slate-600/30' 
                : 'bg-slate-100/80 border border-slate-200/30'
            )}>
              <UserIcon className="h-5 w-5 text-[#D35C2F]" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-blue-400 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}