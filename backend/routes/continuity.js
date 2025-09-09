const express = require('express')
const router = express.Router()

const Dentist = require('../models/Dentist')
const Booking = require('../models/Booking')
const Report = require('../models/Report')
const { authenticate } = require('../middleware/auth')
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware')
const { body, validationResult } = require('express-validator')

/**
 * @route   GET /api/continuity/dentists
 * @desc    Find local dentists for follow-up care
 * @access  Private
 */
router.get('/dentists',
  authenticate,
  asyncHandler(async (req, res) => {
    const { 
      city, state, 
      specialization, 
      treatmentType,
      radius = 10,
      page = 1, 
      limit = 20 
    } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)

    // Build query based on user's location and treatment history
    let query = {
      isActive: true,
      verificationStatus: 'verified'
    }

    // Location-based search
    if (city) {
      query['clinics.address.city'] = new RegExp(city, 'i')
    }
    if (state) {
      query['clinics.address.state'] = new RegExp(state, 'i')
    }

    // Specialization filter
    if (specialization) {
      query.specializations = { $in: [specialization] }
    }

    // Get user's treatment history to suggest relevant dentists
    const userBookings = await Booking.find({ 
      userId: req.user._id,
      status: 'completed'
    }).select('treatmentType dentistId')

    const treatmentTypes = userBookings.map(b => b.treatmentType)
    const previousDentists = userBookings.map(b => b.dentistId)

    // Find dentists who specialize in user's treatment types
    if (treatmentType) {
      // Add logic to match dentists with specific treatment capabilities
      const treatmentSpecializations = {
        'root-canal': ['endodontics', 'general-dentistry'],
        'implant': ['oral-surgery', 'prosthodontics'],
        'orthodontics': ['orthodontics'],
        'crown': ['prosthodontics', 'general-dentistry'],
        'cleaning': ['general-dentistry', 'periodontics'],
        'extraction': ['oral-surgery', 'general-dentistry']
      }

      if (treatmentSpecializations[treatmentType]) {
        query.specializations = { 
          $in: treatmentSpecializations[treatmentType] 
        }
      }
    }

    const dentists = await Dentist.find(query)
      .populate('clinics')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Dentist.countDocuments(query)

    // Enhance results with continuity information
    const enhancedDentists = dentists.map(dentist => {
      const continuityScore = calculateContinuityScore(dentist, treatmentTypes, previousDentists)
      
      return {
        id: dentist._id,
        firstName: dentist.firstName,
        lastName: dentist.lastName,
        specializations: dentist.specializations,
        rating: dentist.rating,
        reviewCount: dentist.reviewCount,
        experience: dentist.experience,
        consultationFee: dentist.consultationFee,
        primaryClinic: dentist.primaryClinic,
        availableSlots: dentist.getAvailableSlots(new Date(), 7), // Next 7 days
        continuityScore,
        matchReasons: getContinuityMatchReasons(dentist, treatmentTypes),
        languages: dentist.languages,
        isFollowUpSpecialist: dentist.specializations.some(spec => 
          ['general-dentistry', 'preventive-dentistry'].includes(spec)
        )
      }
    })

    // Sort by continuity score
    enhancedDentists.sort((a, b) => b.continuityScore - a.continuityScore)

    successResponse(res, {
      dentists: enhancedDentists,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      filters: {
        city,
        state,
        specialization,
        treatmentType
      },
      userTreatmentHistory: treatmentTypes
    }, 'Local dentists for continuity care retrieved successfully')
  })
)

/**
 * @route   GET /api/continuity/records
 * @desc    Access treatment records for continuity
 * @access  Private
 */
