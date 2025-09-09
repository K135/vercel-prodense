'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'

interface User {
  id: string
  firstName: string
  lastName: string
  fullName: string
  phone?: string
  email?: string
  countryCode?: string
  country?: string
  dateOfBirth?: string
  gender?: string
  profession?: string
  address?: string
  isPhoneVerified: boolean
  isEmailVerified: boolean
  lastLogin?: string
  createdAt: string
  updatedAt?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (token: string, refreshToken: string, user: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user && !!token

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        console.log('🔐 Initializing Auth Context...')
        const storedToken = localStorage.getItem('authToken')
        const storedUser = localStorage.getItem('user')

        console.log('📦 LocalStorage Data:')
        console.log('- Token present:', !!storedToken)
        console.log('- Token length:', storedToken?.length)
        console.log('- User data present:', !!storedUser)
        console.log('- Raw user data:', storedUser)

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser)
          console.log('👤 Parsed User:', parsedUser)
          console.log('- User ID:', parsedUser.id)
          console.log('- User name:', parsedUser.firstName, parsedUser.lastName)
          console.log('- User phone:', parsedUser.phone)
          console.log('- User email:', parsedUser.email)
          
          setToken(storedToken)
          setUser(parsedUser)
          console.log('✅ Auth state initialized successfully')
        } else {
          console.log('❌ No valid auth data found in localStorage')
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error)
        // Clear corrupted data
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
        console.log('🏁 Auth initialization completed')
      }
    }

    initializeAuth()
  }, [])

  const login = (authToken: string, refreshToken: string, userData: User) => {
    try {
      localStorage.setItem('authToken', authToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      setToken(authToken)
      setUser(userData)
    } catch (error) {
      console.error('Error during login:', error)
    }
  }

  const logout = async () => {
    try {
      // Call logout API if token exists
      if (token) {
        await apiClient.auth.logout(token).catch(err => console.warn('Logout API call failed:', err))
      }
    } catch (error) {
      console.warn('Error during logout API call:', error)
    } finally {
      // Clear local storage and state regardless of API call result
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      
      setToken(null)
      setUser(null)
      
      // Redirect to home page
      router.push('/')
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const refreshUserProfile = async () => {
    if (!token) return

    try {
      const data = await apiClient.auth.getMe(token)
      if (data.success && data.data) {
        updateUser(data.data)
      }
    } catch (error: any) {
      console.error('Error refreshing user profile:', error)
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        // Token is invalid, logout user
        logout()
      }
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshUserProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext