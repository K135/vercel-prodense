'use client'

import { motion } from 'framer-motion'
import { SparklesIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface TypingIndicatorProps {
  isDarkMode: boolean
}

export default function TypingIndicator({ isDarkMode }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex space-x-4"
    >
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-[#D35C2F] to-[#B8491F] rounded-full flex items-center justify-center shadow-lg">
          <SparklesIcon className="h-4 w-4 text-white animate-pulse" />
        </div>
      </div>
      <div className={clsx(
        'max-w-3xl rounded-2xl px-4 py-3 shadow-sm',
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      )}>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <motion.div
              className="w-2 h-2 bg-[#D35C2F] rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="w-2 h-2 bg-[#D35C2F] rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
            <motion.div
              className="w-2 h-2 bg-[#D35C2F] rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }}
            />
          </div>
          <span className={clsx(
            'text-sm',
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          )}>
            Gemini is thinking...
          </span>
        </div>
      </div>
    </motion.div>
  )
}