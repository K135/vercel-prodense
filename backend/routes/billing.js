const express = require('express')
const router = express.Router()

const Billing = require('../models/Billing')
const Booking = require('../models/Booking')
const User = require('../models/User')
const { authenticate } = require('../middleware/auth')
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware')
const { body, validationResult } = require('express-validator')

/**
 * @route   GET /api/billing
 * @desc    Get all bills for user
 * @access  Private
 */
router.get('/',
  authenticate,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status, paymentStatus } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    let query = { userId: req.user._id }
    
    if (status && status !== 'all') {
      query.status = status
    }
    
    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus
    }

    const bills = await Billing.find(query)
      .populate('bookingId', 'treatmentType appointmentDate clinic dentistId')
      .populate({
        path: 'bookingId',
        populate: {
          path: 'dentistId',
          select: 'firstName lastName'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Billing.countDocuments(query)

    // Calculate summary statistics
    const summary = await Billing.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalBilled: { $sum: '$totalAmount' },
          totalPaid: {
            $sum: {
              $cond: [
                { $eq: ['$paymentStatus', 'paid'] },
                '$totalAmount',
                0
              ]
            }
          },
          totalOverdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$dueDate', new Date()] },
                    { $ne: ['$paymentStatus', 'paid'] }
                  ]
                },
                '$totalAmount',
                0
              ]
            }
          },
          pendingCount: {
            $sum: {
              $cond: [
                { $eq: ['$paymentStatus', 'pending'] },
                1,
                0
              ]
            }
          },
          overdueCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$dueDate', new Date()] },
                    { $ne: ['$paymentStatus', 'paid'] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ])

    successResponse(res, {
      bills,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      summary: summary[0] || {
        totalBilled: 0,
        totalPaid: 0,
        totalOverdue: 0,
        pendingCount: 0,
        overdueCount: 0
      }
    }, 'Bills retrieved successfully')
  })
)

/**
 * @route   GET /api/billing/summary
 * @desc    Get billing summary for user
 * @access  Private
 */
router.get('/summary',
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user._id

    const summary = await Billing.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalBilled: { $sum: '$totalAmount' },
          totalPaid: {
            $sum: {
              $cond: [
                { $eq: ['$paymentStatus', 'paid'] },
                '$totalAmount',
                0
              ]
            }
          },
          totalPending: {
            $sum: {
              $cond: [
                { $eq: ['$paymentStatus', 'pending'] },
                '$totalAmount',
                0
              ]
            }
          },
          totalOverdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$dueDate', new Date()] },
                    { $ne: ['$paymentStatus', 'paid'] }
                  ]
                },
                '$totalAmount',
                0
              ]
            }
          },
          billCount: { $sum: 1 },
          paidCount: {
            $sum: {
              $cond: [
                { $eq: ['$paymentStatus', 'paid'] },
                1,
                0
              ]
            }
          },
          pendingCount: {
            $sum: {
              $cond: [
                { $eq: ['$paymentStatus', 'pending'] },
                1,
                0
              ]
            }
          },
          overdueCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$dueDate', new Date()] },
                    { $ne: ['$paymentStatus', 'paid'] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ])

    // Get recent bills
    const recentBills = await Billing.find({ userId })
      .populate('bookingId', 'treatmentType appointmentDate')
      .sort({ createdAt: -1 })
      .limit(5)

    // Get upcoming due dates
    const upcomingDue = await Billing.find({
      userId,
      paymentStatus: { $ne: 'paid' },
      dueDate: { $gte: new Date(), $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    })
      .populate('bookingId', 'treatmentType')
      .sort({ dueDate: 1 })
      .limit(5)

    successResponse(res, {
      summary: summary[0] || {
        totalBilled: 0,
        totalPaid: 0,
        totalPending: 0,
        totalOverdue: 0,
        billCount: 0,
        paidCount: 0,
        pendingCount: 0,
        overdueCount: 0
      },
      recentBills,
      upcomingDue
    }, 'Billing summary retrieved successfully')
  })
)

