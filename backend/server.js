const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const connectDB = require('./config/database')
const { initializeUploadDirectories } = require('./config/uploads')
const authRoutes = require('./routes/auth')
const logsRoutes = require('./routes/logs')
const userRoutes = require('./routes/user')
const documentsRoutes = require('./routes/documents')
const healthProfileRoutes = require('./routes/healthProfile')
const dentistRoutes = require('./routes/dentists')
const bookingRoutes = require('./routes/bookings')
const billingRoutes = require('./routes/billing')
const itineraryRoutes = require('./routes/itinerary')
const reportRoutes = require('./routes/reports')
const costEstimatorRoutes = require('./routes/costEstimator')
const loyaltyRoutes = require('./routes/loyalty')
const notificationRoutes = require('./routes/notifications')
const aiRoutes = require('./routes/ai')
const continuityRoutes = require('./routes/continuity')
const errorRoutes = require('./routes/error')
const { errorHandler, notFound } = require('./middleware/errorMiddleware')
const { addLog } = require('./utils/logger')

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Initialize secure upload directories
initializeUploadDirectories()

// Add initial logs
addLog('info', 'Backend server starting up')
addLog('info', 'Environment configuration loaded', {
  nodeEnv: process.env.NODE_ENV,
  port: PORT,
  frontendUrl: process.env.FRONTEND_URL
})

// Security middleware
app.use(helmet())

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3005',
    'http://localhost:3004',
    'http://localhost:3003',
    'http://localhost:3002',
    'http://localhost:3001',
    'http://localhost:3000'

  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Rate limiting - more lenient in development
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' 
    ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 50000 // Very high limit for development
    : parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5000, // Normal limit for production
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    error: 'Rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks in development
    return process.env.NODE_ENV === 'development' && req.path === '/api/health'
  }
})

app.use('/api/', limiter)

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    }
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/logs', logsRoutes)
app.use('/api/user', userRoutes)
app.use('/api/user/documents', documentsRoutes)

app.use('/api/user', healthProfileRoutes)

app.use('/api/dentists', dentistRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/billing', billingRoutes)
app.use('/api/itinerary', itineraryRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/cost-estimator', costEstimatorRoutes)
app.use('/api/loyalty', loyaltyRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/continuity', continuityRoutes)
app.use('/api/error', errorRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Prodance API',
    data: {
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        logs: '/api/logs',
        user: '/api/user',
        dentists: '/api/dentists',
        bookings: '/api/bookings',
        billing: '/api/billing',
        itinerary: '/api/itinerary',
        reports: '/api/reports',
        costEstimator: '/api/cost-estimator',
        loyalty: '/api/loyalty',
        notifications: '/api/notifications',
        ai: '/api/ai',
        continuity: '/api/continuity',
        error: '/api/error'
      }
    }
  })
})

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`)
  console.log(`📱 API Base URL: http://localhost:${PORT}/api`)
  
  addLog('success', 'Backend server started successfully', {
    port: PORT,
    environment: process.env.NODE_ENV,
    apiBaseUrl: `http://localhost:${PORT}/api`
  })
})