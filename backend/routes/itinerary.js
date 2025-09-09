const express = require('express')
const router = express.Router()

const Itinerary = require('../models/Itinerary')
const Booking = require('../models/Booking')
const { authenticate } = require('../middleware/auth')
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware')
const { body, validationResult } = require('express-validator')

/**
 * @route   GET /api/itinerary
 * @desc    Get user's itineraries
 * @access  Private
 */
router.get('/',
  authenticate,
  asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const query = { userId: req.user._id }
    if (status) query.status = status

    const itineraries = await Itinerary.find(query)
      .populate('treatments.bookingId', 'treatmentType appointmentDate appointmentTime status')
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Itinerary.countDocuments(query)

    successResponse(res, {
      itineraries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Itineraries retrieved successfully')
  })
)

/**
 * @route   GET /api/itinerary/current
 * @desc    Get current active itinerary
 * @access  Private
 */
router.get('/current',
  authenticate,
  asyncHandler(async (req, res) => {
    const currentItineraries = await Itinerary.getCurrent(req.user._id)

    successResponse(res, {
      itineraries: currentItineraries,
      count: currentItineraries.length
    }, 'Current itineraries retrieved successfully')
  })
)

/**
 * @route   GET /api/itinerary/upcoming
 * @desc    Get upcoming itineraries
 * @access  Private
 */
router.get('/upcoming',
  authenticate,
  asyncHandler(async (req, res) => {
    const upcomingItineraries = await Itinerary.getUpcoming(req.user._id)

    successResponse(res, {
      itineraries: upcomingItineraries,
      count: upcomingItineraries.length
    }, 'Upcoming itineraries retrieved successfully')
  })
)

/**
 * @route   GET /api/itinerary/:id
 * @desc    Get specific itinerary
 * @access  Private
 */
router.get('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('treatments.bookingId')

    if (!itinerary) {
      return errorResponse(res, 'Itinerary not found', 404)
    }

    successResponse(res, itinerary, 'Itinerary retrieved successfully')
  })
)

/**
 * @route   GET /api/itinerary/calendar
 * @desc    Get calendar view of appointments
 * @access  Private
 */
router.get('/calendar',
  authenticate,
  asyncHandler(async (req, res) => {
    const { month, year } = req.query
    
    let startDate, endDate
    
    if (month && year) {
      startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      endDate = new Date(parseInt(year), parseInt(month), 0)
    } else {
      // Default to current month
      const now = new Date()
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    }

    const itineraries = await Itinerary.find({
      userId: req.user._id,
      $or: [
        {
          startDate: { $gte: startDate, $lte: endDate }
        },
        {
          endDate: { $gte: startDate, $lte: endDate }
        },
        {
          startDate: { $lte: startDate },
          endDate: { $gte: endDate }
        }
      ]
    }).populate('treatments.bookingId', 'treatmentType appointmentDate appointmentTime status')

    // Format for calendar view
    const calendarEvents = []

    itineraries.forEach(itinerary => {
      // Add trip start/end events
      calendarEvents.push({
        id: `trip-start-${itinerary._id}`,
        title: `Trip Start: ${itinerary.title}`,
        date: itinerary.startDate,
        type: 'trip-start',
        itineraryId: itinerary._id,
        destination: itinerary.destination
      })

      calendarEvents.push({
        id: `trip-end-${itinerary._id}`,
        title: `Trip End: ${itinerary.title}`,
        date: itinerary.endDate,
        type: 'trip-end',
        itineraryId: itinerary._id,
        destination: itinerary.destination
      })

      // Add treatment appointments
      itinerary.treatments.forEach(treatment => {
        if (treatment.appointmentDate) {
          calendarEvents.push({
            id: `treatment-${treatment._id}`,
            title: `${treatment.treatmentType} - ${treatment.clinicName}`,
            date: treatment.appointmentDate,
            time: treatment.appointmentTime,
            type: 'treatment',
            status: treatment.status,
            itineraryId: itinerary._id,
            bookingId: treatment.bookingId
          })
        }
      })

      // Add activities
      itinerary.activities.forEach(activity => {
        if (activity.date) {
          calendarEvents.push({
            id: `activity-${activity._id}`,
            title: activity.title,
            date: activity.date,
            time: activity.time,
            type: 'activity',
            category: activity.category,
            itineraryId: itinerary._id
          })
        }
      })
    })

    // Sort events by date
    calendarEvents.sort((a, b) => new Date(a.date) - new Date(b.date))

    successResponse(res, {
      events: calendarEvents,
      month: startDate.getMonth() + 1,
      year: startDate.getFullYear()
    }, 'Calendar events retrieved successfully')
  })
)

