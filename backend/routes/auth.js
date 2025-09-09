const express = require('express')
const router = express.Router()

const User = require('../models/User')
const OTP = require('../models/OTP')
const { generateTokenPair } = require('../lib/jwt')
const { 
  validateRequestOTP, 
  validateVerifyOTP, 
  validateSignup, 
  handleValidationErrors 
} = require('../lib/validation')
const { authenticate, validateRefreshToken } = require('../middleware/auth')
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware')
const { addLog } = require('../utils/logger')

/**
 * @route   POST /api/auth/request-otp
 * @desc    Request OTP for phone or email
 * @access  Public
 */
router.post('/request-otp', 
  validateRequestOTP,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { inputType, inputValue, countryCode } = req.body

    // Create identifier based on input type
    const identifier = inputType === 'phone' ? `${countryCode}${inputValue}` : inputValue

    // Check if user exists
    const existingUser = await User.findByIdentifier(identifier, inputType)
    const purpose = existingUser ? 'login' : 'signup'

    addLog('info', 'OTP request received', {
      inputType,
      identifier: identifier.replace(/\d{4}$/, '****'), // Mask last 4 digits for privacy
      purpose,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    })

    // Create OTP record
    const otpRecord = await OTP.createOTP(identifier, inputType, purpose, req)

    // In a real application, you would send the OTP via SMS or email here
    console.log(`📱 OTP for ${identifier}: ${otpRecord.otp}`)
    
    addLog('success', 'OTP generated successfully', {
      identifier: identifier.replace(/\d{4}$/, '****'),
      purpose,
      expiresAt: otpRecord.expiresAt
    })

    // TODO: Implement actual SMS/Email sending
    // if (inputType === 'phone') {
    //   await sendSMS(identifier, otpRecord.otp)
    // } else {
    //   await sendEmail(identifier, otpRecord.otp)
    // }

    successResponse(res, {
      identifier,
      type: inputType,
      purpose,
      expiresIn: Math.floor((otpRecord.expiresAt - new Date()) / 1000),
      message: `OTP sent to your ${inputType}`
    }, `OTP sent successfully to your ${inputType}`)
  })
)

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and login/signup
 * @access  Public
 */
router.post('/verify-otp',
  validateVerifyOTP,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { otp, identifier, type } = req.body

    // Find the OTP record
    const otpRecord = await OTP.findOne({
      identifier,
      type,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    })

    if (!otpRecord) {
      return errorResponse(res, 'Invalid or expired OTP', 400)
    }

    // Check if too many attempts (skip in development mode)
    const maxAttempts = process.env.NODE_ENV === 'development' ? 50 : 5
    if (otpRecord.attempts >= maxAttempts) {
      await OTP.deleteOne({ _id: otpRecord._id })
      return errorResponse(res, 'Too many attempts. Please request a new OTP.', 429)
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      await otpRecord.incrementAttempts()
      const maxAttempts = process.env.NODE_ENV === 'development' ? 50 : 5
      return errorResponse(res, `Invalid OTP. ${maxAttempts - otpRecord.attempts - 1} attempts remaining.`, 400)
    }

    // Mark OTP as used
    await otpRecord.markAsUsed()

    // Find existing user
    const user = await User.findByIdentifier(identifier, type)

    if (user) {
      // Existing user - login
      user.lastLogin = new Date()
      if (type === 'phone') {
        user.isPhoneVerified = true
      } else {
        user.isEmailVerified = true
      }
      await user.save()

      const tokens = generateTokenPair(user)

      successResponse(res, {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.getFullName(),
          phone: user.phone,
          email: user.email,
          countryCode: user.countryCode,
          country: user.country,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          profession: user.profession,
          isPhoneVerified: user.isPhoneVerified,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt
        },
        ...tokens,
        isNewUser: false
      }, 'Login successful')
    } else {
      // New user - needs to complete signup
      successResponse(res, {
        identifier,
        type,
        isNewUser: true,
        needsSignup: true,
        message: 'OTP verified. Please complete your profile.'
      }, 'OTP verified successfully. Complete your signup.')
    }
  })
)

/**
 * @route   POST /api/auth/signup
 * @desc    Complete user signup
 * @access  Public
 */
router.post('/signup',
  validateSignup,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const {
      phone,
      countryCode,
      email,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      country,
      profession
    } = req.body

    // Check if user already exists
    const existingConditions = []
    if (phone && countryCode) {
      existingConditions.push({ phone, countryCode })
    }
    if (email) {
      existingConditions.push({ email })
    }

    if (existingConditions.length > 0) {
      const existingUser = await User.findOne({ $or: existingConditions })
      if (existingUser) {
        return errorResponse(res, 'User already exists with this phone number or email', 409)
      }
    }

    // Create new user
    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      isActive: true
    }

    // Add optional fields
    if (phone && countryCode) {
      userData.phone = phone
      userData.countryCode = countryCode
      userData.isPhoneVerified = true // Since they verified OTP
    }

    if (email) {
      userData.email = email.toLowerCase().trim()
      userData.isEmailVerified = phone ? false : true // Email verified if it's the primary auth method
    }

    if (dateOfBirth) {
      userData.dateOfBirth = new Date(dateOfBirth)
    }

    if (gender) {
      userData.gender = gender
    }

    if (country) {
      userData.country = country.trim()
    }

    if (profession) {
      userData.profession = profession.trim()
    }

    const user = new User(userData)
    await user.save()

    // Generate tokens
    const tokens = generateTokenPair(user)

    // Clean up any remaining OTP records for this user
    if (phone && countryCode) {
      await OTP.deleteMany({ identifier: `${countryCode}${phone}`, type: 'phone' })
    }
    if (email) {
      await OTP.deleteMany({ identifier: email, type: 'email' })
    }

    successResponse(res, {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.getFullName(),
        phone: user.phone,
        email: user.email,
        countryCode: user.countryCode,
        country: user.country,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        profession: user.profession,
        isPhoneVerified: user.isPhoneVerified,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      },
      ...tokens,
      isNewUser: true
    }, 'Account created successfully', 201)
  })
)

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public (requires refresh token)
 */
router.post('/refresh',
  validateRefreshToken,
  asyncHandler(async (req, res) => {
    const user = req.user

    // Generate new token pair
    const tokens = generateTokenPair(user)

    successResponse(res, {
      ...tokens,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.getFullName()
      }
    }, 'Token refreshed successfully')
  })
)

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = req.user

    // Update user's last activity
    user.lastLogin = new Date()
    await user.save()

    // In a real application, you might want to:
    // 1. Add the token to a blacklist
    // 2. Clear refresh tokens from database
    // 3. Log the logout event

    successResponse(res, {
      message: 'Logged out successfully'
    }, 'Logout successful')
  })
)

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Private
 */
router.get('/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = req.user

    successResponse(res, {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.getFullName(),
      phone: user.phone,
      email: user.email,
      countryCode: user.countryCode,
      country: user.country,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      profession: user.profession,
      isPhoneVerified: user.isPhoneVerified,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }, 'User info retrieved successfully')
  })
)

module.exports = router