'use client'

import Logo from '@/shared/Logo'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PhoneIcon, EnvelopeIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

// Country codes data
const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States' },
  { code: '+1', country: 'CA', flag: '🇨🇦', name: 'Canada' },
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
  { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: '+39', country: 'IT', flag: '🇮🇹', name: 'Italy' },
  { code: '+34', country: 'ES', flag: '🇪🇸', name: 'Spain' },
  { code: '+31', country: 'NL', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+41', country: 'CH', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+46', country: 'SE', flag: '🇸🇪', name: 'Sweden' },
  { code: '+47', country: 'NO', flag: '🇳🇴', name: 'Norway' },
  { code: '+45', country: 'DK', flag: '🇩🇰', name: 'Denmark' },
  { code: '+358', country: 'FI', flag: '🇫🇮', name: 'Finland' },
  { code: '+43', country: 'AT', flag: '🇦🇹', name: 'Austria' },
  { code: '+32', country: 'BE', flag: '🇧🇪', name: 'Belgium' },
  { code: '+351', country: 'PT', flag: '🇵🇹', name: 'Portugal' },
  { code: '+30', country: 'GR', flag: '🇬🇷', name: 'Greece' },
  { code: '+48', country: 'PL', flag: '🇵🇱', name: 'Poland' },
  { code: '+420', country: 'CZ', flag: '🇨🇿', name: 'Czech Republic' },
  { code: '+36', country: 'HU', flag: '🇭🇺', name: 'Hungary' },
  { code: '+7', country: 'RU', flag: '🇷🇺', name: 'Russia' },
  { code: '+86', country: 'CN', flag: '🇨🇳', name: 'China' },
  { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
  { code: '+82', country: 'KR', flag: '🇰🇷', name: 'South Korea' },
  { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
  { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: '+64', country: 'NZ', flag: '🇳🇿', name: 'New Zealand' },
  { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brazil' },
  { code: '+52', country: 'MX', flag: '🇲🇽', name: 'Mexico' },
  { code: '+54', country: 'AR', flag: '🇦🇷', name: 'Argentina' },
  { code: '+56', country: 'CL', flag: '🇨🇱', name: 'Chile' },
  { code: '+57', country: 'CO', flag: '🇨🇴', name: 'Colombia' },
  { code: '+51', country: 'PE', flag: '🇵🇪', name: 'Peru' },
  { code: '+27', country: 'ZA', flag: '🇿🇦', name: 'South Africa' },
  { code: '+20', country: 'EG', flag: '🇪🇬', name: 'Egypt' },
  { code: '+971', country: 'AE', flag: '🇦🇪', name: 'UAE' },
  { code: '+966', country: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+90', country: 'TR', flag: '🇹🇷', name: 'Turkey' },
]

const Page = () => {
  const router = useRouter()
  const [inputType, setInputType] = useState<'phone' | 'email'>('phone')
  const [inputValue, setInputValue] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [validationError, setValidationError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [showSignupForm, setShowSignupForm] = useState(false)
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    country: '',
    profession: '',
    email: ''
  })
  const [signupError, setSignupError] = useState('')
  const [showEmailOtp, setShowEmailOtp] = useState(false)
  const [emailOtpValue, setEmailOtpValue] = useState('')
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [signupCountries, setSignupCountries] = useState(countryCodes)
  const [selectedSignupCountry, setSelectedSignupCountry] = useState(countryCodes[0])
  const [isSignupDropdownOpen, setIsSignupDropdownOpen] = useState(false)

  // Auto-detect country based on IP
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        const countryCode = data.country_code
        
        const foundCountry = countryCodes.find(country => country.country === countryCode)
        if (foundCountry) {
          setSelectedCountry(foundCountry)
          setSelectedSignupCountry(foundCountry)
          setSignupData(prev => ({ ...prev, country: foundCountry.name }))
        }
      } catch (error) {
        console.log('Could not detect location, using default')
      } finally {
        setIsLoadingLocation(false)
      }
    }

    detectCountry()
  }, [])

  const handleGoogleLogin = () => {
    // Handle Google login
    console.log('Google login clicked')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!showOtpInput) {
      // Validate input before requesting OTP
      if (inputValue.trim() === '') {
        setValidationError(`Please enter your ${inputType === 'phone' ? 'phone number' : 'email address'}`)
        return
      }

      if (inputType === 'email' && !validateEmail(inputValue)) {
        setValidationError('Please enter a valid email address')
        return
      }

      if (inputType === 'phone' && !validatePhone(inputValue)) {
        setValidationError('Please enter a valid phone number')
        return
      }

      // First submission - show OTP input
      setValidationError('') // Clear any existing errors
      setShowOtpInput(true)
      console.log('OTP requested for:', { 
        type: inputType, 
        value: inputValue,
        countryCode: inputType === 'phone' ? selectedCountry.code : null
      })
    } else {
      // Validate OTP
      if (otpValue.length !== 6) {
        setValidationError('Please enter a valid 6-digit OTP')
        return
      }

      // Second submission - verify OTP
      setValidationError('') // Clear any existing errors
      setIsVerifying(true)
      
      // Simulate OTP verification
      setTimeout(() => {
        setIsVerifying(false)
        setIsVerified(true)
        
        console.log('OTP verification:', { 
          type: inputType, 
          value: inputValue,
          countryCode: inputType === 'phone' ? selectedCountry.code : null,
          otp: otpValue
        })
        
        // Check if this is the special signup phone number
        const isSignupNumber = inputType === 'phone' && inputValue === '9999999999'
        
        // Reset after animation completes
        setTimeout(() => {
          if (isSignupNumber) {
            // Show signup form instead of redirecting
            setShowSignupForm(true)
          } else {
            // Redirect to stay categories page for regular login
            router.push('/stay-categories/')
          }
        }, 3000)
      }, 2000)
    }
  }

  const getDisplayValue = () => {
    if (inputType === 'phone') {
      return `${selectedCountry.code} ${inputValue}`
    }
    return inputValue
  }

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '')
    // Most countries have phone numbers between 7-15 digits
    return cleanPhone.length >= 7 && cleanPhone.length <= 15
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    setValidationError('') // Clear error when user starts typing
  }

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!showEmailOtp) {
      // Validate signup data before requesting email OTP
      if (!signupData.firstName.trim()) {
        setSignupError('Please enter your first name')
        return
      }
      
      if (!signupData.lastName.trim()) {
        setSignupError('Please enter your last name')
        return
      }
      
      if (!signupData.dateOfBirth.trim()) {
        setSignupError('Please enter your date of birth')
        return
      }
      
      if (!signupData.gender) {
        setSignupError('Please select your gender')
        return
      }
      
      if (!signupData.country.trim()) {
        setSignupError('Please select your country')
        return
      }
      
      if (!signupData.profession.trim()) {
        setSignupError('Please enter your profession')
        return
      }
      
      if (!signupData.email.trim()) {
        setSignupError('Please enter your email address')
        return
      }
      
      if (!validateEmail(signupData.email)) {
        setSignupError('Please enter a valid email address')
        return
      }
      
      // Show email OTP input
      setSignupError('')
      setShowEmailOtp(true)
      console.log('Email OTP requested for:', signupData.email)
    } else {
      // Validate email OTP
      if (emailOtpValue.length !== 6) {
        setSignupError('Please enter a valid 6-digit OTP')
        return
      }
      
      // Verify email OTP
      setSignupError('')
      setIsVerifyingEmail(true)
      
      setTimeout(() => {
        setIsVerifyingEmail(false)
        setIsEmailVerified(true)
        
        console.log('Complete signup data:', {
          phone: `${selectedCountry.code} ${inputValue}`,
          ...signupData,
          emailOtp: emailOtpValue
        })
        
        // Redirect after successful signup
        setTimeout(() => {
          router.push('/stay-categories/')
        }, 2000)
      }, 2000)
    }
  }

  const handleSignupInputChange = (field: keyof typeof signupData, value: string) => {
    setSignupData(prev => ({
      ...prev,
      [field]: value
    }))
    setSignupError('') // Clear error when user starts typing
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - 70% with Background Image */}
      <div className="hidden lg:flex lg:w-[70%] relative overflow-hidden">
        <Image
          src="/loginbg.png"
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Section - 30% with Login Form */}
      <div className="w-full lg:w-[30%] flex flex-col justify-center px-8 lg:px-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-sm mx-auto relative">
          {/* Login Form */}
          <div className={`transition-all duration-500 ease-in-out ${
            showSignupForm ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
            {/* Logo */}
            <div className="mb-12 text-center">
              <Logo className="!w-48 !h-auto mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Signin / Signup your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Type Toggle */}
            <div className="relative flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              {/* Sliding Background */}
              <div 
                className={`absolute top-1 bottom-1 w-1/2 bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-all duration-300 ease-in-out ${
                  inputType === 'phone' ? 'left-1' : 'left-1/2'
                }`}
              />
              
              <button
                type="button"
                onClick={() => {
                  setInputType('phone')
                  setInputValue('')
                  setShowOtpInput(false)
                  setOtpValue('')
                  setValidationError('')
                }}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out ${
                  inputType === 'phone'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <PhoneIcon className={`h-4 w-4 transition-all duration-300 ${
                  inputType === 'phone' ? 'scale-110' : 'scale-100'
                }`} />
                Phone
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputType('email')
                  setInputValue('')
                  setShowOtpInput(false)
                  setOtpValue('')
                  setValidationError('')
                }}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out ${
                  inputType === 'email'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <EnvelopeIcon className={`h-4 w-4 transition-all duration-300 ${
                  inputType === 'email' ? 'scale-110' : 'scale-100'
                }`} />
                Email
              </button>
            </div>

            {/* Input Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {inputType === 'phone' ? 'Phone Number' : 'Email Address'}
              </label>
              <div className="relative">
                {inputType === 'phone' ? (
                  <div className="flex">
                    {/* Country Code Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center gap-2 px-3 py-3 border border-r-0 rounded-l-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent transition-all duration-200 ${
                          validationError && inputType === 'phone' 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        disabled={isLoadingLocation}
                      >
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="text-sm font-medium">{selectedCountry.code}</span>
                        <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                          {countryCodes.map((country, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(country)
                                setIsDropdownOpen(false)
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                              <span className="text-lg">{country.flag}</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{country.code}</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{country.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Phone Input */}
                    <input
                      type="tel"
                      value={inputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="XXXXXXXXXX"
                      className={`flex-1 px-4 py-3 border rounded-r-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent transition-all duration-200 ${
                        validationError && inputType === 'phone' 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                  </div>
                ) : (
                  <input
                    type="email"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent transition-all duration-200 ${
                      validationError && inputType === 'email' 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    required
                  />
                )}
              </div>
              
              {/* Validation Error Message */}
              {validationError && !showOtpInput && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {validationError}
                </div>
              )}
            </div>

            {/* OTP Input Section - Slides down after Get OTP is clicked */}
            <div className={`transition-all duration-500 ease-in-out ${
              showOtpInput ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
              <div className="space-y-2 pb-4 px-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enter OTP sent to {getDisplayValue()}
                </label>
                <input
                  type="text"
                  value={otpValue}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setOtpValue(newValue)
                    if (validationError && validationError.includes('OTP')) {
                      setValidationError('') // Clear OTP error when user starts typing
                    }
                  }}
                  placeholder="xxxxxx"
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent transition-all duration-200 text-left text-lg font-mono tracking-widest ${
                    validationError && validationError.includes('OTP') 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  maxLength={6}
                  required={showOtpInput}
                />
                
                {/* OTP Validation Error Message */}
                {validationError && validationError.includes('OTP') && (
                  <div className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {validationError}
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtpInput(false)
                      setValidationError('')
                    }}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    ← Back to {inputType === 'phone' ? 'phone' : 'email'}
                  </button>
                  <button
                    type="button"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={isVerifying || isVerified}
              className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg ${
                isVerifying
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : isVerified
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white cursor-not-allowed shadow-emerald-200 dark:shadow-emerald-900/50'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:scale-[1.02] hover:shadow-xl focus:ring-blue-500'
              }`}
            >
              {isVerifying ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : isVerified ? (
                <div className="flex items-center justify-center gap-2 text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified!
                </div>
              ) : (
                showOtpInput ? 'Verify OTP' : 'Get OTP'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </form>
          </div>

          {/* Signup Form */}
          <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            showSignupForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}>
            <div className="w-full max-w-sm mx-auto">
              {/* Logo */}
              <div className="mb-12 text-center">
                <Logo className="!w-48 !h-auto mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Welcome to Prodense, We need few essential informations to give you customised experience
                </p>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSignupSubmit} className="space-y-6">
                {!showEmailOtp ? (
                  <>
                    {/* First Name and Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={signupData.firstName}
                          onChange={(e) => handleSignupInputChange('firstName', e.target.value)}
                          placeholder="First name"
                          className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent transition-all duration-200 ${
                            signupError && signupError.includes('first name') 
                              ? 'border-red-500 dark:border-red-400' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={signupData.lastName}
                          onChange={(e) => handleSignupInputChange('lastName', e.target.value)}
                          placeholder="Last name"
                          className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent transition-all duration-200 ${
                            signupError && signupError.includes('last name') 
                              ? 'border-red-500 dark:border-red-400' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                          required
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date of Birth (DD/MM/YYYY)
                      </label>
                      <input
                        type="date"
                        value={signupData.dateOfBirth}
                        onChange={(e) => handleSignupInputChange('dateOfBirth', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent transition-all duration-200 ${
                          signupError && signupError.includes('date of birth') 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        required
                      />
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Gender
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Male', 'Female', 'Other'].map((gender) => (
                          <button
                            key={gender}
                            type="button"
                            onClick={() => handleSignupInputChange('gender', gender)}
                            className={`py-3 px-4 border rounded-xl text-sm font-medium transition-all duration-200 ${
                              signupData.gender === gender
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:border-blue-500'
                            }`}
                          >
                            {gender}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Country
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsSignupDropdownOpen(!isSignupDropdownOpen)}
                          className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent transition-all duration-200 ${
                            signupError && signupError.includes('country') 
                              ? 'border-red-500 dark:border-red-400' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{selectedSignupCountry.flag}</span>
                            <span className="text-sm">{signupData.country || selectedSignupCountry.name}</span>
                          </div>
                          <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isSignupDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Country Dropdown */}
                        {isSignupDropdownOpen && (
                          <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                            {signupCountries.map((country, index) => (
                              <button
                                key={`${country.country}-${index}`}
                                type="button"
                                onClick={() => {
                                  setSelectedSignupCountry(country)
                                  handleSignupInputChange('country', country.name)
                                  setIsSignupDropdownOpen(false)
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                              >
                                <span className="text-lg">{country.flag}</span>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{country.name}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{country.code}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Profession */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Profession
                      </label>
                      <input
                        type="text"
                        value={signupData.profession}
                        onChange={(e) => handleSignupInputChange('profession', e.target.value)}
                        placeholder="Enter your profession"
                        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent transition-all duration-200 ${
                          signupError && signupError.includes('profession') 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={signupData.email}
                        onChange={(e) => handleSignupInputChange('email', e.target.value)}
                        placeholder="Enter your email address"
                        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent transition-all duration-200 ${
                          signupError && signupError.includes('email') 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Email OTP Section */}
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Verify Your Email
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        We&apos;ve sent a 6-digit code to <span className="font-medium">{signupData.email}</span>
                      </p>
                    </div>

                    {/* Email OTP Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        value={emailOtpValue}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                          setEmailOtpValue(value)
                          setSignupError('')
                        }}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest ${
                          signupError && signupError.includes('OTP') 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        required
                      />
                    </div>

                    {/* Resend OTP */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          console.log('Resending OTP to:', signupData.email)
                        }}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                      >
                        Didn&apos;t receive the code? Resend OTP
                      </button>
                    </div>
                  </>
                )}

                {/* Signup Error Message */}
                {signupError && (
                  <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {signupError}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isVerifyingEmail}
                  className="w-full font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:scale-[1.02] hover:shadow-xl focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isVerifyingEmail ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : showEmailOtp ? (
                    'Complete Registration'
                  ) : (
                    'Continue'
                  )}
                </button>

                {/* Success Animation */}
                {isEmailVerified && (
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mb-2">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Registration completed successfully!
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Modern Subtle Verification Success Animation - Only on Right Side */}
      {isVerified && !showSignupForm && (
        <div className="fixed top-0 right-0 w-full lg:w-[30%] h-full z-40 pointer-events-none">
          {/* Modern Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/40 dark:from-emerald-950/30 dark:via-green-950/20 dark:to-teal-950/10 backdrop-blur-[2px] animate-fade-in"></div>
          
          {/* Floating Success Card */}
          <div className="absolute inset-0 flex items-center justify-center px-8">
            <div className="relative">
              {/* Subtle Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-2xl blur-xl animate-pulse-slow"></div>
              
              {/* Main Card */}
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-emerald-200/50 dark:border-emerald-800/30 animate-slide-up">
                {/* Modern Check Icon */}
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg animate-scale-bounce">
                    <svg 
                      className="w-7 h-7 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path 
                        d="M4 12l5 5L20 6" 
                        className="animate-check-draw"
                        style={{
                          strokeDasharray: '20',
                          strokeDashoffset: '20',
                          animation: 'checkDraw 0.8s ease-out 0.4s forwards'
                        }}
                      />
                    </svg>
                    
                    {/* Subtle Ring Animation */}
                    <div className="absolute inset-0 rounded-xl border-2 border-emerald-300/50 animate-ping-slow"></div>
                  </div>
                </div>
                
                {/* Modern Typography */}
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white animate-fade-in-up">
                    Verified
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 animate-fade-in-up animation-delay-200">
                    Authentication successful
                  </p>
                </div>
                
                {/* Subtle Progress Indicator */}
                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-progress-fill"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Animation Styles */}
      <style jsx>{`
        @keyframes checkDraw {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes slide-up {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes scale-bounce {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          0% {
            transform: translateY(15px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes progress-fill {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.7s ease-out 0.2s both;
        }
        
        .animate-scale-bounce {
          animation: scale-bounce 0.6s ease-out 0.5s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out 0.8s both;
        }
        
        .animate-progress-fill {
          animation: progress-fill 1.5s ease-out 1.2s both;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s ease-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}

export default Page
