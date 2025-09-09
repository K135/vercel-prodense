const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

const Report = require('../models/Report')
const { authenticate } = require('../middleware/auth')
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware')
const { body, validationResult } = require('express-validator')
const { createUploadMiddleware, handleUploadError, cleanupFile } = require('../utils/fileUpload')

/**
 * @route   POST /api/reports/upload
 * @desc    Upload dental report
 * @access  Private
 */
router.post('/upload',
  authenticate,
  createUploadMiddleware('reports', 'files', true), // Allow multiple files
  [
    body('title')
      .notEmpty()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title is required and must be between 1 and 200 characters'),
    
    body('type')
      .isIn([
        'dental-xray', 'ct-scan', 'panoramic-xray', 'intraoral-photo',
        'treatment-plan', 'progress-report', 'lab-report', 'prescription',
        'discharge-summary', 'follow-up-report', 'consultation-notes', 'other'
      ])
      .withMessage('Invalid report type'),
    
    body('category')
      .isIn(['diagnostic', 'treatment', 'follow-up', 'administrative'])
      .withMessage('Invalid report category'),
    
    body('description')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('Description cannot exceed 2000 characters'),
    
    body('bookingId')
      .optional()
      .isMongoId()
      .withMessage('Invalid booking ID'),
    
    body('dentistId')
      .optional()
      .isMongoId()
      .withMessage('Invalid dentist ID'),
    
    body('reportDate')
      .optional()
      .isISO8601()
      .withMessage('Report date must be a valid date'),
    
    body('findings')
      .optional()
      .isArray()
      .withMessage('Findings must be an array'),
    
    body('diagnosis')
      .optional()
      .isArray()
      .withMessage('Diagnosis must be an array'),
    
    body('recommendations')
      .optional()
      .isArray()
      .withMessage('Recommendations must be an array'),
    
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      // Clean up uploaded files if validation fails
      if (req.files) {
        req.files.forEach(file => cleanupFile(file.path))
      }
      
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

    if (!req.files || req.files.length === 0) {
      return errorResponse(res, 'No files uploaded', 400)
    }

    const {
      title, type, category, description, bookingId, dentistId,
      reportDate, findings, diagnosis, recommendations, tags, clinicName
    } = req.body

    try {
      // Process uploaded files
      const files = req.files.map(file => ({
        fileName: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        fileType: file.mimetype.startsWith('image/') ? 'image' : 
                  file.mimetype === 'application/pdf' ? 'pdf' : 'document',
        uploadedAt: new Date()
      }))

      const report = new Report({
        userId: req.user._id,
        title,
        type,
        category,
        description,
        bookingId: bookingId || undefined,
        dentistId: dentistId || undefined,
        clinicName,
        reportDate: reportDate ? new Date(reportDate) : new Date(),
        findings: findings || [],
        diagnosis: diagnosis || [],
        recommendations: recommendations || [],
        files,
        tags: tags || []
      })

      await report.save()

      successResponse(res, {
        id: report._id,
        title: report.title,
        type: report.type,
        category: report.category,
        reportNumber: report.reportNumber,
        reportDate: report.reportDate,
        status: report.status,
        fileCount: report.files.length,
        urgencyLevel: report.urgencyLevel,
        createdAt: report.createdAt
      }, 'Report uploaded successfully')

    } catch (error) {
      // Clean up files if database save fails
      if (req.files) {
        req.files.forEach(file => cleanupFile(file.path))
      }
      throw error
    }
  })
)

/**
 * @route   GET /api/reports
 * @desc    Get user's reports
 * @access  Private
 */
