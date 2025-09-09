const express = require('express')
const router = express.Router()

const Booking = require('../models/Booking')
const Dentist = require('../models/Dentist')
const { authenticate } = require('../middleware/auth')
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware')
const { body, validationResult } = require('express-validator')

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings for user
 * @access  Private
 */
router.get('/',
  authenticate,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 50, status } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    let query = { userId: req.user._id }
    
    if (status && status !== 'all') {
      query.status = status
    }

    const bookings = await Booking.find(query)
      .populate('dentistId', 'firstName lastName specializations rating')
      .sort({ appointmentDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Booking.countDocuments(query)

    successResponse(res, {
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Bookings retrieved successfully')
  })
)

/**
 * @route   GET /api/bookings/upcoming
 * @desc    Get upcoming bookings
 * @access  Private
 */
router.get('/upcoming',
  authenticate,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const bookings = await Booking.getUpcoming(req.user._id)
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Booking.countDocuments({
      userId: req.user._id,
      appointmentDate: { $gte: new Date() },
      status: { $in: ['confirmed', 'scheduled'] }
    })

    successResponse(res, {
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Upcoming bookings retrieved successfully')
  })
)

/**
 * @route   GET /api/bookings/history
 * @desc    Get booking history
 * @access  Private
 */
router.get('/history',
  authenticate,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    let query = {
      userId: req.user._id,
      status: { $in: ['completed', 'cancelled', 'no-show'] }
    }

    if (status) {
      query.status = status
    }

    const bookings = await Booking.find(query)
      .populate('dentistId', 'firstName lastName specializations rating')
      .sort({ appointmentDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Booking.countDocuments(query)

    successResponse(res, {
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Booking history retrieved successfully')
  })
)

/**
 * @route   GET /api/bookings/:id
 * @desc    Get specific booking details
 * @access  Private
 */
router.get('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('dentistId', 'firstName lastName specializations rating clinics')

    if (!booking) {
      return errorResponse(res, 'Booking not found', 404)
    }

    successResponse(res, booking, 'Booking details retrieved successfully')
  })
)

/**
 * @route   GET /api/bookings/:id/status
 * @desc    Get booking status tracker
 * @access  Private
 */
router.get('/:id/status',
  authenticate,
  asyncHandler(async (req, res) => {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).select('status statusHistory appointmentDate appointmentTime treatmentType clinic')

    if (!booking) {
      return errorResponse(res, 'Booking not found', 404)
    }

    const statusTracker = {
      currentStatus: booking.status,
      appointmentDate: booking.appointmentDate,
      appointmentTime: booking.appointmentTime,
      treatmentType: booking.treatmentType,
      clinic: booking.clinic,
      timeline: booking.statusHistory.map(history => ({
        status: history.status,
        date: history.changedAt,
        reason: history.reason
      })),
      canCancel: booking.canCancel,
      isUpcoming: booking.isUpcoming
    }

    successResponse(res, statusTracker, 'Booking status retrieved successfully')
  })
)

/**
 * @route   POST /api/bookings
 * @desc    Create new booking
 * @access  Private
 */