router.get('/records',
  authenticate,
  asyncHandler(async (req, res) => {
    const { format = 'summary', includeReports = true } = req.query

    // Get user's treatment history
    const bookings = await Booking.find({ 
      userId: req.user._id,
      status: { $in: ['completed', 'in-progress'] }
    })
    .populate('dentistId', 'firstName lastName specializations')
    .sort({ appointmentDate: -1 })

    // Get user's reports
    let reports = []
    if (includeReports === 'true') {
      reports = await Report.find({
        userId: req.user._id,
        isDeleted: false
      })
      .sort({ reportDate: -1 })
      .select('-files.filePath') // Don't expose file paths
    }

    // Create continuity record
    const continuityRecord = {
      patientInfo: {
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        phone: req.user.phone,
        dateOfBirth: req.user.dateOfBirth,
        medicalHistory: req.user.medicalHistory || []
      },
      treatmentHistory: bookings.map(booking => ({
        id: booking._id,
        treatmentType: booking.treatmentType,
        treatmentDescription: booking.treatmentDescription,
        dentist: booking.dentistId ? {
          name: `${booking.dentistId.firstName} ${booking.dentistId.lastName}`,
          specializations: booking.dentistId.specializations
        } : null,
        clinic: booking.clinic,
        appointmentDate: booking.appointmentDate,
        status: booking.status,
        finalCost: booking.finalCost,
        notes: booking.treatmentNotes,
        followUpRequired: booking.followUpRequired,
        followUpDate: booking.followUpDate
      })),
      diagnosticReports: reports.map(report => ({
        id: report._id,
        title: report.title,
        type: report.type,
        category: report.category,
        reportDate: report.reportDate,
        findings: report.findings,
        diagnosis: report.diagnosis,
        recommendations: report.recommendations,
        fileCount: report.files.length,
        urgencyLevel: report.urgencyLevel
      })),
      currentConditions: extractCurrentConditions(bookings, reports),
      ongoingTreatments: bookings.filter(b => b.status === 'in-progress'),
      followUpNeeded: bookings.filter(b => b.followUpRequired && !b.followUpCompleted),
      allergies: req.user.allergies || [],
      medications: req.user.currentMedications || [],
      lastUpdated: new Date()
    }

    // Format based on request
    if (format === 'detailed') {
      // Include full details
      successResponse(res, continuityRecord, 'Detailed treatment records retrieved successfully')
    } else if (format === 'portable') {
      // Create a portable format for sharing with new dentists
      const portableRecord = {
        patientSummary: continuityRecord.patientInfo,
        recentTreatments: continuityRecord.treatmentHistory.slice(0, 5),
        activeConditions: continuityRecord.currentConditions,
        criticalInfo: {
          allergies: continuityRecord.allergies,
          medications: continuityRecord.medications,
          followUpNeeded: continuityRecord.followUpNeeded.length > 0
        },
        generatedAt: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
      successResponse(res, portableRecord, 'Portable treatment records generated successfully')
    } else {
      // Summary format
      const summary = {
        totalTreatments: continuityRecord.treatmentHistory.length,
        recentTreatments: continuityRecord.treatmentHistory.slice(0, 3),
        activeConditions: continuityRecord.currentConditions,
        followUpNeeded: continuityRecord.followUpNeeded.length,
        lastTreatmentDate: continuityRecord.treatmentHistory[0]?.appointmentDate,
        reportCount: continuityRecord.diagnosticReports.length
      }
      successResponse(res, summary, 'Treatment records summary retrieved successfully')
    }
  })
)

/**
 * @route   POST /api/continuity/follow-up
 * @desc    Book follow-up care appointment
 * @access  Private
 */
router.post('/follow-up',
  authenticate,
  [
    body('originalBookingId')
      .isMongoId()
      .withMessage('Valid original booking ID is required'),
    
    body('dentistId')
      .isMongoId()
      .withMessage('Valid dentist ID is required'),
    
    body('followUpType')
      .isIn(['routine-checkup', 'post-treatment', 'monitoring', 'maintenance', 'emergency'])
      .withMessage('Invalid follow-up type'),
    
    body('appointmentDate')
      .isISO8601()
      .withMessage('Valid appointment date is required'),
    
    body('appointmentTime')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Valid appointment time is required'),
    
    body('notes')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Notes cannot exceed 1000 characters')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const {
      originalBookingId,
      dentistId,
      followUpType,
      appointmentDate,
      appointmentTime,
      notes
    } = req.body

    // Verify original booking exists and belongs to user
    const originalBooking = await Booking.findOne({
      _id: originalBookingId,
      userId: req.user._id
    })

    if (!originalBooking) {
      return errorResponse(res, 'Original booking not found', 404)
    }

    // Verify dentist exists
    const dentist = await Dentist.findById(dentistId)
    if (!dentist || !dentist.isActive) {
      return errorResponse(res, 'Dentist not available', 404)
    }

    // Create follow-up booking
    const followUpBooking = new Booking({
      userId: req.user._id,
      dentistId,
      treatmentType: 'follow-up',
      treatmentDescription: `Follow-up for ${originalBooking.treatmentType}`,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      specialRequirements: notes,
      estimatedCost: dentist.consultationFee,
      clinic: dentist.primaryClinic,
      status: 'pending',
      isFollowUp: true,
      originalBookingId,
      followUpType
    })

    await followUpBooking.save()

    // Update original booking to mark follow-up as scheduled
    originalBooking.followUpScheduled = true
    originalBooking.followUpBookingId = followUpBooking._id
    await originalBooking.save()

    // Populate dentist info for response
    await followUpBooking.populate('dentistId', 'firstName lastName specializations rating')

    successResponse(res, {
      followUpBooking: {
        id: followUpBooking._id,
        treatmentType: followUpBooking.treatmentType,
        appointmentDate: followUpBooking.appointmentDate,
        appointmentTime: followUpBooking.appointmentTime,
        dentist: followUpBooking.dentistId,
        clinic: followUpBooking.clinic,
        status: followUpBooking.status,
        followUpType: followUpBooking.followUpType
      },
      originalTreatment: {
        id: originalBooking._id,
        treatmentType: originalBooking.treatmentType,
        appointmentDate: originalBooking.appointmentDate
      }
    }, 'Follow-up appointment booked successfully')
  })
)

