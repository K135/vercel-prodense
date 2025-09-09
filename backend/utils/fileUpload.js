const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const mime = require('mime-types')
const sharp = require('sharp')
const { 
  uploadConfig, 
  createUserDirectory, 
  setSecureFilePermissions,
  validateFilePath 
} = require('../config/uploads')

// File type configurations
const fileTypes = {
  documents: {
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    maxSize: 10 * 1024 * 1024, // 10MB
    destination: uploadConfig.directories.documents
  },
  reports: {
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/dicom', // Medical imaging format
      'text/plain'
    ],
    maxSize: 50 * 1024 * 1024, // 50MB for medical files
    destination: uploadConfig.directories.reports
  },
  profiles: {
    allowedTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ],
    maxSize: 5 * 1024 * 1024, // 5MB
    destination: uploadConfig.directories.profiles
  }
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const uploadType = req.uploadType || 'documents'
      
      if (!req.user || !req.user._id) {
        return cb(new Error('User authentication required for file upload'))
      }

      // Create user-specific directory for security
      const userDir = createUserDirectory(req.user._id, uploadType)
      
      // Validate the path for security
      if (!validateFilePath(userDir)) {
        return cb(new Error('Invalid upload path'))
      }
      
      cb(null, userDir)
    } catch (error) {
      cb(error)
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4()
    const timestamp = Date.now()
    const ext = path.extname(file.originalname)
    const filename = `${timestamp}_${uniqueSuffix}${ext}`
    cb(null, filename)
  }
})

// File filter function
const fileFilter = (req, file, cb) => {
  const uploadType = req.uploadType || 'documents'
  const config = fileTypes[uploadType]
  
  if (config.allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${config.allowedTypes.join(', ')}`), false)
  }
}

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // Max 50MB (will be overridden by middleware)
  }
})

// Middleware to set upload type and limits
const setUploadConfig = (uploadType) => {
  return (req, res, next) => {
    req.uploadType = uploadType
    const config = fileTypes[uploadType]
    
    if (config) {
      req.maxFileSize = config.maxSize
    }
    
    next()
  }
}

// File validation middleware
const validateFile = (req, res, next) => {
  if (!req.file && !req.files) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
      error: 'FILE_REQUIRED'
    })
  }
  
  const files = req.files || [req.file]
  const uploadType = req.uploadType || 'documents'
  const config = fileTypes[uploadType]
  
  for (const file of files) {
    // Check file size
    if (file.size > config.maxSize) {
      return res.status(400).json({
        success: false,
        message: `File size too large. Maximum allowed: ${config.maxSize / (1024 * 1024)}MB`,
        error: 'FILE_TOO_LARGE'
      })
    }
    
    // Check file type
    if (!config.allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: ${config.allowedTypes.join(', ')}`,
        error: 'INVALID_FILE_TYPE'
      })
    }

    // Set secure file permissions
    if (file.path) {
      setSecureFilePermissions(file.path)
    }
  }
  
  next()
}

// Image processing middleware
const processImage = async (req, res, next) => {
  if (!req.file || !req.file.mimetype.startsWith('image/')) {
    return next()
  }
  
  try {
    const inputPath = req.file.path
    const outputPath = inputPath.replace(/\.[^/.]+$/, '_processed.jpg')
    
    // Process image with sharp
    await sharp(inputPath)
      .resize(1920, 1080, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 85,
        progressive: true 
      })
      .toFile(outputPath)
    
    // Update file info
    const stats = fs.statSync(outputPath)
    req.file.processedPath = outputPath
    req.file.processedSize = stats.size
    req.file.isProcessed = true
    
    next()
  } catch (error) {
    console.error('Image processing error:', error)
    next() // Continue without processing if there's an error
  }
}

// Generate thumbnail for images
const generateThumbnail = async (filePath, outputPath, size = 300) => {
  try {
    await sharp(filePath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath)
    
    return outputPath
  } catch (error) {
    console.error('Thumbnail generation error:', error)
    return null
  }
}

// File cleanup utility
const cleanupFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return true
    }
  } catch (error) {
    console.error('File cleanup error:', error)
  }
  return false
}

// Get file info
const getFileInfo = (filePath) => {
  try {
    const stats = fs.statSync(filePath)
    const ext = path.extname(filePath)
    const mimeType = mime.lookup(filePath) || 'application/octet-stream'
    
    return {
      size: stats.size,
      extension: ext,
      mimeType: mimeType,
      created: stats.birthtime,
      modified: stats.mtime,
      isImage: mimeType.startsWith('image/'),
      isPDF: mimeType === 'application/pdf',
      isDocument: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ].includes(mimeType)
    }
  } catch (error) {
    console.error('Get file info error:', error)
    return null
  }
}

// Virus scanning placeholder (implement with actual antivirus solution)
const scanFile = async (filePath) => {
  // Placeholder for virus scanning
  // In production, integrate with ClamAV or similar
  return { isClean: true, scanResult: 'clean' }
}

// File upload middleware factory
const createUploadMiddleware = (uploadType, fieldName = 'file', multiple = false) => {
  const middleware = [
    setUploadConfig(uploadType),
    multiple ? upload.array(fieldName, 10) : upload.single(fieldName),
    validateFile
  ]
  
  if (uploadType === 'profiles') {
    middleware.push(processImage)
  }
  
  return middleware
}

// Error handler for multer errors
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    let message = 'File upload error'
    let errorCode = 'UPLOAD_ERROR'
    
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File too large'
        errorCode = 'FILE_TOO_LARGE'
        break
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files'
        errorCode = 'TOO_MANY_FILES'
        break
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field'
        errorCode = 'UNEXPECTED_FILE'
        break
    }
    
    return res.status(400).json({
      success: false,
      message,
      error: errorCode
    })
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message,
      error: 'INVALID_FILE_TYPE'
    })
  }
  
  next(error)
}

module.exports = {
  upload,
  setUploadConfig,
  validateFile,
  processImage,
  generateThumbnail,
  cleanupFile,
  getFileInfo,
  scanFile,
  createUploadMiddleware,
  handleUploadError,
  fileTypes
}