const express = require('express')
const router = express.Router()

const Dentist = require('../models/Dentist')
const Review = require('../models/Review')
const Booking = require('../models/Booking')
const { authenticate } = require('../middleware/auth')
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware')
const { body, validationResult } = require('express-validator')

/**
 * @route   GET /api/dentists
 * @desc    Search and list dentists
 * @access  Public
 */
router.get('/',
  asyncHandler(async (req, res) => {
    const {
      search,
      city,
      state,
      country,
      specialization,
      minRating,
      maxPrice,
      availability,
      page = 1,
      limit = 10,
      sort = 'rating'
    } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)

    // Build search query
    let query = { isActive: true, verificationStatus: 'verified' }

    // Text search
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { specializations: { $in: [new RegExp(search, 'i')] } },
        { 'clinics.name': { $regex: search, $options: 'i' } }
      ]
    }

    // Location filters
    if (city) query['clinics.address.city'] = new RegExp(city, 'i')
    if (state) query['clinics.address.state'] = new RegExp(state, 'i')
    if (country) query['clinics.address.country'] = new RegExp(country, 'i')

    // Specialization filter
    if (specialization) {
      query.specializations = { $in: [specialization] }
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) }
    }

    // Price filter
    if (maxPrice) {
      query.consultationFee = { $lte: parseInt(maxPrice) }
    }

    // Sort options
    let sortOptions = {}
    switch (sort) {
      case 'rating':
        sortOptions = { rating: -1, reviewCount: -1 }
        break
      case 'price-low':
        sortOptions = { consultationFee: 1 }
        break
      case 'price-high':
        sortOptions = { consultationFee: -1 }
        break
      case 'experience':
        sortOptions = { experience: -1 }
        break
      case 'name':
        sortOptions = { firstName: 1, lastName: 1 }
        break
      default:
        sortOptions = { rating: -1 }
    }

    const dentists = await Dentist.find(query)
      .populate('clinics')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password -refreshTokens')

    const total = await Dentist.countDocuments(query)

    // Add availability info if requested
    const enhancedDentists = await Promise.all(
      dentists.map(async (dentist) => {
        const dentistObj = dentist.toObject()
        
        if (availability === 'true') {
          dentistObj.availableSlots = dentist.getAvailableSlots(new Date(), 7)
        }
        
        return dentistObj
      })
    )

    successResponse(res, {
      dentists: enhancedDentists,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      filters: {
        search,
        city,
        state,
        country,
        specialization,
        minRating,
        maxPrice,
        sort
      }
    }, 'Dentists retrieved successfully')
  })
)

/**
 * @route   GET /api/dentists/featured
 * @desc    Get featured dentists
 * @access  Public
 */
router.get('/featured',
  asyncHandler(async (req, res) => {
    const { limit = 6 } = req.query

    const featuredDentists = await Dentist.find({
      isActive: true,
      verificationStatus: 'verified',
      isFeatured: true
    })
    .populate('clinics')
    .sort({ rating: -1, reviewCount: -1 })
    .limit(parseInt(limit))
    .select('-password -refreshTokens')

    successResponse(res, featuredDentists, 'Featured dentists retrieved successfully')
  })
)

/**
 * @route   GET /api/dentists/nearby
 * @desc    Find nearby dentists
 * @access  Public
 */
router.get('/nearby',
  asyncHandler(async (req, res) => {
    const { lat, lng, radius = 10, limit = 10 } = req.query

    if (!lat || !lng) {
      return errorResponse(res, 'Latitude and longitude are required', 400)
    }

    // Convert radius from km to meters
    const radiusInMeters = parseInt(radius) * 1000

    const nearbyDentists = await Dentist.find({
      isActive: true,
      verificationStatus: 'verified',
      'clinics.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radiusInMeters
        }
      }
    })
    .populate('clinics')
    .limit(parseInt(limit))
    .select('-password -refreshTokens')

    successResponse(res, nearbyDentists, 'Nearby dentists retrieved successfully')
  })
)

