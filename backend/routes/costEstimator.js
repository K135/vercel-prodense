const express = require('express')
const router = express.Router()

const CostEstimate = require('../models/CostEstimate')
const { authenticate } = require('../middleware/auth')
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware')
const { body, validationResult } = require('express-validator')

/**
 * @route   POST /api/cost-estimator/calculate
 * @desc    Calculate treatment cost estimate
 * @access  Private
 */
router.post('/calculate',
  authenticate,
  [
    body('treatments')
      .isArray({ min: 1 })
      .withMessage('At least one treatment is required'),
    
    body('treatments.*.type')
      .isIn([
        'consultation', 'cleaning', 'filling', 'root-canal',
        'crown', 'bridge', 'implant', 'extraction',
        'orthodontics', 'whitening', 'veneer', 'denture',
        'gum-treatment', 'oral-surgery', 'emergency', 'other'
      ])
      .withMessage('Invalid treatment type'),
    
    body('treatments.*.quantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    
    body('treatments.*.complexity')
      .optional()
      .isIn(['simple', 'moderate', 'complex'])
      .withMessage('Invalid complexity level'),
    
    body('location.city')
      .optional()
      .notEmpty()
      .withMessage('City name is required if location is provided'),
    
    body('location.state')
      .optional()
      .notEmpty()
      .withMessage('State name is required if location is provided'),
    
    body('preferences.budgetRange.min')
      .optional()
      .isNumeric()
      .withMessage('Minimum budget must be a number'),
    
    body('preferences.budgetRange.max')
      .optional()
      .isNumeric()
      .withMessage('Maximum budget must be a number')
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

    const { treatments, location, preferences, includeTravel = false } = req.body

    // Base pricing data (in production, this would come from a database)
    const basePricing = {
      consultation: { min: 500, max: 1500 },
      cleaning: { min: 1000, max: 3000 },
      filling: { min: 1500, max: 5000 },
      'root-canal': { min: 8000, max: 25000 },
      crown: { min: 8000, max: 30000 },
      bridge: { min: 15000, max: 50000 },
      implant: { min: 25000, max: 80000 },
      extraction: { min: 1000, max: 5000 },
      orthodontics: { min: 30000, max: 150000 },
      whitening: { min: 5000, max: 20000 },
      veneer: { min: 8000, max: 25000 },
      denture: { min: 10000, max: 40000 },
      'gum-treatment': { min: 3000, max: 15000 },
      'oral-surgery': { min: 10000, max: 50000 },
      emergency: { min: 2000, max: 10000 },
      other: { min: 1000, max: 10000 }
    }

    // Location multipliers (in production, this would be more sophisticated)
    const locationMultipliers = {
      'mumbai': 1.3,
      'delhi': 1.25,
      'bangalore': 1.2,
      'chennai': 1.15,
      'hyderabad': 1.1,
      'pune': 1.1,
      'kolkata': 1.05,
      'ahmedabad': 1.0,
      'jaipur': 0.9,
      'lucknow': 0.85,
      'default': 1.0
    }

    // Complexity multipliers
    const complexityMultipliers = {
      simple: 0.8,
      moderate: 1.0,
      complex: 1.4
    }

    // Calculate treatment costs
    const processedTreatments = treatments.map(treatment => {
      const basePrice = basePricing[treatment.type] || basePricing.other
      const quantity = treatment.quantity || 1
      const complexity = treatment.complexity || 'moderate'
      
      let locationMultiplier = 1.0
      if (location && location.city) {
        locationMultiplier = locationMultipliers[location.city.toLowerCase()] || locationMultipliers.default
      }
      
      const complexityMultiplier = complexityMultipliers[complexity]
      
      const unitCost = {
        min: Math.round(basePrice.min * locationMultiplier * complexityMultiplier),
        max: Math.round(basePrice.max * locationMultiplier * complexityMultiplier),
        currency: 'INR'
      }
      
      const totalCost = {
        min: unitCost.min * quantity,
        max: unitCost.max * quantity,
        currency: 'INR'
      }

      return {
        ...treatment,
        quantity,
        complexity,
        unitCost,
        totalCost,
        duration: getTreatmentDuration(treatment.type) * quantity
      }
    })

    // Calculate additional costs
    const additionalCosts = [
      {
        category: 'consultation',
        description: 'Initial consultation and examination',
        cost: { min: 500, max: 1500, currency: 'INR' },
        isOptional: false
      },
      {
        category: 'diagnostics',
        description: 'X-rays and diagnostic tests',
        cost: { min: 1000, max: 3000, currency: 'INR' },
        isOptional: false
      },
      {
        category: 'medications',
        description: 'Post-treatment medications',
        cost: { min: 500, max: 2000, currency: 'INR' },
        isOptional: false
      },
      {
        category: 'follow-up',
        description: 'Follow-up visits',
        cost: { min: 1000, max: 3000, currency: 'INR' },
        isOptional: true
      }
    ]

    // Calculate travel costs if requested
    let travelCosts = null
    if (includeTravel && location) {
      const estimatedDays = Math.ceil(processedTreatments.reduce((total, t) => total + t.duration, 0) / (8 * 60)) // 8 hours per day
      
      travelCosts = {
        transportation: {
          domestic: {
            flight: { min: 5000, max: 15000, currency: 'INR' },
            train: { min: 1000, max: 5000, currency: 'INR' },
            bus: { min: 500, max: 2000, currency: 'INR' }
          },
          local: {
            perDay: { min: 500, max: 1500, currency: 'INR' }
          }
        },
        accommodation: {
          budget: { min: 1500, max: 3000, currency: 'INR' },
          midRange: { min: 3000, max: 6000, currency: 'INR' },
          luxury: { min: 6000, max: 15000, currency: 'INR' }
        },
        meals: {
          perDay: { min: 1000, max: 3000, currency: 'INR' }
        },
        estimatedDays
      }
    }

    // Calculate totals
    const treatmentTotal = processedTreatments.reduce((total, treatment) => ({
      min: total.min + treatment.totalCost.min,
      max: total.max + treatment.totalCost.max
    }), { min: 0, max: 0 })

    const additionalTotal = additionalCosts.reduce((total, cost) => ({
      min: total.min + cost.cost.min,
      max: total.max + cost.cost.max
    }), { min: 0, max: 0 })

    let travelTotal = { min: 0, max: 0 }
    if (travelCosts) {
      const days = travelCosts.estimatedDays
      travelTotal = {
        min: travelCosts.accommodation.budget.min * days + travelCosts.meals.perDay.min * days + travelCosts.transportation.local.perDay.min * days,
        max: travelCosts.accommodation.midRange.max * days + travelCosts.meals.perDay.max * days + travelCosts.transportation.local.perDay.max * days
      }
    }

    const grandTotal = {
      min: treatmentTotal.min + additionalTotal.min + travelTotal.min,
      max: treatmentTotal.max + additionalTotal.max + travelTotal.max,
      currency: 'INR'
    }

    // Create estimate object
    const estimate = {
      treatments: processedTreatments,
      additionalCosts,
      travelCosts,
      totalCost: {
        treatment: { ...treatmentTotal, currency: 'INR' },
        additional: { ...additionalTotal, currency: 'INR' },
        travel: { ...travelTotal, currency: 'INR' },
        grandTotal
      },
      location: location || null,
      preferences: preferences || null,
      source: 'system-calculated',
      generatedBy: req.user._id,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }

    successResponse(res, estimate, 'Cost estimate calculated successfully')
  })
)

