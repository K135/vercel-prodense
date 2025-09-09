const express = require('express')
const router = express.Router()

const LoyaltyPoints = require('../models/LoyaltyPoints')
const { authenticate } = require('../middleware/auth')
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware')
const { body, validationResult } = require('express-validator')

/**
 * @route   GET /api/loyalty/points
 * @desc    Get user's loyalty points
 * @access  Private
 */
router.get('/points',
  authenticate,
  asyncHandler(async (req, res) => {
    let loyaltyPoints = await LoyaltyPoints.findOne({ userId: req.user._id })
    
    // Create loyalty account if doesn't exist
    if (!loyaltyPoints) {
      loyaltyPoints = new LoyaltyPoints({
        userId: req.user._id,
        totalPoints: 0,
        availablePoints: 0,
        tier: {
          current: 'bronze',
          pointsToNextTier: 1000
        }
      })
      await loyaltyPoints.save()
    }

    // Expire old points
    await loyaltyPoints.expirePoints()

    const response = {
      totalPoints: loyaltyPoints.totalPoints,
      availablePoints: loyaltyPoints.availablePoints,
      pendingPoints: loyaltyPoints.pendingPoints,
      redeemedPoints: loyaltyPoints.redeemedPoints,
      expiredPoints: loyaltyPoints.expiredPoints,
      tier: loyaltyPoints.tier,
      pointsExpiringSoon: loyaltyPoints.pointsExpiringSoon,
      tierProgressPercentage: loyaltyPoints.tierProgressPercentage,
      referrals: {
        referralCode: loyaltyPoints.referrals.referralCode,
        totalReferrals: loyaltyPoints.referrals.totalReferrals,
        successfulReferrals: loyaltyPoints.referrals.successfulReferrals,
        referralPointsEarned: loyaltyPoints.referrals.referralPointsEarned
      },
      stats: loyaltyPoints.stats
    }

    successResponse(res, response, 'Loyalty points retrieved successfully')
  })
)

/**
 * @route   GET /api/loyalty/transactions
 * @desc    Get loyalty points transaction history
 * @access  Private
 */
router.get('/transactions',
  authenticate,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, type } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const loyaltyPoints = await LoyaltyPoints.findOne({ userId: req.user._id })
    
    if (!loyaltyPoints) {
      return successResponse(res, { transactions: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } }, 'No transactions found')
    }

    let transactions = loyaltyPoints.transactions

    // Filter by type if specified
    if (type) {
      transactions = transactions.filter(t => t.type === type)
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Paginate
    const total = transactions.length
    const paginatedTransactions = transactions.slice(skip, skip + parseInt(limit))

    successResponse(res, {
      transactions: paginatedTransactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Transaction history retrieved successfully')
  })
)

/**
 * @route   POST /api/loyalty/redeem
 * @desc    Redeem loyalty points
 * @access  Private
 */
router.post('/redeem',
  authenticate,
  [
    body('type')
      .isIn(['discount', 'cashback', 'gift-card', 'service', 'product', 'donation'])
      .withMessage('Invalid redemption type'),
    
    body('points')
      .isInt({ min: 1 })
      .withMessage('Points must be a positive integer'),
    
    body('description')
      .notEmpty()
      .withMessage('Description is required'),
    
    body('value.amount')
      .optional()
      .isNumeric()
      .withMessage('Value amount must be a number'),
    
    body('appliedTo')
      .optional()
      .isMongoId()
      .withMessage('Applied to must be a valid ID')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const { type, points, description, value, appliedTo } = req.body

    const loyaltyPoints = await LoyaltyPoints.findOne({ userId: req.user._id })
    
    if (!loyaltyPoints) {
      return errorResponse(res, 'Loyalty account not found', 404)
    }

    // Check if user has enough points
    if (loyaltyPoints.availablePoints < points) {
      return errorResponse(res, 'Insufficient points balance', 400)
    }

    // Validate minimum redemption amounts
    const minimumRedemption = {
      discount: 100,
      cashback: 500,
      'gift-card': 1000,
      service: 200,
      product: 300,
      donation: 50
    }

    if (points < minimumRedemption[type]) {
      return errorResponse(res, `Minimum ${minimumRedemption[type]} points required for ${type} redemption`, 400)
    }

    try {
      await loyaltyPoints.redeemPoints(points, type, description, value)

      const redemption = loyaltyPoints.redemptions[loyaltyPoints.redemptions.length - 1]

      successResponse(res, {
        redemptionId: redemption.redemptionId,
        type: redemption.type,
        pointsUsed: redemption.pointsUsed,
        value: redemption.value,
        status: redemption.status,
        availablePoints: loyaltyPoints.availablePoints,
        message: 'Points redeemed successfully'
      }, 'Points redeemed successfully')

    } catch (error) {
      return errorResponse(res, error.message, 400)
    }
  })
)

