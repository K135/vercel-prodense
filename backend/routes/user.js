const express = require('express')
const router = express.Router()

const User = require('../models/User')
const { authenticate } = require('../middleware/auth')
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware')
const { body, validationResult } = require('express-validator')

// Import logging function
const { addLog } = require('../utils/logger')

/**
 * @route   GET /api/user/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile',
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
      address: user.address,
      isPhoneVerified: user.isPhoneVerified,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }, 'Profile retrieved successfully')
  })
)

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile',
  authenticate,
  [
    body('firstName')
      .optional({ checkFalsy: false })
      .isLength({ min: 0, max: 50 })
      .withMessage('First name cannot exceed 50 characters')
      .trim(),
    
    body('lastName')
      .optional({ checkFalsy: false })
      .isLength({ min: 0, max: 50 })
      .withMessage('Last name cannot exceed 50 characters')
      .trim(),
    
    body('dateOfBirth')
      .optional()
      .isISO8601()
      .withMessage('Please enter a valid date of birth')
      .custom((value) => {
        const dob = new Date(value)
        const minAge = new Date()
        minAge.setFullYear(minAge.getFullYear() - 13)
        
        if (dob > minAge) {
          throw new Error('You must be at least 13 years old')
        }
        return true
      }),
    
    body('gender')
      .optional()
      .isIn(['male', 'female', 'other'])
      .withMessage('Gender must be male, female, or other'),
    
    body('country')
      .optional({ checkFalsy: false })
      .isLength({ max: 100 })
      .withMessage('Country name cannot exceed 100 characters')
      .trim(),
    
    body('profession')
      .optional({ checkFalsy: false })
      .isLength({ max: 100 })
      .withMessage('Profession cannot exceed 100 characters')
      .trim(),
    
    body('address')
      .optional({ checkFalsy: false })
      .isLength({ max: 200 })
      .withMessage('Address cannot exceed 200 characters')
      .trim()
  ],
  asyncHandler(async (req, res) => {
    addLog('info', '=== PROFILE UPDATE REQUEST ===')
    addLog('info', 'Request details', {
      body: req.body,
      contentType: req.get('Content-Type'),
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent')
    })
    
    const errors = validationResult(req)
    
    addLog('info', 'Validation check', { errors: errors.array() })
    
    if (!errors.isEmpty()) {
      const formattedErrors = {}
      errors.array().forEach(error => {
        const field = error.path || error.param
        if (!formattedErrors[field]) {
          formattedErrors[field] = []
        }
        formattedErrors[field].push(error.msg)
      })
      
      addLog('error', 'Validation failed', { formattedErrors })
      return errorResponse(res, 'Validation failed', 422, formattedErrors)
    }

    const user = req.user
    const allowedUpdates = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'country', 'profession', 'address']
    const updates = {}

    addLog('info', 'Processing update request', {
      requestBody: req.body,
      allowedUpdates,
      userId: user._id
    })

    // Only include allowed fields that are present in request
    allowedUpdates.forEach(field => {
      if (req.body.hasOwnProperty(field)) {
        addLog('debug', `Including field ${field}`, { value: req.body[field] })
        updates[field] = req.body[field]
      } else {
        addLog('debug', `Skipping field ${field}: not in request`)
      }
    })

    addLog('info', 'Final updates object', { updates })

    // If no valid updates provided
    if (Object.keys(updates).length === 0) {
      addLog('error', 'No valid updates found')
      return errorResponse(res, 'No valid fields provided for update', 400)
    }

    // Update user
    Object.assign(user, updates)
    await user.save()

    addLog('success', 'Profile updated successfully', {
      userId: user._id,
      updatedFields: Object.keys(updates)
    })

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
      address: user.address,
      isPhoneVerified: user.isPhoneVerified,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }, 'Profile updated successfully')
  })
)

/**
 * @route   DELETE /api/user/account
 * @desc    Deactivate user account
 * @access  Private
 */
router.delete('/account',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = req.user

    // Soft delete - just deactivate the account
    user.isActive = false
    await user.save()

    successResponse(res, {
      message: 'Account deactivated successfully'
    }, 'Account deactivated successfully')
  })
)

/**
 * @route   POST /api/user/reactivate
 * @desc    Reactivate user account
 * @access  Public (but requires valid user ID and some verification)
 */
router.post('/reactivate',
  [
    body('email').optional().isEmail().withMessage('Please enter a valid email'),
    body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number')
  ],
  asyncHandler(async (req, res) => {
    const { email, phone } = req.body

    if (!email && !phone) {
      return errorResponse(res, 'Either email or phone is required', 400)
    }

    const query = {}
    if (email) query.email = email
    if (phone) query.phone = phone

    const user = await User.findOne({ ...query, isActive: false })

    if (!user) {
      return errorResponse(res, 'No deactivated account found with provided credentials', 404)
    }

    // In a real application, you might want to send an OTP for verification
    // For now, we'll just reactivate the account
    user.isActive = true
    await user.save()

    successResponse(res, {
      message: 'Account reactivated successfully',
      userId: user._id
    }, 'Account reactivated successfully')
  })
)

/**
 * @route   GET /api/user/stats
 * @desc    Get user statistics (for future use)
 * @access  Private
 */
router.get('/stats',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = req.user

    // Calculate some basic stats
    const accountAge = Math.floor((new Date() - user.createdAt) / (1000 * 60 * 60 * 24)) // days
    const lastLoginDays = user.lastLogin 
      ? Math.floor((new Date() - user.lastLogin) / (1000 * 60 * 60 * 24))
      : null

    successResponse(res, {
      accountAge,
      lastLoginDays,
      isPhoneVerified: user.isPhoneVerified,
      isEmailVerified: user.isEmailVerified,
      profileCompleteness: calculateProfileCompleteness(user),
      joinedDate: user.createdAt,
      lastLogin: user.lastLogin
    }, 'User statistics retrieved successfully')
  })
)

/**
 * Helper function to calculate profile completeness
 */
function calculateProfileCompleteness(user) {
  const fields = [
    'firstName', 'lastName', 'email', 'phone', 
    'dateOfBirth', 'gender', 'country', 'profession', 'address'
  ]
  
  const completedFields = fields.filter(field => {
    const value = user[field]
    return value !== null && value !== undefined && value !== ''
  })
  
  return Math.round((completedFields.length / fields.length) * 100)
}

module.exports = router