/**
 * @route   POST /api/cost-estimator/save
 * @desc    Save cost estimate
 * @access  Private
 */
router.post('/save',
  authenticate,
  [
    body('title')
      .notEmpty()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title is required and must be between 1 and 200 characters'),
    
    body('treatments')
      .isArray({ min: 1 })
      .withMessage('At least one treatment is required'),
    
    body('totalCost.grandTotal.min')
      .isNumeric()
      .withMessage('Minimum total cost is required'),
    
    body('totalCost.grandTotal.max')
      .isNumeric()
      .withMessage('Maximum total cost is required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const estimate = new CostEstimate({
      userId: req.user._id,
      ...req.body,
      status: 'active'
    })

    await estimate.save()

    successResponse(res, {
      id: estimate._id,
      title: estimate.title,
      estimateNumber: estimate.estimateNumber,
      totalCost: estimate.totalCost,
      validUntil: estimate.validUntil,
      status: estimate.status,
      createdAt: estimate.createdAt
    }, 'Cost estimate saved successfully')
  })
)

/**
 * @route   GET /api/cost-estimator/saved
 * @desc    Get saved cost estimates
 * @access  Private
 */
router.get('/saved',
  authenticate,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    let query = {
      userId: req.user._id,
      isDeleted: false
    }

    if (status) {
      query.status = status
    }

    const estimates = await CostEstimate.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('title estimateNumber totalCost status validUntil isValid daysUntilExpiry createdAt')

    const total = await CostEstimate.countDocuments(query)

    successResponse(res, {
      estimates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Saved estimates retrieved successfully')
  })
)

