const express = require('express')
const router = express.Router()

const { successResponse, errorResponse } = require('../middleware/errorMiddleware')

/**
 * @route   GET /api/error/session
 * @desc    Handle session errors and provide guidance
 * @access  Public
 */
router.get('/session', (req, res) => {
  const { type = 'expired' } = req.query

  const sessionErrors = {
    expired: {
      code: 'SESSION_EXPIRED',
      message: 'Your session has expired. Please log in again.',
      action: 'redirect_to_login',
      details: {
        reason: 'Session timeout due to inactivity',
        nextSteps: [
          'Click the login button to sign in again',
          'Your data is safely stored and will be available after login',
          'Consider enabling "Remember Me" for longer sessions'
        ]
      }
    },
    invalid: {
      code: 'SESSION_INVALID',
      message: 'Invalid session. Please log in to continue.',
      action: 'redirect_to_login',
      details: {
        reason: 'Session token is invalid or corrupted',
        nextSteps: [
          'Clear your browser cache and cookies',
          'Log in with your credentials',
          'Contact support if the problem persists'
        ]
      }
    },
    missing: {
      code: 'SESSION_MISSING',
      message: 'No active session found. Please log in.',
      action: 'redirect_to_login',
      details: {
        reason: 'No authentication token found',
        nextSteps: [
          'Log in with your email and password',
          'Make sure cookies are enabled in your browser',
          'Try refreshing the page after login'
        ]
      }
    },
    concurrent: {
      code: 'CONCURRENT_SESSION',
      message: 'Your account is logged in from another device.',
      action: 'force_logout_others',
      details: {
        reason: 'Multiple active sessions detected',
        nextSteps: [
          'Log out from other devices if you recognize them',
          'Change your password if you suspect unauthorized access',
          'Contact support for security concerns'
        ]
      }
    }
  }

  const errorInfo = sessionErrors[type] || sessionErrors.expired

  successResponse(res, {
    error: errorInfo,
    timestamp: new Date(),
    supportContact: {
      email: 'support@dentalcare.com',
      phone: '+91-1800-123-456',
      hours: '9 AM - 6 PM IST, Monday to Friday'
    }
  }, 'Session error information retrieved')
})

/**
 * @route   GET /api/error/upload
 * @desc    Handle file upload errors and provide guidance
 * @access  Public
 */
router.get('/upload', (req, res) => {
  const { type = 'general' } = req.query

  const uploadErrors = {
    size: {
      code: 'FILE_TOO_LARGE',
      message: 'File size exceeds the maximum limit.',
      details: {
        maxSize: '10 MB per file',
        supportedFormats: ['PDF', 'JPG', 'PNG', 'DICOM'],
        solutions: [
          'Compress your file using online tools',
          'Split large files into smaller parts',
          'Use PDF format for documents',
          'Reduce image resolution for photos'
        ]
      }
    },
    format: {
      code: 'UNSUPPORTED_FORMAT',
      message: 'File format is not supported.',
      details: {
        supportedFormats: [
          'Documents: PDF, DOC, DOCX',
          'Images: JPG, JPEG, PNG, GIF',
          'Medical: DICOM, DCM',
          'Archives: ZIP (for multiple files)'
        ],
        solutions: [
          'Convert your file to a supported format',
          'Use PDF for text documents',
          'Use JPG or PNG for images',
          'Contact support for special format needs'
        ]
      }
    },
    network: {
      code: 'UPLOAD_FAILED',
      message: 'Upload failed due to network issues.',
      details: {
        commonCauses: [
          'Slow or unstable internet connection',
          'Server temporarily unavailable',
          'File corruption during transfer'
        ],
        solutions: [
          'Check your internet connection',
          'Try uploading again in a few minutes',
          'Use a wired connection if possible',
          'Upload files one at a time'
        ]
      }
    },
    quota: {
      code: 'STORAGE_QUOTA_EXCEEDED',
      message: 'Storage quota exceeded.',
      details: {
        currentUsage: '95% of 1 GB',
        solutions: [
          'Delete old or unnecessary files',
          'Compress large files before uploading',
          'Upgrade to premium plan for more storage',
          'Archive old reports to free up space'
        ]
      }
    },
    virus: {
      code: 'SECURITY_SCAN_FAILED',
      message: 'File failed security scan.',
      details: {
        reason: 'File may contain malicious content',
        solutions: [
          'Scan your file with antivirus software',
          'Try uploading from a different device',
          'Contact support if you believe this is an error',
          'Use official medical imaging software exports'
        ]
      }
    },
    general: {
      code: 'UPLOAD_ERROR',
      message: 'An error occurred during file upload.',
      details: {
        commonSolutions: [
          'Refresh the page and try again',
          'Check your internet connection',
          'Ensure file meets size and format requirements',
          'Try using a different browser'
        ]
      }
    }
  }

  const errorInfo = uploadErrors[type] || uploadErrors.general

  successResponse(res, {
    error: errorInfo,
    uploadGuidelines: {
      maxFileSize: '10 MB',
      maxFilesPerUpload: 5,
      supportedFormats: ['PDF', 'JPG', 'PNG', 'DICOM', 'DOC', 'DOCX'],
      recommendedFormats: {
        reports: 'PDF',
        xrays: 'DICOM or high-quality JPG',
        documents: 'PDF',
        photos: 'JPG or PNG'
      }
    },
    troubleshooting: {
      steps: [
        'Verify file size is under 10 MB',
        'Check file format is supported',
        'Ensure stable internet connection',
        'Try uploading one file at a time',
        'Clear browser cache if issues persist'
      ]
    },
    timestamp: new Date()
  }, 'Upload error information retrieved')
})