/**
 * @route   GET /api/loyalty/redemptions
 * @desc    Get redemption history
 * @access  Private
 */
router.get('/redemptions',
  authenticate,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const loyaltyPoints = await LoyaltyPoints.findOne({ userId: req.user._id })
    
    if (!loyaltyPoints) {
      return successResponse(res, { redemptions: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } }, 'No redemptions found')
    }

    let redemptions = loyaltyPoints.redemptions

    // Filter by status if specified
    if (status) {
      redemptions = redemptions.filter(r => r.status === status)
    }

    // Sort by date (newest first)
    redemptions.sort((a, b) => new Date(b.redeemedAt) - new Date(a.redeemedAt))

    // Paginate
    const total = redemptions.length
    const paginatedRedemptions = redemptions.slice(skip, skip + parseInt(limit))

    successResponse(res, {
      redemptions: paginatedRedemptions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Redemption history retrieved successfully')
  })
)

/**
 * @route   GET /api/loyalty/partners
 * @desc    Get loyalty program partners and benefits
 * @access  Private
 */
router.get('/partners',
  authenticate,
  asyncHandler(async (req, res) => {
    // In production, this would come from a database
    const partners = [
      {
        id: 'dental-care-plus',
        name: 'Dental Care Plus',
        category: 'dental-clinic',
        logo: '/images/partners/dental-care-plus.png',
        description: 'Premium dental care with 20% discount for loyalty members',
        benefits: [
          { tier: 'bronze', discount: '5%', description: 'Basic consultation discount' },
          { tier: 'silver', discount: '10%', description: 'Treatment discount' },
          { tier: 'gold', discount: '15%', description: 'Comprehensive care discount' },
          { tier: 'platinum', discount: '20%', description: 'Premium services discount' },
          { tier: 'diamond', discount: '25%', description: 'VIP treatment discount' }
        ],
        locations: ['Mumbai', 'Delhi', 'Bangalore'],
        contact: {
          phone: '+91-9876543210',
          email: 'info@dentalcareplus.com',
          website: 'https://dentalcareplus.com'
        }
      },
      {
        id: 'smile-bright',
        name: 'Smile Bright Clinics',
        category: 'dental-clinic',
        logo: '/images/partners/smile-bright.png',
        description: 'Modern dental clinics with advanced technology',
        benefits: [
          { tier: 'bronze', discount: '3%', description: 'Basic services discount' },
          { tier: 'silver', discount: '8%', description: 'Cosmetic dentistry discount' },
          { tier: 'gold', discount: '12%', description: 'Orthodontics discount' },
          { tier: 'platinum', discount: '18%', description: 'Implant services discount' },
          { tier: 'diamond', discount: '22%', description: 'Full mouth rehabilitation discount' }
        ],
        locations: ['Chennai', 'Hyderabad', 'Pune'],
        contact: {
          phone: '+91-9876543211',
          email: 'contact@smilebright.com',
          website: 'https://smilebright.com'
        }
      },
      {
        id: 'health-insurance-co',
        name: 'Health Insurance Co.',
        category: 'insurance',
        logo: '/images/partners/health-insurance.png',
        description: 'Comprehensive health insurance with dental coverage',
        benefits: [
          { tier: 'bronze', discount: '2%', description: 'Premium discount' },
          { tier: 'silver', discount: '5%', description: 'Enhanced coverage discount' },
          { tier: 'gold', discount: '8%', description: 'Family plan discount' },
          { tier: 'platinum', discount: '12%', description: 'Premium plan discount' },
          { tier: 'diamond', discount: '15%', description: 'VIP plan discount' }
        ],
        locations: ['Pan India'],
        contact: {
          phone: '+91-1800-123-456',
          email: 'support@healthinsurance.com',
          website: 'https://healthinsurance.com'
        }
      },
      {
        id: 'travel-easy',
        name: 'Travel Easy',
        category: 'travel',
        logo: '/images/partners/travel-easy.png',
        description: 'Medical tourism travel packages',
        benefits: [
          { tier: 'bronze', discount: '5%', description: 'Basic travel package discount' },
          { tier: 'silver', discount: '10%', description: 'Accommodation upgrade' },
          { tier: 'gold', discount: '15%', description: 'Premium travel services' },
          { tier: 'platinum', discount: '20%', description: 'Luxury travel packages' },
          { tier: 'diamond', discount: '25%', description: 'VIP concierge services' }
        ],
        locations: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'],
        contact: {
          phone: '+91-9876543212',
          email: 'bookings@traveleasy.com',
          website: 'https://traveleasy.com'
        }
      }
    ]

    // Get user's tier to show relevant benefits
    const loyaltyPoints = await LoyaltyPoints.findOne({ userId: req.user._id })
    const userTier = loyaltyPoints ? loyaltyPoints.tier.current : 'bronze'

    const partnersWithUserBenefits = partners.map(partner => ({
      ...partner,
      userBenefit: partner.benefits.find(b => b.tier === userTier),
      allBenefits: partner.benefits
    }))

    successResponse(res, {
      partners: partnersWithUserBenefits,
      userTier,
      totalPartners: partners.length
    }, 'Partner benefits retrieved successfully')
  })
)

