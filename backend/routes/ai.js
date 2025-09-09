const express = require('express')
const router = express.Router()

const { authenticate } = require('../middleware/auth')
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware')
const { body, validationResult } = require('express-validator')

/**
 * @route   POST /api/ai/query
 * @desc    Send query to AI assistant
 * @access  Private
 */
router.post('/query',
  authenticate,
  [
    body('message')
      .notEmpty()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Message is required and must be between 1 and 1000 characters'),
    
    body('context')
      .optional()
      .isObject()
      .withMessage('Context must be an object'),
    
    body('sessionId')
      .optional()
      .isString()
      .withMessage('Session ID must be a string')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const { message, context, sessionId } = req.body

    // Simulate AI response based on message content
    const aiResponse = generateAIResponse(message, context, req.user)

    // In production, you would:
    // 1. Send to actual AI service (OpenAI, etc.)
    // 2. Store conversation history
    // 3. Handle context and session management

    const response = {
      sessionId: sessionId || generateSessionId(),
      message: aiResponse.message,
      type: aiResponse.type,
      suggestions: aiResponse.suggestions,
      actions: aiResponse.actions,
      timestamp: new Date()
    }

    successResponse(res, response, 'AI response generated successfully')
  })
)

/**
 * @route   GET /api/ai/chat-history
 * @desc    Get AI chat history
 * @access  Private
 */
router.get('/chat-history',
  authenticate,
  asyncHandler(async (req, res) => {
    const { sessionId, limit = 50 } = req.query

    // In production, retrieve from database
    // For now, return mock data
    const chatHistory = [
      {
        id: '1',
        type: 'user',
        message: 'What are the symptoms of tooth decay?',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        type: 'ai',
        message: 'Common symptoms of tooth decay include tooth pain, sensitivity to hot/cold, visible holes in teeth, and bad breath. Would you like me to help you find a dentist for a checkup?',
        timestamp: new Date(Date.now() - 3590000),
        actions: [
          { type: 'find-dentist', label: 'Find Dentist' },
          { type: 'book-appointment', label: 'Book Appointment' }
        ]
      }
    ]

    successResponse(res, {
      chatHistory,
      sessionId: sessionId || 'default-session'
    }, 'Chat history retrieved successfully')
  })
)

/**
 * @route   POST /api/ai/reschedule
 * @desc    AI-assisted appointment rescheduling
 * @access  Private
 */
router.post('/reschedule',
  authenticate,
  [
    body('bookingId')
      .isMongoId()
      .withMessage('Valid booking ID is required'),
    
    body('preferredDates')
      .isArray({ min: 1 })
      .withMessage('At least one preferred date is required'),
    
    body('reason')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Reason cannot exceed 500 characters')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const { bookingId, preferredDates, reason } = req.body

    // In production, this would:
    // 1. Check booking exists and belongs to user
    // 2. Check dentist availability
    // 3. Suggest best alternatives
    // 4. Handle the rescheduling process

    const suggestions = [
      {
        date: preferredDates[0],
        time: '10:00 AM',
        available: true,
        dentistName: 'Dr. Smith',
        confidence: 0.95
      },
      {
        date: preferredDates[0],
        time: '2:00 PM',
        available: true,
        dentistName: 'Dr. Smith',
        confidence: 0.87
      }
    ]

    const response = {
      bookingId,
      originalDate: '2024-01-15',
      originalTime: '9:00 AM',
      suggestions,
      message: 'I found several available slots that match your preferences. Would you like me to book one of these for you?',
      actions: [
        { type: 'confirm-reschedule', label: 'Confirm Reschedule' },
        { type: 'see-more-options', label: 'See More Options' }
      ]
    }

    successResponse(res, response, 'Reschedule suggestions generated successfully')
  })
)

/**
 * @route   GET /api/ai/guide
 * @desc    Get AI guide for features and reports
 * @access  Private
 */
router.get('/guide',
  authenticate,
  asyncHandler(async (req, res) => {
    const { topic } = req.query

    const guides = {
      'reports': {
        title: 'Understanding Your Dental Reports',
        sections: [
          {
            title: 'X-Ray Reports',
            content: 'X-ray reports show the internal structure of your teeth and jaw. Look for mentions of cavities, bone loss, or impacted teeth.',
            tips: [
              'Dark spots usually indicate cavities',
              'Bone loss appears as reduced density around tooth roots',
              'Impacted teeth are visible but not properly positioned'
            ]
          },
          {
            title: 'Treatment Plans',
            content: 'Treatment plans outline recommended procedures, timeline, and costs.',
            tips: [
              'Priority levels indicate urgency',
              'Alternative treatments may be available',
              'Ask about payment plans if needed'
            ]
          }
        ]
      },
      'booking': {
        title: 'How to Book Appointments',
        sections: [
          {
            title: 'Finding the Right Dentist',
            content: 'Use our search filters to find dentists by specialty, location, and availability.',
            tips: [
              'Check reviews and ratings',
              'Verify credentials and experience',
              'Consider location and travel time'
            ]
          },
          {
            title: 'Booking Process',
            content: 'Select your preferred date and time, provide treatment details, and confirm your booking.',
            tips: [
              'Book in advance for better availability',
              'Provide accurate medical history',
              'Confirm appointment 24 hours before'
            ]
          }
        ]
      },
      'cost-estimator': {
        title: 'Using the Cost Estimator',
        sections: [
          {
            title: 'Getting Accurate Estimates',
            content: 'Provide detailed treatment information for more accurate cost estimates.',
            tips: [
              'Include all planned treatments',
              'Consider travel and accommodation costs',
              'Compare estimates from different locations'
            ]
          }
        ]
      }
    }

    const guide = guides[topic] || {
      title: 'General Help',
      sections: [
        {
          title: 'Getting Started',
          content: 'Welcome to our dental tourism platform. Here are some quick tips to get you started.',
          tips: [
            'Complete your profile for personalized recommendations',
            'Upload any existing dental reports',
            'Use the cost estimator to plan your budget'
          ]
        }
      ]
    }

    successResponse(res, guide, 'Guide retrieved successfully')
  })
)

