'use client'

import { Button } from '@/shared/Button'
import { UserIcon } from '@heroicons/react/24/outline'

interface Props {
  className?: string
}

export default function LoginButton({ className }: Props) {
  return (
    <Button 
      href="/login" 
      className={`${className} flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105`}
      color="primary"
    >
      <UserIcon className="w-4 h-4" />
      <span>Login</span>
    </Button>
  )
}