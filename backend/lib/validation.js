const { body, validationResult } = require('express-validator')

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} Is valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number
 * @returns {boolean} Is valid phone
 */
const isValidPhone = (phone) => {
  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '')
  // Most countries have phone numbers between 7-15 digits
  return cleanPhone.length >= 7 && cleanPhone.length <= 15
}

/**
 * Validate OTP format
 * @param {string} otp - OTP code
 * @returns {boolean} Is valid OTP
 */
const isValidOTP = (otp) => {
  return /^\d{6}$/.test(otp)
}

/**
 * Validate country code format
 * @param {string} countryCode - Country code
 * @returns {boolean} Is valid country code
 */
const isValidCountryCode = (countryCode) => {
  return /^\+\d{1,4}$/.test(countryCode)
}

/**
 * Request OTP validation rules
 */
const validateRequestOTP = [
  body('inputType')
    .isIn(['phone', 'email'])
    .withMessage('Input type must be either phone or email'),
  
  body('inputValue')
    .notEmpty()
    .withMessage('Input value is required')
    .custom((value, { req }) => {
      if (req.body.inputType === 'email' && !isValidEmail(value)) {
        throw new Error('Please enter a valid email address')
      }
      if (req.body.inputType === 'phone' && !isValidPhone(value)) {
        throw new Error('Please enter a valid phone number')
      }
      return true
    }),
  
  body('countryCode')
    .if(body('inputType').equals('phone'))
    .notEmpty()
    .withMessage('Country code is required for phone numbers')
    .custom((value) => {
      if (!isValidCountryCode(value)) {
        throw new Error('Please enter a valid country code (e.g., +1)')
      }
      return true
    })
]

/**
 * Verify OTP validation rules
 */
const validateVerifyOTP = [
  body('otp')
    .notEmpty()
    .withMessage('OTP is required')
    .custom((value) => {
      if (!isValidOTP(value)) {
        throw new Error('OTP must be a 6-digit number')
      }
      return true
    }),
  
  body('identifier')
    .notEmpty()
    .withMessage('Identifier (phone/email) is required'),
  
  body('type')
    .isIn(['phone', 'email'])
    .withMessage('Type must be either phone or email')
]

/**
 * Signup validation rules
 */
const validateSignup = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .trim(),
  
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .trim(),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .custom((value) => {
      if (value && !isValidPhone(value)) {
        throw new Error('Please enter a valid phone number')
      }
      return true
    }),
  
  body('countryCode')
    .if(body('phone').exists())
    .notEmpty()
    .withMessage('Country code is required when phone is provided')
    .custom((value) => {
      if (!isValidCountryCode(value)) {
        throw new Error('Please enter a valid country code')
      }
      return true
    }),
  
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
    .optional()
    .isLength({ max: 100 })
    .withMessage('Country name cannot exceed 100 characters')
    .trim(),
  
  body('profession')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Profession cannot exceed 100 characters')
    .trim(),
  
  // Custom validation to ensure at least one contact method
  body().custom((value) => {
    if (!value.phone && !value.email) {
      throw new Error('Either phone or email must be provided')
    }
    return true
  })
]

/**
 * Handle validation errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const formattedErrors = {}
    
    errors.array().forEach(error => {
      const field = error.path || error.param || 'general'
      if (!formattedErrors[field]) {
        formattedErrors[field] = []
      }
      formattedErrors[field].push(error.msg)
    })
    
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    })
  }
  
  next()
}

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidOTP,
  isValidCountryCode,
  validateRequestOTP,
  validateVerifyOTP,
  validateSignup,
  handleValidationErrors
}