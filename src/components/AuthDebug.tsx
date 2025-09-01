'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'

export default function AuthDebug() {
  const { user, isAuthenticated, isLoading, token } = useAuth()
  const [localStorageData, setLocalStorageData] = useState({
    hasToken: false,
    hasUser: false
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLocalStorageData({
      hasToken: !!localStorage.getItem('authToken'),
      hasUser: !!localStorage.getItem('user')
    })
  }, [])

  if (!mounted) {
    return (
      <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
        <h4 className="font-bold mb-2">Auth Debug:</h4>
        <p>Loading component...</p>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">Auth Debug:</h4>
      <p>Loading: {isLoading ? '✅' : '❌'}</p>
      <p>Authenticated: {isAuthenticated ? '✅' : '❌'}</p>
      <p>Has Token: {token ? '✅' : '❌'}</p>
      <p>Has User: {user ? '✅' : '❌'}</p>
      {user && (
        <div className="mt-2 text-xs">
          <p>Name: {user.fullName}</p>
          <p>Phone: {user.phone}</p>
        </div>
      )}
      <div className="mt-2">
        <p>LocalStorage Token: {localStorageData.hasToken ? '✅' : '❌'}</p>
        <p>LocalStorage User: {localStorageData.hasUser ? '✅' : '❌'}</p>
      </div>
    </div>
  )
}