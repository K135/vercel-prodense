const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

const Document = require('../models/Document')
const { authenticate } = require('../middleware/auth')
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware')
const { body, validationResult } = require('express-validator')
const { createUploadMiddleware, handleUploadError, getFileInfo, cleanupFile, generateThumbnail } = require('../utils/fileUpload')
const { 
  validateFileAccess, 
  validateUploadPath, 
  setSecureHeaders, 
  rateLimitFiles, 
  logFileAccess 
} = require('../middleware/fileAccess')

/**
 * @route   POST /api/user/documents/upload
 * @desc    Upload document
 * @access  Private
 */
router.post('/upload',
  authenticate,
  rateLimitFiles(5, 60000), // 5 uploads per minute
  createUploadMiddleware('documents', 'document'),
  validateUploadPath,
  logFileAccess('upload'),
  [
    body('title')
      .notEmpty()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title is required and must be between 1 and 200 characters'),
    
    body('type')
      .isIn([
        'passport', 'visa', 'id-card', 'driving-license',
        'medical-report', 'dental-xray', 'prescription',
        'insurance-card', 'travel-insurance', 'vaccination-certificate',
        'blood-test', 'other'
      ])
      .withMessage('Invalid document type'),
    
    body('category')
      .isIn(['identity', 'medical', 'travel', 'insurance', 'other'])
      .withMessage('Invalid document category'),
    
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    
    body('issueDate')
      .optional()
      .isISO8601()
      .withMessage('Issue date must be a valid date'),
    
    body('expiryDate')
      .optional()
      .isISO8601()
      .withMessage('Expiry date must be a valid date'),
    
    body('tags')
      .optional()
      .custom((value) => {
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value)
            return Array.isArray(parsed)
          } catch {
            return false
          }
        }
        return Array.isArray(value)
      })
      .withMessage('Tags must be an array or valid JSON array string')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        cleanupFile(req.file.path)
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

    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400)
    }

    let { title, type, category, description, issueDate, expiryDate, tags } = req.body
    
    // Parse tags if it's a JSON string
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags)
      } catch (error) {
        tags = []
      }
    }

    try {
      // Generate thumbnail for images and PDFs
      let thumbnailPath = null
      let hasThumbnail = false
      
      if (req.file.mimetype.startsWith('image/')) {
        // Generate thumbnail for images
        const thumbnailDir = path.dirname(req.file.path)
        const thumbnailFilename = `thumb_${req.file.filename}`
        thumbnailPath = path.join(thumbnailDir, thumbnailFilename)
        
        const generatedThumbnail = await generateThumbnail(req.file.path, thumbnailPath, 300)
        if (generatedThumbnail) {
          hasThumbnail = true
        }
      }

      const document = new Document({
        userId: req.user._id,
        title,
        type,
        category,
        description,
        issueDate: issueDate ? new Date(issueDate) : undefined,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        thumbnailPath,
        hasThumbnail,
        tags: tags || []
      })

      await document.save()

      successResponse(res, {
        id: document._id,
        title: document.title,
        type: document.type,
        category: document.category,
        fileName: document.fileName,
        originalName: document.originalName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        verificationStatus: document.verificationStatus,
        fileUrl: document.fileUrl,
        isExpired: document.isExpired,
        createdAt: document.createdAt
      }, 'Document uploaded successfully')

    } catch (error) {
      // Clean up file if database save fails
      cleanupFile(req.file.path)
      throw error
    }
  })
)

/**
 * @route   GET /api/user/documents
 * @desc    Get user's documents
 * @access  Private
 */
