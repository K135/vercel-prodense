// Global type definitions for the application

declare global {
  var mongoose: {
    conn: any
    promise: any
  }

  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string
      JWT_SECRET: string
      JWT_EXPIRES_IN?: string
      DEFAULT_OTP?: string
      NEXT_PUBLIC_API_BASE_URL?: string
    }
  }
}

// Auth types
export interface User {
  id: string
  firstName: string
  lastName: string
  fullName: string
  phone?: string
  email?: string
  countryCode?: string
  country?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  profession?: string
  address?: string
  isPhoneVerified: boolean
  isEmailVerified: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  isNewUser: boolean
}

export interface LoginRequest {
  inputType: 'phone' | 'email'
  inputValue: string
  countryCode?: string
}

export interface OTPRequest {
  otp: string
  identifier: string
  type: 'phone' | 'email'
}

export interface SignupRequest {
  phone?: string
  countryCode?: string
  email?: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  country?: string
  profession?: string
  address?: string
}

export {}