/**
 * @route   POST /api/continuity/share-records
 * @desc    Share treatment records with new dentist
 * @access  Private
 */
router.post('/share-records',
  authenticate,
  [
    body('dentistEmail')
      .isEmail()
      .withMessage('Valid dentist email is required'),
    
    body('dentistName')
      .notEmpty()
      .withMessage('Dentist name is required'),
    
    body('recordIds')
      .optional()
      .isArray()
      .withMessage('Record IDs must be an array'),
    
    body('includeReports')
      .optional()
      .isBoolean()
      .withMessage('Include reports must be boolean'),
    
    body('message')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Message cannot exceed 1000 characters')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const {
      dentistEmail,
      dentistName,
      recordIds,
      includeReports = true,
      message
    } = req.body

    // Generate shareable record package
    const shareableRecord = await generateShareableRecord(
      req.user._id,
      recordIds,
      includeReports
    )

    // Create share token for secure access
    const shareToken = generateShareToken()
    const shareExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // In production, you would:
    // 1. Store the share record in database with token
    // 2. Send email to dentist with secure link
    // 3. Log the sharing activity

    const shareInfo = {
      shareToken,
      sharedWith: {
        email: dentistEmail,
        name: dentistName
      },
      recordSummary: {
        treatmentCount: shareableRecord.treatmentHistory.length,
        reportCount: shareableRecord.diagnosticReports.length,
        dateRange: {
          from: shareableRecord.treatmentHistory[shareableRecord.treatmentHistory.length - 1]?.appointmentDate,
          to: shareableRecord.treatmentHistory[0]?.appointmentDate
        }
      },
      accessLink: `${process.env.FRONTEND_URL}/shared-records/${shareToken}`,
      expiresAt: shareExpiry,
      message
    }

    // TODO: Send email notification to dentist

    successResponse(res, shareInfo, 'Treatment records shared successfully')
  })
)

/**
 * @route   GET /api/continuity/recommendations
 * @desc    Get continuity care recommendations
 * @access  Private
 */
router.get('/recommendations',
  authenticate,
  asyncHandler(async (req, res) => {
    // Analyze user's treatment history and generate recommendations
    const bookings = await Booking.find({ 
      userId: req.user._id,
      status: 'completed'
    }).sort({ appointmentDate: -1 })

    const reports = await Report.find({
      userId: req.user._id,
      isDeleted: false
    }).sort({ reportDate: -1 })

    const recommendations = generateContinuityRecommendations(bookings, reports)

    successResponse(res, recommendations, 'Continuity care recommendations generated successfully')
  })
)

// Helper functions
function calculateContinuityScore(dentist, userTreatmentTypes, previousDentists) {
  let score = 0

  // Base score from rating
  score += dentist.rating * 10

  // Bonus for specialization match
  const matchingSpecs = dentist.specializations.filter(spec => 
    userTreatmentTypes.some(treatment => 
      getSpecializationForTreatment(treatment).includes(spec)
    )
  )
  score += matchingSpecs.length * 15

  // Bonus for general dentistry (good for follow-up)
  if (dentist.specializations.includes('general-dentistry')) {
    score += 20
  }

  // Penalty if previously treated by this dentist (for variety)
  if (previousDentists.includes(dentist._id)) {
    score -= 10
  }

  return Math.min(100, Math.max(0, score))
}