/**
 * @route   GET /api/error/booking
 * @desc    Handle booking errors and provide guidance
 * @access  Public
 */
router.get('/booking', (req, res) => {
  const { type = 'general' } = req.query

  const bookingErrors = {
    unavailable: {
      code: 'SLOT_UNAVAILABLE',
      message: 'Selected time slot is no longer available.',
      solutions: [
        'Choose a different time slot',
        'Select an alternative date',
        'Enable notifications for slot availability',
        'Book in advance for better availability'
      ]
    },
    conflict: {
      code: 'SCHEDULING_CONFLICT',
      message: 'You have another appointment at this time.',
      solutions: [
        'Check your existing appointments',
        'Reschedule the conflicting appointment',
        'Choose a different time slot',
        'Contact support for assistance'
      ]
    },
    payment: {
      code: 'PAYMENT_FAILED',
      message: 'Payment processing failed.',
      solutions: [
        'Check your payment method details',
        'Ensure sufficient balance/credit limit',
        'Try a different payment method',
        'Contact your bank if issues persist'
      ]
    },
    verification: {
      code: 'PROFILE_INCOMPLETE',
      message: 'Please complete your profile to book appointments.',
      solutions: [
        'Complete your personal information',
        'Upload required documents',
        'Verify your phone number',
        'Add emergency contact details'
      ]
    }
  }

  const errorInfo = bookingErrors[type] || {
    code: 'BOOKING_ERROR',
    message: 'An error occurred while processing your booking.',
    solutions: [
      'Refresh the page and try again',
      'Check your internet connection',
      'Verify all required fields are filled',
      'Contact support if the problem persists'
    ]
  }

  successResponse(res, {
    error: errorInfo,
    bookingTips: [
      'Book appointments at least 24 hours in advance',
      'Keep your profile information up to date',
      'Have multiple preferred time slots ready',
      'Check dentist availability before booking'
    ],
    timestamp: new Date()
  }, 'Booking error information retrieved')
})

/**
 * @route   GET /api/error/payment
 * @desc    Handle payment errors and provide guidance
 * @access  Public
 */