router.get('/',
  authenticate,
  asyncHandler(async (req, res) => {
    const { category, type, status, page = 1, limit = 20 } = req.query
    
    const query = {
      userId: req.user._id,
      isDeleted: false
    }

    if (category) query.category = category
    if (type) query.type = type
    if (status) query.verificationStatus = status

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-filePath') // Don't expose file path

    const total = await Document.countDocuments(query)

    const documentsWithUrls = documents.map(doc => ({
      id: doc._id,
      title: doc.title,
      type: doc.type,
      category: doc.category,
      description: doc.description,
      fileName: doc.fileName,
      originalName: doc.originalName,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      issueDate: doc.issueDate,
      expiryDate: doc.expiryDate,
      verificationStatus: doc.verificationStatus,
      tags: doc.tags,
      fileUrl: doc.fileUrl,
      thumbnailUrl: doc.thumbnailUrl,
      hasThumbnail: doc.hasThumbnail,
      isExpired: doc.isExpired,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    }))

    successResponse(res, {
      documents: documentsWithUrls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Documents retrieved successfully')
  })
)

/**
 * @route   GET /api/user/documents/:id
 * @desc    Get specific document
 * @access  Private
 */
router.get('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    })

    if (!document) {
      return errorResponse(res, 'Document not found', 404)
    }

    successResponse(res, {
      id: document._id,
      title: document.title,
      type: document.type,
      category: document.category,
      description: document.description,
      fileName: document.fileName,
      originalName: document.originalName,
      fileSize: document.fileSize,
      mimeType: document.mimeType,
      issueDate: document.issueDate,
      expiryDate: document.expiryDate,
      verificationStatus: document.verificationStatus,
      verifiedAt: document.verifiedAt,
      rejectionReason: document.rejectionReason,
      tags: document.tags,
      fileUrl: document.fileUrl,
      isExpired: document.isExpired,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    }, 'Document retrieved successfully')
  })
)

/**
 * @route   GET /api/user/documents/:id/download
 * @desc    Download document file
 * @access  Private
 */
router.get('/:id/download',
  authenticate,
  rateLimitFiles(20, 60000), // 20 downloads per minute
  validateFileAccess,
  setSecureHeaders,
  logFileAccess('download'),
  asyncHandler(async (req, res) => {
    const document = req.document // Set by validateFileAccess middleware

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`)
    res.setHeader('Content-Type', document.mimeType)

    // Stream the file
    const fileStream = fs.createReadStream(document.filePath)
    
    fileStream.on('error', (error) => {
      console.error('File stream error:', error)
      if (!res.headersSent) {
        return errorResponse(res, 'Error reading file', 500)
      }
    })

    fileStream.pipe(res)
  })
)

/**
 * @route   GET /api/user/documents/:id/view
 * @desc    View document file in browser
 * @access  Private
 */
router.get('/:id/view',
  authenticate,
  rateLimitFiles(30, 60000), // 30 views per minute
  validateFileAccess,
  setSecureHeaders,
  logFileAccess('view'),
  asyncHandler(async (req, res) => {
    const document = req.document // Set by validateFileAccess middleware

    // Set appropriate headers for inline viewing
    res.setHeader('Content-Type', document.mimeType)
    
    // For PDFs and images, allow inline viewing
    if (document.mimeType === 'application/pdf' || document.mimeType.startsWith('image/')) {
      res.setHeader('Content-Disposition', `inline; filename="${document.originalName}"`)
    } else {
      // For other file types, force download
      res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`)
    }

    // Stream the file
    const fileStream = fs.createReadStream(document.filePath)
    
    fileStream.on('error', (error) => {
      console.error('File stream error:', error)
      if (!res.headersSent) {
        return errorResponse(res, 'Error reading file', 500)
      }
    })

    fileStream.pipe(res)
  })
)

/**
 * @route   GET /api/user/documents/:id/thumbnail
 * @desc    Get document thumbnail
 * @access  Private
 */
router.get('/:id/thumbnail',
  authenticate,
  rateLimitFiles(50, 60000), // 50 thumbnail requests per minute
  validateFileAccess,
  setSecureHeaders,
  logFileAccess('thumbnail'),
  asyncHandler(async (req, res) => {
    const document = req.document // Set by validateFileAccess middleware

    if (!document.hasThumbnail || !document.thumbnailPath) {
      return errorResponse(res, 'Thumbnail not available', 404)
    }

    // Check if thumbnail file exists
    if (!fs.existsSync(document.thumbnailPath)) {
      return errorResponse(res, 'Thumbnail file not found', 404)
    }

    // Set appropriate headers for thumbnail
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Content-Disposition', `inline; filename="thumb_${document.originalName}"`)
    res.setHeader('Cache-Control', 'public, max-age=86400') // Cache for 24 hours

    // Stream the thumbnail
    const thumbnailStream = fs.createReadStream(document.thumbnailPath)
    
    thumbnailStream.on('error', (error) => {
      console.error('Thumbnail stream error:', error)
      if (!res.headersSent) {
        return errorResponse(res, 'Error reading thumbnail', 500)
      }
    })

    thumbnailStream.pipe(res)
  })
)

