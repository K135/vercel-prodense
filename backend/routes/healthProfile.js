const express = require('express')
const router = express.Router()

const HealthProfile = require('../models/HealthProfile')
const { authenticate } = require('../middleware/auth')
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware')
const { body, validationResult } = require('express-validator')

/**
 * @route   GET /api/user/health-profile
 * @desc    Get user's health profile
 * @access  Private
 */
router.get('/health-profile',
  authenticate,
  asyncHandler(async (req, res) => {
    let healthProfile = await HealthProfile.findOne({ userId: req.user._id })
    
    // Create default health profile if doesn't exist
    if (!healthProfile) {
      healthProfile = new HealthProfile({
        userId: req.user._id,
        medicalHistory: {
          allergies: [],
          medications: [],
          chronicConditions: [],
          surgeries: []
        },
        dentalHistory: {
          dentalProblems: [],
          previousTreatments: [],
          oralHygiene: {}
        },
        emergencyContact: {},
        insurance: {},
        preferences: {
          preferredLanguage: 'english',
          communicationMethod: 'email',
          appointmentReminders: true,
          marketingEmails: false
        }
      })
      await healthProfile.save()
    }

    successResponse(res, healthProfile, 'Health profile retrieved successfully')
  })
)

/**
 * @route   PUT /api/user/health-profile
 * @desc    Update user's health profile
 * @access  Private
 */
router.put('/health-profile',
  authenticate,
  [
    body('medicalHistory.bloodType')
      .optional()
      .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
      .withMessage('Invalid blood type'),
    
    body('medicalHistory.allergies')
      .optional()
      .isArray()
      .withMessage('Allergies must be an array'),
    
    body('medicalHistory.medications')
      .optional()
      .isArray()
      .withMessage('Medications must be an array'),
    
    body('dentalHistory.lastDentalVisit')
      .optional()
      .isISO8601()
      .withMessage('Last dental visit must be a valid date'),
    
    body('dentalHistory.oralHygiene.brushingFrequency')
      .optional()
      .isIn(['once-daily', 'twice-daily', 'after-meals', 'rarely'])
      .withMessage('Invalid brushing frequency'),
    
    body('dentalHistory.oralHygiene.flossingFrequency')
      .optional()
      .isIn(['daily', 'weekly', 'monthly', 'rarely', 'never'])
      .withMessage('Invalid flossing frequency'),
    
    body('emergencyContact.name')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Emergency contact name must be between 1 and 100 characters'),
    
    body('emergencyContact.phone')
      .optional()
      .isMobilePhone()
      .withMessage('Invalid emergency contact phone number'),
    
    body('emergencyContact.email')
      .optional()
      .isEmail()
      .withMessage('Invalid emergency contact email'),
    
    body('insurance.provider')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Insurance provider name cannot exceed 100 characters'),
    
    body('insurance.expiryDate')
      .optional()
      .isISO8601()
      .withMessage('Insurance expiry date must be a valid date'),
    
    body('preferences.preferredLanguage')
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage('Preferred language must be between 1 and 50 characters'),
    
    body('preferences.communicationMethod')
      .optional()
      .isIn(['email', 'sms', 'phone', 'whatsapp'])
      .withMessage('Invalid communication method')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      const formattedErrors = {}
      errors.array().forEach(error => {
        const field = error.path || error.param
        if (!formattedErrors[field]) {
          formattedErrors[field] = []
        }
        formattedErrors[field].push(error.msg)
      })
      
      return errorResponse(res, 'Validation failed', 422, formattedErrors)
    }

    let healthProfile = await HealthProfile.findOne({ userId: req.user._id })
    
    if (!healthProfile) {
      healthProfile = new HealthProfile({ userId: req.user._id })
    }

    // Update fields that are provided
    const allowedFields = [
      'medicalHistory', 'dentalHistory', 'emergencyContact', 
      'insurance', 'preferences'
    ]

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] === 'object' && !Array.isArray(req.body[field])) {
          // Merge nested objects
          healthProfile[field] = {
            ...healthProfile[field].toObject(),
            ...req.body[field]
          }
        } else {
          healthProfile[field] = req.body[field]
        }
      }
    })

    await healthProfile.save()

    successResponse(res, healthProfile, 'Health profile updated successfully')
  })
)

/**
 * @route   POST /api/user/health-profile/medical-history
 * @desc    Add medical history entry
 * @access  Private
 */