/**
 * @route   GET /api/dentists/:id
 * @desc    Get specific dentist details
 * @access  Public
 */
router.get('/:id',
  asyncHandler(async (req, res) => {
    const dentist = await Dentist.findById(req.params.id)
      .populate('clinics')
      .select('-password -refreshTokens')

    if (!dentist) {
      return errorResponse(res, 'Dentist not found', 404)
    }

    if (!dentist.isActive) {
      return errorResponse(res, 'Dentist profile is not active', 404)
    }

    // Get recent reviews
    const recentReviews = await Review.find({ 
      dentistId: dentist._id,
      isDeleted: false 
    })
    .populate('userId', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(5)

    // Get availability for next 7 days
    const availableSlots = dentist.getAvailableSlots(new Date(), 7)

    const dentistData = {
      ...dentist.toObject(),
      recentReviews,
      availableSlots,
      stats: {
        totalBookings: await Booking.countDocuments({ dentistId: dentist._id }),
        completedTreatments: await Booking.countDocuments({ 
          dentistId: dentist._id, 
          status: 'completed' 
        })
      }
    }

    successResponse(res, dentistData, 'Dentist details retrieved successfully')
  })
)

/**
 * @route   GET /api/dentists/:id/reviews
 * @desc    Get dentist reviews
 * @access  Public
 */
router.get('/:id/reviews',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, rating } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    let query = { 
      dentistId: req.params.id,
      isDeleted: false 
    }

    if (rating) {
      query.rating = parseInt(rating)
    }

    const reviews = await Review.find(query)
      .populate('userId', 'firstName lastName')
      .populate('bookingId', 'treatmentType appointmentDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Review.countDocuments(query)

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { dentistId: req.params.id, isDeleted: false } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ])

    successResponse(res, {
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      ratingDistribution
    }, 'Reviews retrieved successfully')
  })
)

/**
 * @route   POST /api/dentists/:id/reviews
 * @desc    Add review for dentist
 * @access  Private
 */
router.post('/:id/reviews',
  authenticate,
  [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    
    body('comment')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Comment cannot exceed 1000 characters'),
    
    body('bookingId')
      .isMongoId()
      .withMessage('Valid booking ID is required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const { rating, comment, bookingId } = req.body
    const dentistId = req.params.id

    // Verify dentist exists
    const dentist = await Dentist.findById(dentistId)
    if (!dentist) {
      return errorResponse(res, 'Dentist not found', 404)
    }

    // Verify booking exists and belongs to user
    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.user._id,
      dentistId,
      status: 'completed'
    })

    if (!booking) {
      return errorResponse(res, 'Valid completed booking required to leave review', 400)
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      userId: req.user._id,
      dentistId,
      bookingId
    })

    if (existingReview) {
      return errorResponse(res, 'Review already exists for this booking', 409)
    }

    // Create review
    const review = new Review({
      userId: req.user._id,
      dentistId,
      bookingId,
      rating,
      comment,
      treatmentType: booking.treatmentType
    })

    await review.save()

    // Update dentist rating
    await dentist.updateRating()

    await review.populate('userId', 'firstName lastName')

    successResponse(res, review, 'Review added successfully')
  })
)

/**
 * @route   GET /api/dentists/:id/availability
 * @desc    Check dentist availability
 * @access  Public
 */
router.get('/:id/availability',
  asyncHandler(async (req, res) => {
    const { date, days = 7 } = req.query
    
    const dentist = await Dentist.findById(req.params.id)
    if (!dentist) {
      return errorResponse(res, 'Dentist not found', 404)
    }

    const startDate = date ? new Date(date) : new Date()
    const availableSlots = dentist.getAvailableSlots(startDate, parseInt(days))

    successResponse(res, {
      dentistId: dentist._id,
      dentistName: `${dentist.firstName} ${dentist.lastName}`,
      availableSlots,
      workingHours: dentist.workingHours,
      timeZone: dentist.timeZone
    }, 'Availability retrieved successfully')
  })
)