/**
 * @route   POST /api/itinerary
 * @desc    Create new itinerary
 * @access  Private
 */
router.post('/',
  authenticate,
  [
    body('title')
      .notEmpty()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title is required and must be between 1 and 200 characters'),
    
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    
    body('startDate')
      .isISO8601()
      .withMessage('Valid start date is required')
      .custom((value) => {
        const startDate = new Date(value)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (startDate < today) {
          throw new Error('Start date cannot be in the past')
        }
        return true
      }),
    
    body('endDate')
      .isISO8601()
      .withMessage('Valid end date is required')
      .custom((value, { req }) => {
        const endDate = new Date(value)
        const startDate = new Date(req.body.startDate)
        
        if (endDate <= startDate) {
          throw new Error('End date must be after start date')
        }
        return true
      }),
    
    body('destination.city')
      .notEmpty()
      .withMessage('Destination city is required'),
    
    body('destination.state')
      .notEmpty()
      .withMessage('Destination state is required'),
    
    body('destination.country')
      .optional()
      .default('India')
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

    const itinerary = new Itinerary({
      userId: req.user._id,
      ...req.body
    })

    await itinerary.save()

    successResponse(res, itinerary, 'Itinerary created successfully')
  })
)

/**
 * @route   PUT /api/itinerary/:id
 * @desc    Update itinerary
 * @access  Private
 */
router.put('/:id',
  authenticate,
  [
    body('title')
      .optional()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Valid start date is required'),
    
    body('endDate')
      .optional()
      .isISO8601()
      .withMessage('Valid end date is required'),
    
    body('notes')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('Notes cannot exceed 2000 characters')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!itinerary) {
      return errorResponse(res, 'Itinerary not found', 404)
    }

    // Check if itinerary can be updated
    if (itinerary.status === 'completed') {
      return errorResponse(res, 'Completed itinerary cannot be updated', 400)
    }

    const allowedUpdates = [
      'title', 'description', 'startDate', 'endDate', 'destination',
      'accommodation', 'transportation', 'activities', 'budget',
      'emergencyContacts', 'documents', 'notes'
    ]

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        itinerary[field] = req.body[field]
      }
    })

    await itinerary.save()

    successResponse(res, itinerary, 'Itinerary updated successfully')
  })
)

/**
 * @route   POST /api/itinerary/:id/treatments
 * @desc    Add treatment to itinerary
 * @access  Private
 */
router.post('/:id/treatments',
  authenticate,
  [
    body('bookingId')
      .isMongoId()
      .withMessage('Valid booking ID is required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!itinerary) {
      return errorResponse(res, 'Itinerary not found', 404)
    }

    const { bookingId } = req.body

    // Verify booking belongs to user
    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.user._id
    }).populate('dentistId', 'firstName lastName')

    if (!booking) {
      return errorResponse(res, 'Booking not found', 404)
    }

    // Check if booking is already in itinerary
    const existingTreatment = itinerary.treatments.find(
      t => t.bookingId.toString() === bookingId
    )

    if (existingTreatment) {
      return errorResponse(res, 'Treatment already added to itinerary', 400)
    }

    const treatmentData = {
      bookingId,
      treatmentType: booking.treatmentType,
      dentistName: booking.dentistId ? 
        `${booking.dentistId.firstName} ${booking.dentistId.lastName}` : 
        'Unknown',
      clinicName: booking.clinic.name,
      appointmentDate: booking.appointmentDate,
      appointmentTime: booking.appointmentTime,
      duration: booking.duration,
      status: 'scheduled'
    }

    await itinerary.addTreatment(bookingId, treatmentData)

    successResponse(res, itinerary, 'Treatment added to itinerary successfully')
  })
)