/**
 * @route   POST /api/ai/analyze-report
 * @desc    AI analysis of dental reports
 * @access  Private
 */
router.post('/analyze-report',
  authenticate,
  [
    body('reportId')
      .isMongoId()
      .withMessage('Valid report ID is required'),
    
    body('analysisType')
      .optional()
      .isIn(['summary', 'recommendations', 'risk-assessment', 'treatment-options'])
      .withMessage('Invalid analysis type')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const { reportId, analysisType = 'summary' } = req.body

    // In production, this would:
    // 1. Fetch the report
    // 2. Use AI to analyze the content
    // 3. Generate insights and recommendations

    const analysis = {
      reportId,
      analysisType,
      summary: 'Based on your dental X-ray, I can see evidence of early-stage tooth decay in your upper right molar. The cavity appears to be small and treatable with a simple filling.',
      findings: [
        {
          type: 'cavity',
          severity: 'mild',
          location: 'Upper right molar',
          description: 'Small cavity detected on the chewing surface'
        }
      ],
      recommendations: [
        {
          priority: 'high',
          treatment: 'Dental filling',
          urgency: 'Schedule within 2-4 weeks',
          estimatedCost: { min: 2000, max: 4000, currency: 'INR' }
        },
        {
          priority: 'medium',
          treatment: 'Professional cleaning',
          urgency: 'Schedule within 1-2 months',
          estimatedCost: { min: 1500, max: 3000, currency: 'INR' }
        }
      ],
      riskFactors: [
        'Poor oral hygiene in affected area',
        'Possible dietary factors contributing to decay'
      ],
      preventiveMeasures: [
        'Improve brushing technique',
        'Use fluoride toothpaste',
        'Reduce sugar intake',
        'Regular dental checkups'
      ],
      confidence: 0.85,
      disclaimer: 'This AI analysis is for informational purposes only. Please consult with a qualified dentist for professional diagnosis and treatment.'
    }

    successResponse(res, analysis, 'Report analysis completed successfully')
  })
)

// Helper functions
function generateAIResponse(message, context, user) {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
    return {
      message: `Hi ${user.firstName}! I can help you book an appointment. What type of dental treatment are you looking for?`,
      type: 'booking-assistance',
      suggestions: [
        'General checkup',
        'Teeth cleaning',
        'Dental filling',
        'Root canal treatment'
      ],
      actions: [
        { type: 'find-dentist', label: 'Find Dentist' },
        { type: 'view-bookings', label: 'My Bookings' }
      ]
    }
  }
  
  if (lowerMessage.includes('cost') || lowerMessage.includes('price')) {
    return {
      message: 'I can help you estimate treatment costs. What procedures are you considering?',
      type: 'cost-estimation',
      suggestions: [
        'Dental implant',
        'Crown and bridge',
        'Orthodontic treatment',
        'Cosmetic dentistry'
      ],
      actions: [
        { type: 'cost-estimator', label: 'Good Faith Estimator' },
        { type: 'compare-locations', label: 'Compare Locations' }
      ]
    }
  }
  
  if (lowerMessage.includes('report') || lowerMessage.includes('x-ray')) {
    return {
      message: 'I can help you understand your dental reports. Would you like me to analyze a specific report or explain common dental terms?',
      type: 'report-assistance',
      suggestions: [
        'Analyze my latest X-ray',
        'Explain treatment plan',
        'Understand diagnosis',
        'Compare reports'
      ],
      actions: [
        { type: 'upload-report', label: 'Upload Report' },
        { type: 'view-reports', label: 'My Reports' }
      ]
    }
  }
  
  // Default response
  return {
    message: `Hello ${user.firstName}! I'm your dental care assistant. I can help you with booking appointments, understanding reports, estimating costs, and answering dental health questions. What would you like to know?`,
    type: 'general',
    suggestions: [
      'Book an appointment',
      'Estimate treatment costs',
      'Understand my reports',
      'Find local dentists'
    ],
    actions: [
      { type: 'dashboard', label: 'Go to Dashboard' },
      { type: 'help', label: 'Get Help' }
    ]
  }
}

function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

module.exports = router