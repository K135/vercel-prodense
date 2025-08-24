'use client'

import React from 'react'
import Link from 'next/link'
import { UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface ModernLoginButtonProps {
  href?: string
  onClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'subtle' | 'minimal' | 'outline'
}

const ModernLoginButton: React.FC<ModernLoginButtonProps> = ({
  href,
  onClick,
  className,
  size = 'md',
  variant = 'subtle'
}) => {
  const baseClasses = clsx(
    'group relative inline-flex items-center justify-center gap-2',
    'font-medium rounded-lg transition-all duration-200 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-1',
    {
      // Size variants
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-base': size === 'md',
      'px-6 py-3 text-lg': size === 'lg',
    }
  )

  const variantClasses = {
    subtle: clsx(
      'bg-gray-50 text-gray-700 border border-gray-200',
      'hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900',
      'dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700',
      'dark:hover:bg-gray-700/50 dark:hover:border-gray-600 dark:hover:text-white'
    ),
    minimal: clsx(
      'bg-transparent text-gray-600 border border-transparent',
      'hover:bg-gray-50 hover:text-gray-900',
      'dark:text-gray-400 dark:hover:bg-gray-800/30 dark:hover:text-white'
    ),
    outline: clsx(
      'bg-transparent text-[#0480ea] border border-[#0480ea]/30',
      'hover:bg-[#0480ea]/5 hover:border-[#0480ea]/50 hover:text-[#0480ea]',
      'dark:text-blue-400 dark:border-blue-400/30',
      'dark:hover:bg-blue-400/5 dark:hover:border-blue-400/50'
    )
  }

  const content = (
    <>
      {/* Icon */}
      <UserIcon className={clsx(
        'transition-transform duration-200 group-hover:scale-110',
        {
          'h-4 w-4': size === 'sm' || size === 'md',
          'h-5 w-5': size === 'lg',
        }
      )} />
      
      {/* Text */}
      <span>Login</span>
      
      {/* Arrow that appears on hover */}
      <ArrowRightIcon className={clsx(
        'transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0',
        {
          'h-3 w-3': size === 'sm',
          'h-4 w-4': size === 'md' || size === 'lg',
        }
      )} />
    </>
  )

  const buttonClasses = clsx(baseClasses, variantClasses[variant], className)

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {content}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={buttonClasses}>
      {content}
    </button>
  )
}

export default ModernLoginButton