router.post('/',
  authenticate,
  [
    body('dentistId')
      .isMongoId()
      .withMessage('Valid dentist ID is required'),
    
    body('treatmentType')
      .isIn([
        'consultation', 'cleaning', 'filling', 'root-canal',
        'crown', 'bridge', 'implant', 'extraction',
        'orthodontics', 'whitening', 'veneer', 'denture',
        'gum-treatment', 'oral-surgery', 'emergency', 'other'
      ])
      .withMessage('Invalid treatment type'),
    
    body('appointmentDate')
      .isISO8601()
      .withMessage('Valid appointment date is required')
      .custom((value) => {
        const appointmentDate = new Date(value)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (appointmentDate < today) {
          throw new Error('Appointment date cannot be in the past')
        }
        return true
      }),
    
    body('appointmentTime')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Valid appointment time is required (HH:MM format)'),
    
    body('treatmentDescription')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Treatment description cannot exceed 1000 characters'),
    
    body('specialRequirements')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Special requirements cannot exceed 500 characters')
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

    const { dentistId, treatmentType, appointmentDate, appointmentTime, treatmentDescription, specialRequirements } = req.body

    // Verify dentist exists and is available
    const dentist = await Dentist.findById(dentistId)
    if (!dentist) {
      return errorResponse(res, 'Dentist not found', 404)
    }

    if (!dentist.isActive || dentist.verificationStatus !== 'verified') {
      return errorResponse(res, 'Dentist is not available for bookings', 400)
    }

    // Check if dentist is available on the requested date
    const requestedDate = new Date(appointmentDate)
    if (!dentist.isAvailableOn(requestedDate)) {
      return errorResponse(res, 'Dentist is not available on the requested date', 400)
    }

    // Check for conflicting appointments (simplified - in production, implement proper slot management)
    const existingBooking = await Booking.findOne({
      dentistId,
      appointmentDate: requestedDate,
      appointmentTime,
      status: { $in: ['confirmed', 'scheduled'] }
    })

    if (existingBooking) {
      return errorResponse(res, 'Time slot is already booked', 409)
    }

    // Get primary clinic info
    const primaryClinic = dentist.primaryClinic
    if (!primaryClinic) {
      return errorResponse(res, 'Dentist clinic information not available', 400)
    }

    // Create booking
    const booking = new Booking({
      userId: req.user._id,
      dentistId,
      treatmentType,
      treatmentDescription,
      appointmentDate: requestedDate,
      appointmentTime,
      specialRequirements,
      estimatedCost: {
        amount: dentist.consultationFee.amount, // Default to consultation fee
        currency: dentist.consultationFee.currency
      },
      clinic: {
        name: primaryClinic.name,
        address: primaryClinic.address,
        contact: primaryClinic.contact
      },
      status: 'pending'
    })

    await booking.save()

    // Populate dentist info for response
    await booking.populate('dentistId', 'firstName lastName specializations rating')

    successResponse(res, booking, 'Booking created successfully')
  })
)

/**
 * @route   PUT /api/bookings/:id/modify
 * @desc    Modify booking
 * @access  Private
 */
router.put('/:id/modify',
  authenticate,
  [
    body('appointmentDate')
      .optional()
      .isISO8601()
      .withMessage('Valid appointment date is required')
      .custom((value) => {
        const appointmentDate = new Date(value)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (appointmentDate < today) {
          throw new Error('Appointment date cannot be in the past')
        }
        return true
      }),
    
    body('appointmentTime')
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Valid appointment time is required (HH:MM format)'),
    
    body('treatmentDescription')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Treatment description cannot exceed 1000 characters'),
    
    body('specialRequirements')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Special requirements cannot exceed 500 characters')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!booking) {
      return errorResponse(res, 'Booking not found', 404)
    }

    // Check if booking can be modified
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return errorResponse(res, 'Booking cannot be modified in current status', 400)
    }

    // Check if modification is allowed (e.g., at least 24 hours before appointment)
    const hoursUntilAppointment = (booking.appointmentDateTime - new Date()) / (1000 * 60 * 60)
    if (hoursUntilAppointment < 24) {
      return errorResponse(res, 'Booking cannot be modified less than 24 hours before appointment', 400)
    }

    const { appointmentDate, appointmentTime, treatmentDescription, specialRequirements } = req.body

    // If date/time is being changed, check availability
    if (appointmentDate || appointmentTime) {
      const newDate = appointmentDate ? new Date(appointmentDate) : booking.appointmentDate
      const newTime = appointmentTime || booking.appointmentTime

      // Check for conflicts
      const conflictingBooking = await Booking.findOne({
        _id: { $ne: booking._id },
        dentistId: booking.dentistId,
        appointmentDate: newDate,
        appointmentTime: newTime,
        status: { $in: ['confirmed', 'scheduled'] }
      })

      if (conflictingBooking) {
        return errorResponse(res, 'New time slot is already booked', 409)
      }

      booking.appointmentDate = newDate
      booking.appointmentTime = newTime
      booking.status = 'rescheduled'
    }

    if (treatmentDescription !== undefined) {
      booking.treatmentDescription = treatmentDescription
    }

    if (specialRequirements !== undefined) {
      booking.specialRequirements = specialRequirements
    }

    await booking.save()
    await booking.populate('dentistId', 'firstName lastName specializations rating')

    successResponse(res, booking, 'Booking modified successfully')
  })
)

