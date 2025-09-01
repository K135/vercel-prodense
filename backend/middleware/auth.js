const { verifyToken, extractToken } = require('../lib/jwt')
const User = require('../models/User')

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = extractToken(authHeader)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        error: 'No token provided'
      })
    }

    // Verify token
    const decoded = verifyToken(token)
    
    // Check if token type is access token
    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type',
        error: 'Invalid token type'
      })
    }

    // Fetch user from database
    const user = await User.findById(decoded.userId).select('-__v')
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
        error: 'User not found'
      })
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
        error: 'Account deactivated'
      })
    }

    // Attach user and token payload to request
    req.user = user
    req.tokenPayload = decoded
    
    next()
  } catch (error) {
    console.error('Authentication error:', error.message)
    
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid token',
      error: error.message || 'Authentication failed'
    })
  }
}

/**
 * Optional authentication middleware
 * Attaches user to request if token is valid, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = extractToken(authHeader)

    if (!token) {
      return next()
    }

    const decoded = verifyToken(token)
    
    if (decoded.type === 'access') {
      const user = await User.findById(decoded.userId).select('-__v')
      
      if (user && user.isActive) {
        req.user = user
        req.tokenPayload = decoded
      }
    }
    
    next()
  } catch (error) {
    // Silently fail for optional auth
    next()
  }
}

/**
 * Role-based authorization middleware
 * @param {Array} roles - Array of allowed roles
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'Not authenticated'
      })
    }

    // If no roles specified, just check if user is authenticated
    if (roles.length === 0) {
      return next()
    }

    // Check if user has required role (for future use)
    const userRole = req.user.role || 'user'
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        error: 'Access denied'
      })
    }

    next()
  }
}

/**
 * Refresh token middleware
 * Validates refresh token for token refresh endpoint
 */
const validateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required',
        error: 'No refresh token provided'
      })
    }

    const decoded = verifyToken(refreshToken)
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type',
        error: 'Invalid refresh token'
      })
    }

    const user = await User.findById(decoded.userId).select('-__v')
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive',
        error: 'Invalid refresh token'
      })
    }

    req.user = user
    req.tokenPayload = decoded
    
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid refresh token',
      error: error.message || 'Refresh token validation failed'
    })
  }
}

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  validateRefreshToken
}