/**
 * @route   GET /api/cost-estimator/:id
 * @desc    Get specific cost estimate
 * @access  Private
 */
router.get('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const estimate = await CostEstimate.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    })

    if (!estimate) {
      return errorResponse(res, 'Cost estimate not found', 404)
    }

    successResponse(res, estimate, 'Cost estimate retrieved successfully')
  })
)

/**
 * @route   POST /api/cost-estimator/compare
 * @desc    Compare multiple estimates or locations
 * @access  Private
 */
router.post('/compare',
  authenticate,
  [
    body('estimateIds')
      .optional()
      .isArray({ min: 2, max: 5 })
      .withMessage('Provide 2-5 estimate IDs for comparison'),
    
    body('treatments')
      .optional()
      .isArray({ min: 1 })
      .withMessage('At least one treatment is required for location comparison'),
    
    body('locations')
      .optional()
      .isArray({ min: 2, max: 5 })
      .withMessage('Provide 2-5 locations for comparison')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const { estimateIds, treatments, locations } = req.body

    if (estimateIds) {
      // Compare existing estimates
      const estimates = await CostEstimate.find({
        _id: { $in: estimateIds },
        userId: req.user._id,
        isDeleted: false
      })

      if (estimates.length < 2) {
        return errorResponse(res, 'At least 2 valid estimates required for comparison', 400)
      }

      const comparison = {
        type: 'estimates',
        estimates: estimates.map(est => ({
          id: est._id,
          title: est.title,
          estimateNumber: est.estimateNumber,
          totalCost: est.totalCost,
          location: est.locations[0] || null,
          validUntil: est.validUntil,
          isValid: est.isValid
        })),
        analysis: {
          cheapest: estimates.reduce((min, est) => 
            est.totalCost.grandTotal.min < min.totalCost.grandTotal.min ? est : min
          ),
          mostExpensive: estimates.reduce((max, est) => 
            est.totalCost.grandTotal.max > max.totalCost.grandTotal.max ? est : max
          ),
          averageCost: {
            min: Math.round(estimates.reduce((sum, est) => sum + est.totalCost.grandTotal.min, 0) / estimates.length),
            max: Math.round(estimates.reduce((sum, est) => sum + est.totalCost.grandTotal.max, 0) / estimates.length)
          }
        }
      }

      successResponse(res, comparison, 'Estimates compared successfully')

    } else if (treatments && locations) {
      // Compare treatments across different locations
      const locationComparisons = []

      for (const location of locations) {
        // Calculate estimate for this location (reuse calculation logic)
        const locationMultipliers = {
          'mumbai': 1.3,
          'delhi': 1.25,
          'bangalore': 1.2,
          'chennai': 1.15,
          'hyderabad': 1.1,
          'pune': 1.1,
          'kolkata': 1.05,
          'ahmedabad': 1.0,
          'jaipur': 0.9,
          'lucknow': 0.85,
          'default': 1.0
        }

        const basePricing = {
          consultation: { min: 500, max: 1500 },
          cleaning: { min: 1000, max: 3000 },
          filling: { min: 1500, max: 5000 },
          'root-canal': { min: 8000, max: 25000 },
          crown: { min: 8000, max: 30000 },
          bridge: { min: 15000, max: 50000 },
          implant: { min: 25000, max: 80000 },
          extraction: { min: 1000, max: 5000 },
          orthodontics: { min: 30000, max: 150000 },
          whitening: { min: 5000, max: 20000 },
          veneer: { min: 8000, max: 25000 },
          denture: { min: 10000, max: 40000 },
          'gum-treatment': { min: 3000, max: 15000 },
          'oral-surgery': { min: 10000, max: 50000 },
          emergency: { min: 2000, max: 10000 },
          other: { min: 1000, max: 10000 }
        }

        const locationMultiplier = locationMultipliers[location.city.toLowerCase()] || locationMultipliers.default

        const locationTotal = treatments.reduce((total, treatment) => {
          const basePrice = basePricing[treatment.type] || basePricing.other
          const quantity = treatment.quantity || 1
          
          const cost = {
            min: Math.round(basePrice.min * locationMultiplier * quantity),
            max: Math.round(basePrice.max * locationMultiplier * quantity)
          }

          return {
            min: total.min + cost.min,
            max: total.max + cost.max
          }
        }, { min: 0, max: 0 })

        locationComparisons.push({
          location,
          totalCost: { ...locationTotal, currency: 'INR' },
          multiplier: locationMultiplier,
          savings: null // Will be calculated after all locations
        })
      }

      // Calculate savings compared to most expensive location
      const maxCost = Math.max(...locationComparisons.map(loc => loc.totalCost.max))
      locationComparisons.forEach(loc => {
        loc.savings = {
          amount: maxCost - loc.totalCost.max,
          percentage: Math.round(((maxCost - loc.totalCost.max) / maxCost) * 100)
        }
      })

      const comparison = {
        type: 'locations',
        treatments,
        locations: locationComparisons,
        analysis: {
          cheapest: locationComparisons.reduce((min, loc) => 
            loc.totalCost.min < min.totalCost.min ? loc : min
          ),
          mostExpensive: locationComparisons.reduce((max, loc) => 
            loc.totalCost.max > max.totalCost.max ? loc : max
          ),
          maxSavings: Math.max(...locationComparisons.map(loc => loc.savings.amount))
        }
      }

      successResponse(res, comparison, 'Locations compared successfully')

    } else {
      return errorResponse(res, 'Either estimateIds or (treatments + locations) must be provided', 400)
    }
  })
)

