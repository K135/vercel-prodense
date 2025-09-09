const express = require('express')
const router = express.Router()

const Notification = require('../models/Notification')
const { authenticate } = require('../middleware/auth')
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware')
const { body, validationResult } = require('express-validator')

/**
 * @route   GET /api/notifications
 * @desc    Get user notifications
 * @access  Private
 */
router.get('/',
  authenticate,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, type, status = 'all' } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    let query = { userId: req.user._id }
    
    if (type) query.type = type
    if (status !== 'all') {
      query.isRead = status === 'read'
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Notification.countDocuments(query)
    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false
    })

    successResponse(res, {
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Notifications retrieved successfully')
  })
)

/**
 * @route   GET /api/notifications/unread
 * @desc    Get unread notifications count
 * @access  Private
 */
router.get('/unread',
  authenticate,
  asyncHandler(async (req, res) => {
    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false
    })

    const recentNotifications = await Notification.find({
      userId: req.user._id,
      isRead: false
    })
    .sort({ createdAt: -1 })
    .limit(5)

    successResponse(res, {
      unreadCount,
      recentNotifications
    }, 'Unread notifications retrieved successfully')
  })
)

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:id/read',
  authenticate,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!notification) {
      return errorResponse(res, 'Notification not found', 404)
    }

    if (!notification.isRead) {
      notification.isRead = true
      notification.readAt = new Date()
      await notification.save()
    }

    successResponse(res, notification, 'Notification marked as read')
  })
)

/**
 * @route   PUT /api/notifications/mark-all-read
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/mark-all-read',
  authenticate,
  asyncHandler(async (req, res) => {
    const result = await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { 
        isRead: true, 
        readAt: new Date() 
      }
    )

    successResponse(res, {
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount
    }, 'All notifications marked as read')
  })
)

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!notification) {
      return errorResponse(res, 'Notification not found', 404)
    }

    await notification.deleteOne()

    successResponse(res, { message: 'Notification deleted successfully' }, 'Notification deleted successfully')
  })
)

/**
 * @route   POST /api/notifications/preferences
 * @desc    Update notification preferences
 * @access  Private
 */
router.post('/preferences',
  authenticate,
  [
    body('email')
      .optional()
      .isBoolean()
      .withMessage('Email preference must be boolean'),
    
    body('push')
      .optional()
      .isBoolean()
      .withMessage('Push preference must be boolean'),
    
    body('sms')
      .optional()
      .isBoolean()
      .withMessage('SMS preference must be boolean'),
    
    body('types')
      .optional()
      .isObject()
      .withMessage('Types must be an object')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    // In a real app, you'd save these preferences to user profile
    // For now, we'll just return success
    const preferences = req.body

    successResponse(res, {
      message: 'Notification preferences updated',
      preferences
    }, 'Preferences updated successfully')
  })
)

module.exports = router