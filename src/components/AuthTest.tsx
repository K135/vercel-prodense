'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function AuthTest() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) {
    return <div className="p-4 bg-yellow-100 rounded">Loading auth state...</div>
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Auth Status:</h3>
      <p>Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
      {user && (
        <div className="mt-2">
          <p>User: {user.fullName}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <button 
            onClick={logout}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}