/**
 * @route   GET /api/billing/:id
 * @desc    Get specific bill details
 * @access  Private
 */
router.get('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const bill = await Billing.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
      .populate('bookingId')
      .populate({
        path: 'bookingId',
        populate: {
          path: 'dentistId',
          select: 'firstName lastName specializations clinics'
        }
      })

    if (!bill) {
      return errorResponse(res, 'Bill not found', 404)
    }

    successResponse(res, bill, 'Bill details retrieved successfully')
  })
)

/**
 * @route   GET /api/billing/overdue
 * @desc    Get overdue bills
 * @access  Private
 */
router.get('/overdue',
  authenticate,
  asyncHandler(async (req, res) => {
    const overdueBills = await Billing.find({
      userId: req.user._id,
      dueDate: { $lt: new Date() },
      paymentStatus: { $ne: 'paid' }
    })
      .populate('bookingId', 'treatmentType appointmentDate clinic')
      .sort({ dueDate: 1 })

    successResponse(res, overdueBills, 'Overdue bills retrieved successfully')
  })
)

/**
 * @route   POST /api/billing/:id/payment
 * @desc    Record payment for a bill
 * @access  Private
 */
router.post('/:id/payment',
  authenticate,
  [
    body('amount')
      .isNumeric()
      .withMessage('Amount must be a number')
      .custom((value) => {
        if (value <= 0) {
          throw new Error('Amount must be greater than 0')
        }
        return true
      }),
    
    body('method')
      .isIn(['cash', 'card', 'upi', 'bank-transfer', 'insurance', 'wallet'])
      .withMessage('Invalid payment method'),
    
    body('reference')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Payment reference must be between 1 and 100 characters')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const { amount, method, reference } = req.body

    const bill = await Billing.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!bill) {
      return errorResponse(res, 'Bill not found', 404)
    }

    if (bill.paymentStatus === 'paid') {
      return errorResponse(res, 'Bill is already paid', 400)
    }

    // Check if payment amount is valid
    const amountDue = bill.amountDue
    if (amount > amountDue) {
      return errorResponse(res, `Payment amount cannot exceed amount due (${amountDue})`, 400)
    }

    // Add payment to history
    await bill.addPayment(amount, method, reference)

    successResponse(res, bill, 'Payment recorded successfully')
  })
)

/**
 * @route   PUT /api/billing/:id/status
 * @desc    Update bill status
 * @access  Private
 */
router.put('/:id/status',
  authenticate,
  [
    body('status')
      .isIn(['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled', 'refunded'])
      .withMessage('Invalid status')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const { status } = req.body

    const bill = await Billing.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!bill) {
      return errorResponse(res, 'Bill not found', 404)
    }

    bill.status = status
    await bill.save()

    successResponse(res, bill, 'Bill status updated successfully')
  })
)

/**
 * @route   GET /api/billing/export/csv
 * @desc    Export bills as CSV
 * @access  Private
 */
router.get('/export/csv',
  authenticate,
  asyncHandler(async (req, res) => {
    const { startDate, endDate, status } = req.query

    let query = { userId: req.user._id }
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }
    
    if (status && status !== 'all') {
      query.status = status
    }

    const bills = await Billing.find(query)
      .populate('bookingId', 'treatmentType appointmentDate')
      .sort({ createdAt: -1 })

    // Convert to CSV format
    const csvHeaders = [
      'Invoice Number',
      'Date',
      'Treatment Type',
      'Amount',
      'Status',
      'Payment Status',
      'Due Date'
    ]

    const csvRows = bills.map(bill => [
      bill.invoiceNumber,
      bill.invoiceDate.toISOString().split('T')[0],
      bill.bookingId?.treatmentType || 'N/A',
      bill.totalAmount,
      bill.status,
      bill.paymentStatus,
      bill.dueDate.toISOString().split('T')[0]
    ])

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.join(','))
      .join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=billing-export.csv')
    res.send(csvContent)
  })
)

module.exports = router