router.get('/',
  authenticate,
  asyncHandler(async (req, res) => {
    const { 
      type, category, status, bookingId, 
      page = 1, limit = 20, search 
    } = req.query
    
    const query = {
      userId: req.user._id,
      isDeleted: false
    }

    if (type) query.type = type
    if (category) query.category = category
    if (status) query.status = status
    if (bookingId) query.bookingId = bookingId

    // Add search functionality
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'findings.description': new RegExp(search, 'i') },
        { 'diagnosis.condition': new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const reports = await Report.find(query)
      .populate('bookingId', 'treatmentType appointmentDate')
      .populate('dentistId', 'firstName lastName specializations')
      .sort({ reportDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-files.filePath') // Don't expose file paths

    const total = await Report.countDocuments(query)

    const reportsWithUrls = reports.map(report => ({
      id: report._id,
      title: report.title,
      type: report.type,
      category: report.category,
      description: report.description,
      reportNumber: report.reportNumber,
      reportDate: report.reportDate,
      status: report.status,
      urgencyLevel: report.urgencyLevel,
      fileCount: report.files.length,
      totalFileSize: report.totalFileSize,
      tags: report.tags,
      booking: report.bookingId,
      dentist: report.dentistId,
      clinicName: report.clinicName,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt
    }))

    successResponse(res, {
      reports: reportsWithUrls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Reports retrieved successfully')
  })
)

/**
 * @route   GET /api/reports/recent
 * @desc    Get recent reports
 * @access  Private
 */
router.get('/recent',
  authenticate,
  asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query

    const reports = await Report.getRecent(req.user._id, parseInt(limit))

    successResponse(res, reports, 'Recent reports retrieved successfully')
  })
)

/**
 * @route   GET /api/reports/:id
 * @desc    Get specific report
 * @access  Private
 */
router.get('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    })
    .populate('bookingId', 'treatmentType appointmentDate clinic')
    .populate('dentistId', 'firstName lastName specializations rating')

    if (!report) {
      return errorResponse(res, 'Report not found', 404)
    }

    // Track view
    await report.trackView()

    const reportData = {
      id: report._id,
      title: report.title,
      type: report.type,
      category: report.category,
      description: report.description,
      reportNumber: report.reportNumber,
      reportDate: report.reportDate,
      status: report.status,
      urgencyLevel: report.urgencyLevel,
      findings: report.findings,
      diagnosis: report.diagnosis,
      recommendations: report.recommendations,
      files: report.fileUrls,
      tags: report.tags,
      booking: report.bookingId,
      dentist: report.dentistId,
      clinicName: report.clinicName,
      followUpRequired: report.followUpRequired,
      followUpDate: report.followUpDate,
      analytics: report.analytics,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt
    }

    successResponse(res, reportData, 'Report retrieved successfully')
  })
)

/**
 * @route   GET /api/reports/:id/download
 * @desc    Download report as PDF or zip
 * @access  Private
 */