/**
 * @route   GET /api/dentists/:id/treatments
 * @desc    Get dentist's treatment offerings
 * @access  Public
 */
router.get('/:id/treatments',
  asyncHandler(async (req, res) => {
    const dentist = await Dentist.findById(req.params.id)
      .select('treatments specializations consultationFee')

    if (!dentist) {
      return errorResponse(res, 'Dentist not found', 404)
    }

    successResponse(res, {
      treatments: dentist.treatments,
      specializations: dentist.specializations,
      consultationFee: dentist.consultationFee
    }, 'Treatment offerings retrieved successfully')
  })
)

/**
 * @route   POST /api/dentists/:id/chat
 * @desc    Start chat/virtual consultation
 * @access  Private
 */
router.post('/:id/chat',
  authenticate,
  [
    body('message')
      .notEmpty()
      .isLength({ max: 1000 })
      .withMessage('Message is required and cannot exceed 1000 characters'),
    
    body('consultationType')
      .optional()
      .isIn(['general', 'pre-booking', 'post-treatment', 'emergency'])
      .withMessage('Invalid consultation type')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const { message, consultationType = 'general' } = req.body
    const dentistId = req.params.id

    // Verify dentist exists and is available for chat
    const dentist = await Dentist.findById(dentistId)
    if (!dentist || !dentist.isActive) {
      return errorResponse(res, 'Dentist not available for consultation', 404)
    }

    // In production, this would:
    // 1. Create a chat session
    // 2. Send notification to dentist
    // 3. Set up real-time communication
    // 4. Handle consultation fees if applicable

    const chatSession = {
      id: 'chat_' + Date.now(),
      userId: req.user._id,
      dentistId,
      consultationType,
      status: 'initiated',
      messages: [
        {
          id: 'msg_' + Date.now(),
          senderId: req.user._id,
          senderType: 'user',
          message,
          timestamp: new Date()
        }
      ],
      createdAt: new Date()
    }

    successResponse(res, {
      chatSession,
      dentistInfo: {
        name: `${dentist.firstName} ${dentist.lastName}`,
        specializations: dentist.specializations,
        isOnline: dentist.isOnline || false,
        responseTime: dentist.averageResponseTime || '2-4 hours'
      },
      message: 'Chat session initiated successfully'
    }, 'Chat session started successfully')
  })
)

/**
 * @route   GET /api/dentists/search/advanced
 * @desc    Advanced dentist search with filters
 * @access  Public
 */
router.get('/search/advanced',
  asyncHandler(async (req, res) => {
    const {
      treatments,
      languages,
      insurance,
      priceRange,
      experience,
      gender,
      certifications,
      page = 1,
      limit = 10
    } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)
    let query = { isActive: true, verificationStatus: 'verified' }

    // Treatment filter
    if (treatments) {
      const treatmentArray = treatments.split(',')
      query['treatments.type'] = { $in: treatmentArray }
    }

    // Language filter
    if (languages) {
      const languageArray = languages.split(',')
      query.languages = { $in: languageArray }
    }

    // Insurance filter
    if (insurance) {
      const insuranceArray = insurance.split(',')
      query.acceptedInsurance = { $in: insuranceArray }
    }

    // Price range filter
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number)
      query.consultationFee = { $gte: min, $lte: max }
    }

    // Experience filter
    if (experience) {
      query.experience = { $gte: parseInt(experience) }
    }

    // Gender filter
    if (gender) {
      query.gender = gender
    }

    // Certifications filter
    if (certifications) {
      const certArray = certifications.split(',')
      query.certifications = { $in: certArray }
    }

    const dentists = await Dentist.find(query)
      .populate('clinics')
      .sort({ rating: -1, reviewCount: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password -refreshTokens')

    const total = await Dentist.countDocuments(query)

    successResponse(res, {
      dentists,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      appliedFilters: {
        treatments,
        languages,
        insurance,
        priceRange,
        experience,
        gender,
        certifications
      }
    }, 'Advanced search results retrieved successfully')
  })
)

module.exports = router