/**
 * @route   POST /api/loyalty/referral
 * @desc    Process referral (when someone uses user's referral code)
 * @access  Private
 */
router.post('/referral',
  authenticate,
  [
    body('referralCode')
      .notEmpty()
      .withMessage('Referral code is required'),
    
    body('newUserId')
      .isMongoId()
      .withMessage('Valid new user ID is required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const { referralCode, newUserId } = req.body

    // Find the referrer by referral code
    const referrer = await LoyaltyPoints.findOne({ 
      'referrals.referralCode': referralCode 
    })

    if (!referrer) {
      return errorResponse(res, 'Invalid referral code', 404)
    }

    // Check if the new user is not the same as referrer
    if (referrer.userId.toString() === newUserId) {
      return errorResponse(res, 'Cannot refer yourself', 400)
    }

    // Check if this user was already referred
    const existingReferral = referrer.referrals.referredUsers.find(
      ref => ref.userId.toString() === newUserId
    )

    if (existingReferral) {
      return errorResponse(res, 'User already referred', 400)
    }

    // Add referral
    const referralPoints = 500 // Points for successful referral
    
    referrer.referrals.referredUsers.push({
      userId: newUserId,
      referredAt: new Date(),
      pointsEarned: referralPoints,
      status: 'completed'
    })

    referrer.referrals.totalReferrals += 1
    referrer.referrals.successfulReferrals += 1
    referrer.referrals.referralPointsEarned += referralPoints

    // Add points to referrer
    await referrer.addPoints(
      referralPoints,
      'referral',
      `Referral bonus for referring new user`,
      { referredUserId: newUserId }
    )

    // Create loyalty account for new user with welcome bonus
    const newUserLoyalty = new LoyaltyPoints({
      userId: newUserId,
      totalPoints: 100, // Welcome bonus
      availablePoints: 100
    })

    await newUserLoyalty.addPoints(
      100,
      'signup-bonus',
      'Welcome bonus for joining through referral',
      { referredBy: referrer.userId }
    )

    successResponse(res, {
      message: 'Referral processed successfully',
      referrerPoints: referralPoints,
      newUserBonus: 100,
      totalReferrals: referrer.referrals.totalReferrals
    }, 'Referral processed successfully')
  })
)

