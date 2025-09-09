const path = require('path')
const fs = require('fs')
const Document = require('../models/Document')
const { errorResponse } = require('./errorMiddleware')
const { uploadConfig } = require('../config/uploads')

/**
 * Middleware to validate file access permissions
 * Ensures users can only access their own files
 */
const validateFileAccess = async (req, res, next) => {
  try {
    const { id: documentId } = req.params
    const userId = req.user._id

    // Find the document and verify ownership
    const document = await Document.findOne({
      _id: documentId,
      isDeleted: false
    })

    if (!document) {
      return errorResponse(res, 'Document not found', 404)
    }

    // Check if user can access this document
    if (!document.canAccess(userId)) {
      return errorResponse(res, 'Access denied', 403)
    }

    // Verify file exists on disk
    if (!fs.existsSync(document.filePath)) {
      return errorResponse(res, 'File not found on server', 404)
    }

    // Add document to request for use in route handler
    req.document = document
    next()

  } catch (error) {
    console.error('File access validation error:', error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

/**
 * Middleware to validate file upload paths
 * Prevents directory traversal attacks
 */
const validateUploadPath = (req, res, next) => {
  if (req.file) {
    const filePath = req.file.path
    const resolvedPath = path.resolve(filePath)
    const resolvedBaseDir = path.resolve(uploadConfig.baseDir)

    // Ensure file is within secure uploads directory
    if (!resolvedPath.startsWith(resolvedBaseDir)) {
      // Clean up the invalid file
      try {
        fs.unlinkSync(filePath)
      } catch (err) {
        console.error('Failed to cleanup invalid file:', err)
      }
      return errorResponse(res, 'Invalid file path', 400)
    }

    // Ensure file is in user's directory
    const uploadType = req.uploadType || 'documents'
    const userDir = path.join(uploadConfig.directories[uploadType], req.user._id.toString())
    const resolvedUserDir = path.resolve(userDir)
    
    if (!resolvedPath.startsWith(resolvedUserDir)) {
      // Clean up the invalid file
      try {
        fs.unlinkSync(filePath)
      } catch (err) {
        console.error('Failed to cleanup invalid file:', err)
      }
      return errorResponse(res, 'Invalid file location', 400)
    }
  }

  next()
}

/**
 * Middleware to set secure headers for file downloads
 */
const setSecureHeaders = (req, res, next) => {
  // Prevent caching of sensitive documents
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  
  next()
}

/**
 * Rate limiting for file operations
 */
const rateLimitFiles = (maxRequests = 10, windowMs = 60000) => {
  const requests = new Map()

  return (req, res, next) => {
    const userId = req.user._id.toString()
    const now = Date.now()
    const windowStart = now - windowMs

    // Clean up old entries
    for (const [key, timestamps] of requests.entries()) {
      requests.set(key, timestamps.filter(time => time > windowStart))
      if (requests.get(key).length === 0) {
        requests.delete(key)
      }
    }

    // Check current user's requests
    const userRequests = requests.get(userId) || []
    
    if (userRequests.length >= maxRequests) {
      return errorResponse(res, 'Too many file requests. Please try again later.', 429)
    }

    // Add current request
    userRequests.push(now)
    requests.set(userId, userRequests)

    next()
  }
}

/**
 * Log file access for audit purposes
 */
const logFileAccess = (action = 'access') => {
  return (req, res, next) => {
    const userId = req.user._id
    const documentId = req.params.id
    const userAgent = req.get('User-Agent')
    const ip = req.ip || req.connection.remoteAddress

    console.log(`File ${action}:`, {
      userId,
      documentId,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    })

    // In production, you might want to store this in a separate audit log
    // await AuditLog.create({ userId, action, documentId, ip, userAgent })

    next()
  }
}

module.exports = {
  validateFileAccess,
  validateUploadPath,
  setSecureHeaders,
  rateLimitFiles,
  logFileAccess
}