router.post('/medical-history',
  authenticate,
  [
    body('type')
      .isIn(['allergy', 'medication', 'condition', 'surgery'])
      .withMessage('Invalid medical history type'),
    
    body('details')
      .isObject()
      .withMessage('Details must be an object')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const { type, details } = req.body
    let healthProfile = await HealthProfile.findOne({ userId: req.user._id })
    
    if (!healthProfile) {
      healthProfile = new HealthProfile({ userId: req.user._id })
    }

    switch (type) {
      case 'allergy':
        healthProfile.medicalHistory.allergies.push(details.allergy)
        break
      case 'medication':
        healthProfile.medicalHistory.medications.push(details)
        break
      case 'condition':
        healthProfile.medicalHistory.chronicConditions.push(details)
        break
      case 'surgery':
        healthProfile.medicalHistory.surgeries.push(details)
        break
    }

    await healthProfile.save()

    successResponse(res, healthProfile, 'Medical history updated successfully')
  })
)

/**
 * @route   POST /api/user/health-profile/dental-history
 * @desc    Add dental history entry
 * @access  Private
 */
router.post('/dental-history',
  authenticate,
  [
    body('type')
      .isIn(['problem', 'treatment'])
      .withMessage('Invalid dental history type'),
    
    body('details')
      .isObject()
      .withMessage('Details must be an object')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const { type, details } = req.body
    let healthProfile = await HealthProfile.findOne({ userId: req.user._id })
    
    if (!healthProfile) {
      healthProfile = new HealthProfile({ userId: req.user._id })
    }

    switch (type) {
      case 'problem':
        healthProfile.dentalHistory.dentalProblems.push({
          ...details,
          dateReported: new Date()
        })
        break
      case 'treatment':
        healthProfile.dentalHistory.previousTreatments.push(details)
        break
    }

    await healthProfile.save()

    successResponse(res, healthProfile, 'Dental history updated successfully')
  })
)

/**
 * @route   DELETE /api/user/health-profile/medical-history/:type/:index
 * @desc    Remove medical history entry
 * @access  Private
 */
router.delete('/medical-history/:type/:index',
  authenticate,
  asyncHandler(async (req, res) => {
    const { type, index } = req.params
    const healthProfile = await HealthProfile.findOne({ userId: req.user._id })
    
    if (!healthProfile) {
      return errorResponse(res, 'Health profile not found', 404)
    }

    const arrayIndex = parseInt(index)
    
    switch (type) {
      case 'allergies':
        if (arrayIndex >= 0 && arrayIndex < healthProfile.medicalHistory.allergies.length) {
          healthProfile.medicalHistory.allergies.splice(arrayIndex, 1)
        }
        break
      case 'medications':
        if (arrayIndex >= 0 && arrayIndex < healthProfile.medicalHistory.medications.length) {
          healthProfile.medicalHistory.medications.splice(arrayIndex, 1)
        }
        break
      case 'conditions':
        if (arrayIndex >= 0 && arrayIndex < healthProfile.medicalHistory.chronicConditions.length) {
          healthProfile.medicalHistory.chronicConditions.splice(arrayIndex, 1)
        }
        break
      case 'surgeries':
        if (arrayIndex >= 0 && arrayIndex < healthProfile.medicalHistory.surgeries.length) {
          healthProfile.medicalHistory.surgeries.splice(arrayIndex, 1)
        }
        break
      default:
        return errorResponse(res, 'Invalid medical history type', 400)
    }

    await healthProfile.save()

    successResponse(res, healthProfile, 'Medical history entry removed successfully')
  })
)

/**
 * @route   GET /api/user/health-profile/completeness
 * @desc    Get health profile completeness score
 * @access  Private
 */
router.get('/completeness',
  authenticate,
  asyncHandler(async (req, res) => {
    const healthProfile = await HealthProfile.findOne({ userId: req.user._id })
    
    if (!healthProfile) {
      return successResponse(res, { completeness: 0, suggestions: [] }, 'Health profile completeness retrieved')
    }

    const completeness = healthProfile.completeness
    const suggestions = []

    // Generate suggestions based on missing information
    if (!healthProfile.medicalHistory.bloodType) {
      suggestions.push('Add your blood type for emergency situations')
    }
    
    if (!healthProfile.medicalHistory.allergies.length) {
      suggestions.push('Add any known allergies to improve your profile')
    }
    
    if (!healthProfile.dentalHistory.lastDentalVisit) {
      suggestions.push('Add your last dental visit date')
    }
    
    if (!healthProfile.emergencyContact.name || !healthProfile.emergencyContact.phone) {
      suggestions.push('Add emergency contact information')
    }
    
    if (!healthProfile.dentalHistory.oralHygiene.brushingFrequency) {
      suggestions.push('Add your oral hygiene routine information')
    }
    
    if (!healthProfile.dentalHistory.oralHygiene.flossingFrequency) {
      suggestions.push('Add your flossing frequency information')
    }

    successResponse(res, {
      completeness,
      suggestions,
      totalFields: 12,
      completedFields: Math.round((completeness / 100) * 12)
    }, 'Health profile completeness retrieved')
  })
)

module.exports = router