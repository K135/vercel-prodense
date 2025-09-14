'use client'

import { motion } from 'framer-motion'
import { SparklesIcon, HeartIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface TypingIndicatorProps {
  isDarkMode: boolean
  message?: string
}

export default function TypingIndicator({ isDarkMode, message }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex space-x-4"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-shrink-0"
      >
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-[#E6B862] to-[#D35C2F] rounded-2xl flex items-center justify-center shadow-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <SparklesIcon className="h-5 w-5 text-white" />
            </motion.div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
            <motion.div 
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
      
      <div className={clsx(
        'max-w-4xl rounded-2xl backdrop-blur-sm shadow-lg relative overflow-hidden',
        isDarkMode 
          ? 'bg-slate-800/80 border border-slate-700/50' 
          : 'bg-white/80 border border-slate-200/50'
      )}>
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#E6B862]/10 via-[#D35C2F]/5 to-[#E6B862]/10"
          animate={{ x: [-100, 100] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="px-6 py-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1.5">
              <motion.div
                className="w-2.5 h-2.5 bg-gradient-to-r from-[#D35C2F] to-[#E6B862] rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="w-2.5 h-2.5 bg-gradient-to-r from-[#D35C2F] to-[#E6B862] rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2
                }}
              />
              <motion.div
                className="w-2.5 h-2.5 bg-gradient-to-r from-[#D35C2F] to-[#E6B862] rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4
                }}
              />
            </div>
            <div className="flex-1">
              <motion.span 
                className={clsx(
                  'text-sm font-medium',
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                )}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {message || 'Prodense AI is analyzing your request...'}
              </motion.span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className={clsx(
          'px-6 py-3 border-t flex items-center justify-between text-xs relative z-10',
          isDarkMode 
            ? 'text-slate-400 border-slate-700/20' 
            : 'text-slate-500 border-slate-200/20'
        )}>
          <span>Processing your dental tourism inquiry...</span>
          <div className="flex items-center space-x-1">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            >
              <HeartIcon className="h-3 w-3 text-red-400" />
            </motion.div>
            <span className="font-medium">Prodense AI</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}