function getContinuityMatchReasons(dentist, treatmentTypes) {
  const reasons = []

  if (dentist.specializations.includes('general-dentistry')) {
    reasons.push('Specializes in general dentistry - ideal for follow-up care')
  }

  if (dentist.rating >= 4.5) {
    reasons.push('Highly rated by patients')
  }

  const matchingSpecs = dentist.specializations.filter(spec => 
    treatmentTypes.some(treatment => 
      getSpecializationForTreatment(treatment).includes(spec)
    )
  )

  if (matchingSpecs.length > 0) {
    reasons.push(`Specializes in ${matchingSpecs.join(', ')}`)
  }

  return reasons
}

function getSpecializationForTreatment(treatmentType) {
  const mapping = {
    'root-canal': ['endodontics', 'general-dentistry'],
    'implant': ['oral-surgery', 'prosthodontics'],
    'orthodontics': ['orthodontics'],
    'crown': ['prosthodontics', 'general-dentistry'],
    'cleaning': ['general-dentistry', 'periodontics'],
    'extraction': ['oral-surgery', 'general-dentistry'],
    'filling': ['general-dentistry'],
    'whitening': ['cosmetic-dentistry', 'general-dentistry']
  }
  
  return mapping[treatmentType] || ['general-dentistry']
}

function extractCurrentConditions(bookings, reports) {
  const conditions = []
  
  // Extract from recent bookings
  bookings.slice(0, 5).forEach(booking => {
    if (booking.diagnosis && booking.diagnosis.length > 0) {
      conditions.push(...booking.diagnosis)
    }
  })

  // Extract from recent reports
  reports.slice(0, 3).forEach(report => {
    if (report.diagnosis && report.diagnosis.length > 0) {
      conditions.push(...report.diagnosis.map(d => d.condition))
    }
  })

  // Remove duplicates and return
  return [...new Set(conditions)]
}

async function generateShareableRecord(userId, recordIds, includeReports) {
  let bookingQuery = { userId, status: { $in: ['completed', 'in-progress'] } }
  if (recordIds && recordIds.length > 0) {
    bookingQuery._id = { $in: recordIds }
  }

  const bookings = await Booking.find(bookingQuery)
    .populate('dentistId', 'firstName lastName specializations')
    .sort({ appointmentDate: -1 })

  let reports = []
  if (includeReports) {
    let reportQuery = { userId, isDeleted: false }
    if (recordIds && recordIds.length > 0) {
      reportQuery._id = { $in: recordIds }
    }
    
    reports = await Report.find(reportQuery)
      .sort({ reportDate: -1 })
      .select('-files.filePath')
  }

  return {
    treatmentHistory: bookings,
    diagnosticReports: reports,
    generatedAt: new Date()
  }
}

function generateShareToken() {
  return 'share_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16)
}

function generateContinuityRecommendations(bookings, reports) {
  const recommendations = []

  // Check for overdue follow-ups
  const overdueFollowUps = bookings.filter(booking => 
    booking.followUpRequired && 
    !booking.followUpCompleted &&
    booking.followUpDate < new Date()
  )

  if (overdueFollowUps.length > 0) {
    recommendations.push({
      type: 'overdue-followup',
      priority: 'high',
      title: 'Overdue Follow-up Appointments',
      description: `You have ${overdueFollowUps.length} overdue follow-up appointments`,
      action: 'Schedule follow-up appointments',
      bookings: overdueFollowUps.map(b => b._id)
    })
  }

  // Check for routine checkup needs
  const lastCheckup = bookings.find(b => b.treatmentType === 'consultation' || b.treatmentType === 'cleaning')
  if (!lastCheckup || (new Date() - lastCheckup.appointmentDate) > (6 * 30 * 24 * 60 * 60 * 1000)) {
    recommendations.push({
      type: 'routine-checkup',
      priority: 'medium',
      title: 'Routine Dental Checkup Due',
      description: 'It\'s been more than 6 months since your last checkup',
      action: 'Schedule routine checkup'
    })
  }

  return recommendations
}

module.exports = router