/**
 * @route   PUT /api/cost-estimator/:id
 * @desc    Update cost estimate
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

    const estimate = await CostEstimate.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    })

    if (!estimate) {
      return errorResponse(res, 'Cost estimate not found', 404)
    }

    const allowedUpdates = ['title', 'description', 'notes', 'preferences']
    const updates = {}

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    })

    if (Object.keys(updates).length === 0) {
      return errorResponse(res, 'No valid fields provided for update', 400)
    }

    Object.assign(estimate, updates)
    await estimate.save()

    successResponse(res, estimate, 'Cost estimate updated successfully')
  })
)

/**
 * @route   DELETE /api/cost-estimator/:id
 * @desc    Delete cost estimate
 * @access  Private
 */
router.delete('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const estimate = await CostEstimate.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    })

    if (!estimate) {
      return errorResponse(res, 'Cost estimate not found', 404)
    }

    estimate.isDeleted = true
    estimate.deletedAt = new Date()
    await estimate.save()

    successResponse(res, { message: 'Cost estimate deleted successfully' }, 'Cost estimate deleted successfully')
  })
)

// Helper function to get treatment duration in minutes
function getTreatmentDuration(treatmentType) {
  const durations = {
    consultation: 30,
    cleaning: 60,
    filling: 45,
    'root-canal': 90,
    crown: 120,
    bridge: 180,
    implant: 120,
    extraction: 30,
    orthodontics: 60,
    whitening: 90,
    veneer: 120,
    denture: 180,
    'gum-treatment': 60,
    'oral-surgery': 120,
    emergency: 45,
    other: 60
  }
  
  return durations[treatmentType] || 60
}

module.exports = router