/**
 * @route   DELETE /api/bookings/:id/cancel
 * @desc    Cancel booking
 * @access  Private
 */
router.delete('/:id/cancel',
  authenticate,
  [
    body('reason')
      .notEmpty()
      .withMessage('Cancellation reason is required')
      .isLength({ max: 500 })
      .withMessage('Cancellation reason cannot exceed 500 characters')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!booking) {
      return errorResponse(res, 'Booking not found', 404)
    }

    // Check if booking can be cancelled
    if (!booking.canCancel) {
      return errorResponse(res, 'Booking cannot be cancelled', 400)
    }

    const { reason } = req.body

    booking.status = 'cancelled'
    booking.cancellationReason = reason
    booking.cancellationDate = new Date()

    // Calculate cancellation fee if applicable
    const hoursUntilAppointment = (booking.appointmentDateTime - new Date()) / (1000 * 60 * 60)
    if (hoursUntilAppointment < 24) {
      booking.cancellationFee = {
        amount: booking.estimatedCost.amount * 0.2, // 20% cancellation fee
        currency: booking.estimatedCost.currency
      }
    }

    await booking.save()

    successResponse(res, {
      message: 'Booking cancelled successfully',
      cancellationFee: booking.cancellationFee,
      refundAmount: booking.cancellationFee 
        ? booking.estimatedCost.amount - booking.cancellationFee.amount 
        : booking.estimatedCost.amount
    }, 'Booking cancelled successfully')
  })
)

/**
 * @route   POST /api/bookings/:id/review
 * @desc    Add review for completed booking
 * @access  Private
 */
router.post('/:id/review',
  authenticate,
  [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    
    body('review')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Review cannot exceed 1000 characters')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id,
      status: 'completed'
    })

    if (!booking) {
      return errorResponse(res, 'Completed booking not found', 404)
    }

    if (booking.rating) {
      return errorResponse(res, 'Review already submitted for this booking', 400)
    }

    const { rating, review } = req.body

    booking.rating = rating
    booking.review = review
    booking.reviewDate = new Date()

    await booking.save()

    // Update dentist rating
    const dentist = await Dentist.findById(booking.dentistId)
    if (dentist) {
      await dentist.updateRating(rating)
    }

    successResponse(res, {
      message: 'Review submitted successfully',
      rating: booking.rating,
      review: booking.review
    }, 'Review submitted successfully')
  })
)

/**
 * @route   GET /api/bookings/stats
 * @desc    Get booking statistics
 * @access  Private
 */
router.get('/stats',
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user._id

    const stats = await Booking.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          upcomingBookings: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ['$appointmentDate', new Date()] },
                    { $in: ['$status', ['confirmed', 'scheduled']] }
                  ]
                },
                1,
                0
              ]
            }
          },
          totalSpent: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'completed'] },
                '$finalCost.amount',
                0
              ]
            }
          },
          averageRating: {
            $avg: {
              $cond: [{ $ne: ['$rating', null] }, '$rating', null]
            }
          }
        }
      }
    ])

    const result = stats[0] || {
      totalBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      upcomingBookings: 0,
      totalSpent: 0,
      averageRating: null
    }

    // Get most visited treatment types
    const treatmentStats = await Booking.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$treatmentType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])

    successResponse(res, {
      ...result,
      treatmentStats
    }, 'Booking statistics retrieved successfully')
  })
)

module.exports = router