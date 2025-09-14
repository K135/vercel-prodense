'use client'

import { motion } from 'framer-motion'
import { 
  SparklesIcon,
  HeartIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface WelcomeScreenProps {
  isDarkMode: boolean
  onSuggestedPrompt: (prompt: string) => void
}

const suggestedPrompts = [
  {
    icon: HeartIcon,
    title: "Dental Treatments",
    prompt: "What dental treatments are available in India and what should I expect?",
    color: "text-red-500",
    gradient: "from-red-500 to-pink-500"
  },
  {
    icon: MapPinIcon,
    title: "Travel Planning",
    prompt: "Help me plan my dental tourism trip to India - destinations, timing, and logistics",
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: CurrencyDollarIcon,
    title: "Cost Estimation",
    prompt: "Compare dental treatment costs between India and my home country",
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: CalendarDaysIcon,
    title: "Appointment Booking",
    prompt: "How do I book appointments with top dentists in India?",
    color: "text-purple-500",
    gradient: "from-purple-500 to-violet-500"
  }
]

const features = [
  {
    icon: ShieldCheckIcon,
    title: "Verified Dentists",
    description: "Connect with certified dental professionals"
  },
  {
    icon: GlobeAltIcon,
    title: "Global Standards",
    description: "International quality care at local prices"
  },
  {
    icon: UserGroupIcon,
    title: "Personal Support",
    description: "Dedicated assistance throughout your journey"
  },
  {
    icon: StarIcon,
    title: "Premium Experience",
    description: "Luxury accommodations and seamless travel"
  }
]

export default function WelcomeScreen({ isDarkMode, onSuggestedPrompt }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center px-6 py-12 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={clsx(
          'absolute top-20 left-20 w-32 h-32 rounded-full blur-3xl opacity-10',
          isDarkMode ? 'bg-[#E6B862]' : 'bg-[#E6B862]/30'
        )} />
        <div className={clsx(
          'absolute bottom-20 right-20 w-40 h-40 rounded-full blur-3xl opacity-10',
          isDarkMode ? 'bg-[#D35C2F]' : 'bg-[#D35C2F]/30'
        )} />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-12 relative z-10"
      >
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-[#E6B862] to-[#D35C2F] rounded-3xl flex items-center justify-center shadow-2xl mb-6 mx-auto relative">
            <SparklesIcon className="h-12 w-12 text-white" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white animate-pulse" />
          </div>
          
          {/* Floating elements around logo */}
          <div className="absolute -top-4 -left-4 w-3 h-3 bg-[#E6B862]/60 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }} />
          <div className="absolute -bottom-2 -right-6 w-2 h-2 bg-[#D35C2F]/60 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
          <div className="absolute top-8 -right-8 w-1.5 h-1.5 bg-[#E6B862]/40 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }} />
        </div>
        
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#D35C2F] via-[#E6B862] to-[#D35C2F] bg-clip-text text-transparent">
          Welcome to Prodense AI
        </h1>
        <p className={clsx(
          'text-xl max-w-3xl mx-auto leading-relaxed mb-2',
          isDarkMode ? 'text-slate-300' : 'text-slate-600'
        )}>
          Your intelligent companion for dental tourism in India. Get personalized guidance for treatments, 
          travel planning, cost estimates, and seamless booking experiences.
        </p>
        <p className={clsx(
          'text-sm max-w-2xl mx-auto',
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        )}>
          Combining world-class dental care with India&apos;s rich cultural heritage
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full mb-12 relative z-10"
      >
        {suggestedPrompts.map((suggestion, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSuggestedPrompt(suggestion.prompt)}
            className={clsx(
              'group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden backdrop-blur-sm',
              isDarkMode 
                ? 'border-slate-700/50 hover:border-[#D35C2F]/50 bg-slate-800/30 hover:bg-slate-800/50' 
                : 'border-slate-200/50 hover:border-[#D35C2F]/50 bg-white/30 hover:bg-white/50'
            )}
          >
            {/* Gradient background on hover */}
            <div className={clsx(
              'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br',
              suggestion.gradient
            )} />
            
            <div className="flex items-start space-x-4 relative z-10">
              <div className={clsx(
                'p-3 rounded-xl transition-all duration-300 backdrop-blur-sm',
                isDarkMode 
                  ? 'bg-slate-700/50 group-hover:bg-slate-600/50' 
                  : 'bg-slate-100/50 group-hover:bg-white/80'
              )}>
                <suggestion.icon className={clsx('h-6 w-6 transition-colors duration-300', suggestion.color)} />
              </div>
              <div className="flex-1">
                <h3 className={clsx(
                  'font-semibold mb-2 transition-colors duration-300',
                  'group-hover:text-[#D35C2F]'
                )}>
                  {suggestion.title}
                </h3>
                <p className={clsx(
                  'text-sm leading-relaxed transition-colors duration-300',
                  isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-600 group-hover:text-slate-700'
                )}>
                  {suggestion.prompt}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full mb-12 relative z-10"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className={clsx(
              'text-center p-4 rounded-xl backdrop-blur-sm transition-all duration-300',
              isDarkMode 
                ? 'bg-slate-800/20 hover:bg-slate-800/40' 
                : 'bg-white/20 hover:bg-white/40'
            )}
          >
            <div className={clsx(
              'w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center',
              isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'
            )}>
              <feature.icon className="h-6 w-6 text-[#D35C2F]" />
            </div>
            <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
            <p className={clsx(
              'text-xs leading-relaxed',
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            )}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className={clsx(
          'max-w-3xl mx-auto p-6 rounded-2xl border backdrop-blur-sm relative z-10',
          isDarkMode 
            ? 'bg-slate-800/30 border-slate-700/50' 
            : 'bg-white/30 border-slate-200/50'
        )}
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-[#D35C2F]" />
          <h3 className="font-semibold text-lg">How to get the best results:</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className={clsx(
            'space-y-2 text-left',
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          )}>
            <div className="flex items-start space-x-2">
              <span className="text-[#D35C2F] font-bold">•</span>
              <span>Be specific about your dental needs and concerns</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-[#D35C2F] font-bold">•</span>
              <span>Mention your preferred travel dates and destinations</span>
            </div>
          </div>
          <div className={clsx(
            'space-y-2 text-left',
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          )}>
            <div className="flex items-start space-x-2">
              <span className="text-[#D35C2F] font-bold">•</span>
              <span>Ask about package deals and accommodation options</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-[#D35C2F] font-bold">•</span>
              <span>Inquire about post-treatment care and follow-ups</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8 relative z-10"
      >
        <p className={clsx(
          'text-xs flex items-center justify-center space-x-2',
          isDarkMode ? 'text-slate-500' : 'text-slate-400'
        )}>
          <SparklesIcon className="h-3 w-3" />
          <span>Powered by Prodense AI • Transforming dental tourism with intelligent assistance</span>
          <SparklesIcon className="h-3 w-3" />
        </p>
      </motion.div>
    </div>
  )
}