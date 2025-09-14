'use client'

import { motion } from 'framer-motion'
import { 
  SparklesIcon,
  UserIcon,
  DocumentDuplicateIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useState } from 'react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
  isDarkMode: boolean
}

export default function ChatMessage({ message, isDarkMode }: ChatMessageProps) {
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
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'flex space-x-4',
        message.role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {message.role === 'assistant' && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-[#D35C2F] to-[#B8491F] rounded-full flex items-center justify-center shadow-lg">
            <SparklesIcon className="h-4 w-4 text-white" />
          </div>
        </div>
      )}
      
      <div className={clsx(
        'max-w-3xl rounded-2xl px-4 py-3 group relative shadow-sm',
        message.role === 'user'
          ? 'bg-gradient-to-br from-[#D35C2F] to-[#B8491F] text-white'
          : isDarkMode 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
      )}>
        <div className="prose prose-sm max-w-none">
          <div 
            className={clsx(
              'whitespace-pre-wrap',
              message.role === 'assistant' && (isDarkMode ? 'text-gray-100' : 'text-gray-800')
            )}
            dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
          />
        </div>
        
        {message.role === 'assistant' && (
          <button
            onClick={() => copyToClipboard(message.content)}
            className={clsx(
              'absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all duration-200',
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            )}
            title="Copy message"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <DocumentDuplicateIcon className="h-4 w-4" />
            )}
          </button>
        )}
        
        <div className={clsx(
          'text-xs mt-2 flex items-center justify-between',
          message.role === 'user' 
            ? 'text-white/70' 
            : isDarkMode ? 'text-gray-400' : 'text-gray-500'
        )}>
          <span>{message.timestamp.toLocaleTimeString()}</span>
          {message.role === 'assistant' && (
            <span className="text-xs opacity-60">Prodense</span>
          )}
        </div>
      </div>

      {message.role === 'user' && (
        <div className="flex-shrink-0">
          <div className={clsx(
            'w-8 h-8 rounded-full flex items-center justify-center shadow-lg',
            isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
          )}>
            <UserIcon className="h-4 w-4" />
          </div>
        </div>
      )}
    </motion.div>
  )
}