router.get('/payment', (req, res) => {
  const { type = 'general' } = req.query

  const paymentErrors = {
    declined: {
      code: 'PAYMENT_DECLINED',
      message: 'Your payment was declined by the bank.',
      solutions: [
        'Check card details are correct',
        'Ensure sufficient balance',
        'Contact your bank',
        'Try a different payment method'
      ]
    },
    expired: {
      code: 'CARD_EXPIRED',
      message: 'Your payment card has expired.',
      solutions: [
        'Update your card details',
        'Use a different valid card',
        'Contact your bank for a new card',
        'Try alternative payment methods'
      ]
    },
    limit: {
      code: 'LIMIT_EXCEEDED',
      message: 'Transaction exceeds your card limit.',
      solutions: [
        'Contact your bank to increase limit',
        'Use a different payment method',
        'Split payment if possible',
        'Try again after 24 hours'
      ]
    },
    network: {
      code: 'NETWORK_ERROR',
      message: 'Payment processing network error.',
      solutions: [
        'Try again in a few minutes',
        'Check your internet connection',
        'Use a different browser',
        'Contact support if issue persists'
      ]
    }
  }

  const errorInfo = paymentErrors[type] || {
    code: 'PAYMENT_ERROR',
    message: 'Payment processing failed.',
    solutions: [
      'Verify payment details',
      'Try again later',
      'Use alternative payment method',
      'Contact support for assistance'
    ]
  }

  successResponse(res, {
    error: errorInfo,
    supportedPaymentMethods: [
      'Credit Cards (Visa, MasterCard, American Express)',
      'Debit Cards',
      'UPI (GPay, PhonePe, Paytm)',
      'Net Banking',
      'Digital Wallets'
    ],
    paymentSecurity: {
      encryption: 'All payments are encrypted with SSL',
      compliance: 'PCI DSS compliant',
      storage: 'We do not store your card details'
    },
    timestamp: new Date()
  }, 'Payment error information retrieved')
})

/**
 * @route   GET /api/error/general
 * @desc    General error handling and support information
 * @access  Public
 */
router.get('/general', (req, res) => {
  successResponse(res, {
    commonIssues: [
      {
        issue: 'Page not loading',
        solutions: [
          'Refresh the page',
          'Clear browser cache',
          'Check internet connection',
          'Try a different browser'
        ]
      },
      {
        issue: 'Features not working',
        solutions: [
          'Update your browser',
          'Disable browser extensions',
          'Enable JavaScript',
          'Try incognito/private mode'
        ]
      },
      {
        issue: 'Data not syncing',
        solutions: [
          'Check internet connection',
          'Log out and log back in',
          'Clear browser data',
          'Contact support'
        ]
      }
    ],
    browserSupport: {
      recommended: [
        'Chrome 90+',
        'Firefox 88+',
        'Safari 14+',
        'Edge 90+'
      ],
      features: [
        'JavaScript must be enabled',
        'Cookies must be allowed',
        'Local storage access required'
      ]
    },
    supportChannels: {
      email: 'support@dentalcare.com',
      phone: '+91-1800-123-456',
      chat: 'Available 9 AM - 6 PM IST',
      faq: '/help/faq',
      documentation: '/help/docs'
    },
    emergencyContact: {
      medical: '108 (Emergency Services)',
      support: '+91-9876543210 (24/7 Technical Support)'
    },
    timestamp: new Date()
  }, 'General error handling information retrieved')
})

/**
 * @route   POST /api/error/report
 * @desc    Report an error or issue
 * @access  Public
 */
router.post('/report', (req, res) => {
  const {
    errorType,
    errorMessage,
    userAgent,
    url,
    userId,
    additionalInfo
  } = req.body

  // In production, you would:
  // 1. Log the error to your error tracking service
  // 2. Create a support ticket
  // 3. Send notifications to support team
  // 4. Store error details for analysis

  const errorReport = {
    id: 'error_' + Date.now(),
    type: errorType,
    message: errorMessage,
    userAgent,
    url,
    userId,
    additionalInfo,
    reportedAt: new Date(),
    status: 'reported'
  }

  // Mock logging
  console.log('Error reported:', errorReport)

  successResponse(res, {
    reportId: errorReport.id,
    message: 'Error report submitted successfully',
    nextSteps: [
      'Our support team has been notified',
      'You will receive an email confirmation',
      'We will investigate and respond within 24 hours',
      'Check your email for updates'
    ],
    estimatedResolution: '24-48 hours',
    supportContact: 'support@dentalcare.com'
  }, 'Error report submitted successfully')
})

module.exports = router