/**
 * @route   GET /api/loyalty/offers
 * @desc    Get personalized offers based on tier and points
 * @access  Private
 */
router.get('/offers',
  authenticate,
  asyncHandler(async (req, res) => {
    const loyaltyPoints = await LoyaltyPoints.findOne({ userId: req.user._id })
    
    if (!loyaltyPoints) {
      return successResponse(res, { offers: [] }, 'No offers available')
    }

    // Generate personalized offers based on tier and available points
    const offers = []

    // Tier-based offers
    const tierOffers = {
      bronze: [
        {
          id: 'bronze-consultation',
          title: '10% Off Consultation',
          description: 'Get 10% discount on your next dental consultation',
          pointsRequired: 100,
          value: { amount: 150, currency: 'INR' },
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          category: 'discount'
        }
      ],
      silver: [
        {
          id: 'silver-cleaning',
          title: '15% Off Dental Cleaning',
          description: 'Professional dental cleaning with 15% discount',
          pointsRequired: 200,
          value: { amount: 450, currency: 'INR' },
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          category: 'discount'
        }
      ],
      gold: [
        {
          id: 'gold-treatment',
          title: '20% Off Any Treatment',
          description: 'Get 20% discount on any dental treatment',
          pointsRequired: 500,
          value: { amount: 2000, currency: 'INR' },
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          category: 'discount'
        }
      ],
      platinum: [
        {
          id: 'platinum-package',
          title: 'Free Dental Checkup Package',
          description: 'Complete dental checkup package worth ₹3000',
          pointsRequired: 1000,
          value: { amount: 3000, currency: 'INR' },
          validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          category: 'service'
        }
      ],
      diamond: [
        {
          id: 'diamond-vip',
          title: 'VIP Treatment Experience',
          description: 'Premium VIP treatment experience with concierge service',
          pointsRequired: 2000,
          value: { amount: 10000, currency: 'INR' },
          validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          category: 'service'
        }
      ]
    }

    // Add tier-specific offers
    const userTierOffers = tierOffers[loyaltyPoints.tier.current] || []
    offers.push(...userTierOffers)

    // Add general offers available to all tiers
    const generalOffers = [
      {
        id: 'cashback-100',
        title: '₹100 Cashback',
        description: 'Redeem points for ₹100 cashback',
        pointsRequired: 1000,
        value: { amount: 100, currency: 'INR' },
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        category: 'cashback'
      },
      {
        id: 'gift-card-500',
        title: '₹500 Gift Card',
        description: 'Health & wellness gift card worth ₹500',
        pointsRequired: 2500,
        value: { amount: 500, currency: 'INR' },
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        category: 'gift-card'
      }
    ]

    offers.push(...generalOffers)

    // Filter offers user can afford
    const affordableOffers = offers.filter(offer => 
      loyaltyPoints.availablePoints >= offer.pointsRequired
    )

    const unaffordableOffers = offers.filter(offer => 
      loyaltyPoints.availablePoints < offer.pointsRequired
    )

    successResponse(res, {
      availableOffers: affordableOffers,
      upcomingOffers: unaffordableOffers,
      userPoints: loyaltyPoints.availablePoints,
      userTier: loyaltyPoints.tier.current
    }, 'Personalized offers retrieved successfully')
  })
)

module.exports = router