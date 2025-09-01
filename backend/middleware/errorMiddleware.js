/**
 * 404 Not Found middleware
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 server error
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404
    message = 'Resource not found'
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyPattern)[0]
    message = `User already exists with this ${field}`
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    const errors = {}
    
    Object.values(err.errors).forEach(error => {
      const field = error.path
      if (!errors[field]) {
        errors[field] = []
      }
      errors[field].push(error.message)
    })
    
    return res.status(statusCode).json({
      success: false,
      message: 'Validation failed',
      errors
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  }

  // Rate limit error
  if (err.status === 429) {
    statusCode = 429
    message = 'Too many requests, please try again later'
  }

  const response = {
    success: false,
    message,
    error: message
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack
    console.error('Error:', err)
  }

  res.status(statusCode).json(response)
}

/**
 * Async error handler wrapper
 * Wraps async route handlers to catch errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Success response helper
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  })
}

/**
 * Error response helper
 */
const errorResponse = (res, message, statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message,
    error: message
  }

  if (errors) {
    response.errors = errors
  }

  return res.status(statusCode).json(response)
}

module.exports = {
  notFound,
  errorHandler,
  asyncHandler,
  ApiError,
  successResponse,
  errorResponse
}