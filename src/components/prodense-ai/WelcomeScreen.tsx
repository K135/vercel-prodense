'use client'

import { motion } from 'framer-motion'
import { 
  SparklesIcon,
  LightBulbIcon,
  CodeBracketIcon,
  PencilSquareIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface WelcomeScreenProps {
  isDarkMode: boolean
  onSuggestedPrompt: (prompt: string) => void
}

const suggestedPrompts = [
  {
    icon: LightBulbIcon,
    title: "Creative Ideas",
    prompt: "Help me brainstorm creative ideas for a new project",
    color: "text-yellow-500"
  },
  {
    icon: CodeBracketIcon,
    title: "Code Help",
    prompt: "Explain how to implement a React component with TypeScript",
    color: "text-blue-500"
  },
  {
    icon: PencilSquareIcon,
    title: "Writing Assistant",
    prompt: "Help me write a professional email to a client",
    color: "text-green-500"
  },
  {
    icon: BookOpenIcon,
    title: "Learning",
    prompt: "Explain quantum computing in simple terms",
    color: "text-purple-500"
  }
]

export default function WelcomeScreen({ isDarkMode, onSuggestedPrompt }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-[#D35C2F] to-[#B8491F] rounded-3xl flex items-center justify-center shadow-2xl mb-6">
          <SparklesIcon className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#D35C2F] to-[#B8491F] bg-clip-text text-transparent">
          Welcome to Prodense AI
        </h1>
        <p className={clsx(
          'text-lg max-w-2xl mx-auto leading-relaxed',
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        )}>
          Start a conversation with Prodense AI&apos;s advanced AI model. Ask questions, get creative help, 
          solve problems, or just have an engaging chat!
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full mb-8"
      >
        {suggestedPrompts.map((suggestion, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSuggestedPrompt(suggestion.prompt)}
            className={clsx(
              'p-6 rounded-2xl border-2 border-dashed transition-all duration-200 text-left group',
              isDarkMode 
                ? 'border-gray-600 hover:border-[#D35C2F] hover:bg-gray-800/50' 
                : 'border-gray-300 hover:border-[#D35C2F] hover:bg-gray-50'
            )}
          >
            <div className="flex items-start space-x-4">
              <div className={clsx(
                'p-2 rounded-lg transition-colors',
                isDarkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-white'
              )}>
                <suggestion.icon className={clsx('h-5 w-5', suggestion.color)} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2 group-hover:text-[#D35C2F] transition-colors">
                  {suggestion.title}
                </h3>
                <p className={clsx(
                  'text-sm leading-relaxed',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {suggestion.prompt}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={clsx(
          'max-w-2xl mx-auto p-6 rounded-2xl border',
          isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
        )}
      >
        <div className="flex items-center space-x-3 mb-3">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-[#D35C2F]" />
          <h3 className="font-semibold">Tips for better conversations:</h3>
        </div>
        <ul className={clsx(
          'text-sm space-y-2 text-left',
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        )}>
          <li>• Be specific and clear in your questions</li>
          <li>• Ask follow-up questions to dive deeper</li>
          <li>• Use examples to provide context</li>
          <li>• Feel free to ask for explanations in different ways</li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8"
      >
        <p className={clsx(
          'text-xs',
          isDarkMode ? 'text-gray-500' : 'text-gray-400'
        )}>
          Powered by Prodense AI • AI responses may contain inaccuracies
        </p>
      </motion.div>
    </div>
  )
}