router.get('/:id/download',
  authenticate,
  asyncHandler(async (req, res) => {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    })

    if (!report) {
      return errorResponse(res, 'Report not found', 404)
    }

    const { fileId } = req.query

    if (fileId) {
      // Download specific file
      const file = report.files.id(fileId)
      if (!file) {
        return errorResponse(res, 'File not found', 404)
      }

      if (!fs.existsSync(file.filePath)) {
        return errorResponse(res, 'File not found on server', 404)
      }

      // Track download
      await report.trackDownload()

      res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`)
      res.setHeader('Content-Type', file.mimeType)

      const fileStream = fs.createReadStream(file.filePath)
      fileStream.pipe(res)
    } else {
      // Download all files as zip (implement zip functionality)
      return errorResponse(res, 'Zip download not implemented yet', 501)
    }
  })
)

/**
 * @route   PUT /api/reports/:id
 * @desc    Update report metadata
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
      .isLength({ max: 2000 })
      .withMessage('Description cannot exceed 2000 characters'),
    
    body('findings')
      .optional()
      .isArray()
      .withMessage('Findings must be an array'),
    
    body('diagnosis')
      .optional()
      .isArray()
      .withMessage('Diagnosis must be an array'),
    
    body('recommendations')
      .optional()
      .isArray()
      .withMessage('Recommendations must be an array'),
    
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    
    body('followUpRequired')
      .optional()
      .isBoolean()
      .withMessage('Follow up required must be a boolean'),
    
    body('followUpDate')
      .optional()
      .isISO8601()
      .withMessage('Follow up date must be a valid date')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    })

    if (!report) {
      return errorResponse(res, 'Report not found', 404)
    }

    const allowedUpdates = [
      'title', 'description', 'findings', 'diagnosis', 
      'recommendations', 'tags', 'followUpRequired', 'followUpDate'
    ]

    const updates = {}
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'followUpDate') {
          updates[field] = req.body[field] ? new Date(req.body[field]) : null
        } else {
          updates[field] = req.body[field]
        }
      }
    })

    if (Object.keys(updates).length === 0) {
      return errorResponse(res, 'No valid fields provided for update', 400)
    }

    Object.assign(report, updates)
    await report.save()

    successResponse(res, {
      id: report._id,
      title: report.title,
      description: report.description,
      findings: report.findings,
      diagnosis: report.diagnosis,
      recommendations: report.recommendations,
      tags: report.tags,
      followUpRequired: report.followUpRequired,
      followUpDate: report.followUpDate,
      urgencyLevel: report.urgencyLevel,
      updatedAt: report.updatedAt
    }, 'Report updated successfully')
  })
)

/**
 * @route   POST /api/reports/:id/share
 * @desc    Share report with dentists or others
 * @access  Private
 */
router.post('/:id/share',
  authenticate,
  [
    body('recipientType')
      .isIn(['dentist', 'patient', 'clinic', 'insurance', 'other'])
      .withMessage('Invalid recipient type'),
    
    body('recipientEmail')
      .isEmail()
      .withMessage('Valid recipient email is required'),
    
    body('recipientName')
      .notEmpty()
      .withMessage('Recipient name is required'),
    
    body('permissions')
      .optional()
      .isIn(['view', 'download', 'edit'])
      .withMessage('Invalid permissions'),
    
    body('expiresAt')
      .optional()
      .isISO8601()
      .withMessage('Expiry date must be a valid date')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array())
    }

    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    })

    if (!report) {
      return errorResponse(res, 'Report not found', 404)
    }

    const {
      recipientType, recipientEmail, recipientName,
      permissions = 'view', expiresAt
    } = req.body

    const shareData = {
      recipientType,
      recipientEmail,
      recipientName,
      permissions,
      sharedAt: new Date()
    }

    if (expiresAt) {
      shareData.expiresAt = new Date(expiresAt)
    }

    await report.shareWith(shareData)

    // TODO: Send email notification to recipient

    successResponse(res, {
      message: 'Report shared successfully',
      shareId: report.sharedWith[report.sharedWith.length - 1]._id
    }, 'Report shared successfully')
  })
)

/**
 * @route   DELETE /api/reports/:id
 * @desc    Delete report (soft delete)
 * @access  Private
 */
router.delete('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    })

    if (!report) {
      return errorResponse(res, 'Report not found', 404)
    }

    report.isDeleted = true
    report.deletedAt = new Date()
    await report.save()

    successResponse(res, { message: 'Report deleted successfully' }, 'Report deleted successfully')
  })
)

/**
 * @route   GET /api/reports/search
 * @desc    Search reports
 * @access  Private
 */
router.get('/search',
  authenticate,
  asyncHandler(async (req, res) => {
    const { q: query, limit = 20 } = req.query

    if (!query) {
      return errorResponse(res, 'Search query is required', 400)
    }

    const reports = await Report.search(req.user._id, query)
      .limit(parseInt(limit))

    successResponse(res, reports, 'Search results retrieved successfully')
  })
)

/**
 * @route   GET /api/reports/stats
 * @desc    Get reports statistics
 * @access  Private
 */
router.get('/stats',
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user._id

    const stats = await Report.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), isDeleted: false } },
      {
        $group: {
          _id: null,
          totalReports: { $sum: 1 },
          byType: {
            $push: {
              type: '$type',
              count: 1
            }
          },
          byCategory: {
            $push: {
              category: '$category',
              count: 1
            }
          },
          byStatus: {
            $push: {
              status: '$status',
              count: 1
            }
          },
          totalFileSize: { $sum: '$totalFileSize' },
          avgFilesPerReport: { $avg: { $size: '$files' } }
        }
      }
    ])

    const result = stats[0] || {
      totalReports: 0,
      byType: [],
      byCategory: [],
      byStatus: [],
      totalFileSize: 0,
      avgFilesPerReport: 0
    }

    // Get recent activity
    const recentReports = await Report.find({
      userId,
      isDeleted: false
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title type reportDate createdAt')

    successResponse(res, {
      ...result,
      recentReports
    }, 'Report statistics retrieved successfully')
  })
)

// Error handling middleware
router.use(handleUploadError)

module.exports = router