/**
 * @route   PUT /api/user/documents/:id
 * @desc    Update document metadata
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
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    
    body('issueDate')
      .optional()
      .isISO8601()
      .withMessage('Issue date must be a valid date'),
    
    body('expiryDate')
      .optional()
      .isISO8601()
      .withMessage('Expiry date must be a valid date'),
    
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array')
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

    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    })

    if (!document) {
      return errorResponse(res, 'Document not found', 404)
    }

    const allowedUpdates = ['title', 'description', 'issueDate', 'expiryDate', 'tags']
    const updates = {}

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'issueDate' || field === 'expiryDate') {
          updates[field] = req.body[field] ? new Date(req.body[field]) : null
        } else {
          updates[field] = req.body[field]
        }
      }
    })

    if (Object.keys(updates).length === 0) {
      return errorResponse(res, 'No valid fields provided for update', 400)
    }

    Object.assign(document, updates)
    await document.save()

    successResponse(res, {
      id: document._id,
      title: document.title,
      type: document.type,
      category: document.category,
      description: document.description,
      issueDate: document.issueDate,
      expiryDate: document.expiryDate,
      tags: document.tags,
      isExpired: document.isExpired,
      updatedAt: document.updatedAt
    }, 'Document updated successfully')
  })
)

/**
 * @route   DELETE /api/user/documents/:id
 * @desc    Delete document (soft delete)
 * @access  Private
 */
router.delete('/:id',
  authenticate,
  rateLimitFiles(10, 60000), // 10 deletes per minute
  logFileAccess('delete'),
  asyncHandler(async (req, res) => {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    })

    if (!document) {
      return errorResponse(res, 'Document not found', 404)
    }

    document.isDeleted = true
    document.deletedAt = new Date()
    await document.save()

    successResponse(res, { message: 'Document deleted successfully' }, 'Document deleted successfully')
  })
)

/**
 * @route   POST /api/user/documents/:id/share
 * @desc    Share document with others
 * @access  Private
 */
router.post('/:id/share',
  authenticate,
  [
    body('recipientEmail')
      .isEmail()
      .withMessage('Valid recipient email is required'),
    
    body('recipientName')
      .notEmpty()
      .withMessage('Recipient name is required'),
    
    body('permissions')
      .optional()
      .isIn(['view', 'download'])
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

    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    })

    if (!document) {
      return errorResponse(res, 'Document not found', 404)
    }

    const { recipientEmail, recipientName, permissions = 'view', expiresAt } = req.body

    const shareData = {
      recipientEmail,
      recipientName,
      permissions,
      sharedAt: new Date()
    }

    if (expiresAt) {
      shareData.expiresAt = new Date(expiresAt)
    }

    document.sharedWith.push(shareData)
    document.isShared = true
    await document.save()

    // TODO: Send email notification to recipient

    successResponse(res, {
      message: 'Document shared successfully',
      shareId: document.sharedWith[document.sharedWith.length - 1]._id
    }, 'Document shared successfully')
  })
)

/**
 * @route   GET /api/user/documents/categories/summary
 * @desc    Get document summary by categories
 * @access  Private
 */
router.get('/categories/summary',
  authenticate,
  asyncHandler(async (req, res) => {
    const summary = await Document.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          isDeleted: false
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          verified: {
            $sum: {
              $cond: [{ $eq: ['$verificationStatus', 'verified'] }, 1, 0]
            }
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$verificationStatus', 'pending'] }, 1, 0]
            }
          },
          expired: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$expiryDate', null] },
                    { $lt: ['$expiryDate', new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])

    const totalDocuments = await Document.countDocuments({
      userId: req.user._id,
      isDeleted: false
    })

    successResponse(res, {
      summary,
      totalDocuments
    }, 'Document summary retrieved successfully')
  })
)

// Error handling middleware
router.use(handleUploadError)

module.exports = router