/**
 * @route   POST /api/itinerary/:id/activities
 * @desc    Add activity to itinerary
 * @access  Private
 */
router.post('/:id/activities',
  authenticate,
  [
    body('title')
      .notEmpty()
      .withMessage('Activity title is required'),
    
    body('date')
      .isISO8601()
      .withMessage('Valid activity date is required'),
    
    body('category')
      .optional()
      .isIn(['sightseeing', 'cultural', 'adventure', 'relaxation', 'shopping', 'dining', 'other'])
      .withMessage('Invalid activity category')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!itinerary) {
      return errorResponse(res, 'Itinerary not found', 404)
    }

    itinerary.activities.push(req.body)
    await itinerary.save()

    successResponse(res, itinerary, 'Activity added to itinerary successfully')
  })
)

/**
 * @route   PUT /api/itinerary/:id/budget
 * @desc    Update itinerary budget
 * @access  Private
 */
router.put('/:id/budget',
  authenticate,
  [
    body('total.amount')
      .optional()
      .isNumeric()
      .withMessage('Total budget amount must be a number'),
    
    body('breakdown')
      .optional()
      .isObject()
      .withMessage('Budget breakdown must be an object')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!itinerary) {
      return errorResponse(res, 'Itinerary not found', 404)
    }

    if (req.body.total) {
      itinerary.budget.total = req.body.total
    }

    if (req.body.breakdown) {
      itinerary.budget.breakdown = {
        ...itinerary.budget.breakdown,
        ...req.body.breakdown
      }
    }

    await itinerary.save()

    successResponse(res, itinerary.budget, 'Budget updated successfully')
  })
)

/**
 * @route   POST /api/itinerary/:id/share
 * @desc    Share itinerary with others
 * @access  Private
 */
router.post('/:id/share',
  authenticate,
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required'),
    
    body('name')
      .notEmpty()
      .withMessage('Name is required'),
    
    body('permissions')
      .optional()
      .isIn(['view', 'edit'])
      .withMessage('Invalid permissions')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!itinerary) {
      return errorResponse(res, 'Itinerary not found', 404)
    }

    const { email, name, permissions = 'view' } = req.body

    // Check if already shared with this email
    const existingShare = itinerary.sharedWith.find(share => share.email === email)
    
    if (existingShare) {
      existingShare.permissions = permissions
      existingShare.sharedAt = new Date()
    } else {
      itinerary.sharedWith.push({
        email,
        name,
        permissions,
        sharedAt: new Date()
      })
    }

    itinerary.isShared = true
    await itinerary.save()

    // TODO: Send email notification

    successResponse(res, {
      message: 'Itinerary shared successfully',
      sharedWith: itinerary.sharedWith
    }, 'Itinerary shared successfully')
  })
)

/**
 * @route   DELETE /api/itinerary/:id
 * @desc    Delete itinerary
 * @access  Private
 */
router.delete('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!itinerary) {
      return errorResponse(res, 'Itinerary not found', 404)
    }

    // Check if itinerary can be deleted
    if (itinerary.status === 'in-progress') {
      return errorResponse(res, 'Cannot delete itinerary that is in progress', 400)
    }

    await itinerary.deleteOne()

    successResponse(res, { message: 'Itinerary deleted successfully' }, 'Itinerary deleted successfully')
  })
)

module.exports = router