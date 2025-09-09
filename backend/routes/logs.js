const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/auth')
const { asyncHandler, successResponse, errorResponse } = require('../middleware/errorMiddleware')
const { getLogs, clearLogs, getAllLogs } = require('../utils/logger')

/**
 * @route   GET /api/logs
 * @desc    Get application logs
 * @access  Private
 */
router.get('/',
  authenticate,
  asyncHandler(async (req, res) => {
    const { level, limit = 100 } = req.query
    
    const logs = getLogs(level, limit)
    
    successResponse(res, {
      logs: logs,
      total: logs.length,
      showing: logs.length
    }, 'Logs retrieved successfully')
  })
)

/**
 * @route   DELETE /api/logs
 * @desc    Clear all logs
 * @access  Private
 */
router.delete('/',
  authenticate,
  asyncHandler(async (req, res) => {
    clearLogs()
    successResponse(res, { message: 'Logs cleared successfully' }, 'Logs cleared')
  })
)

/**
 * @route   GET /api/logs/stream
 * @desc    Stream logs in real-time using Server-Sent Events
 * @access  Private
 */
router.get('/stream',
  authenticate,
  (req, res) => {
    // Set headers for Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    })

    // Send initial logs
    const allLogs = getAllLogs()
    res.write(`data: ${JSON.stringify({ type: 'initial', logs: allLogs.slice(0, 50) })}\n\n`)

    // Keep connection alive
    const heartbeat = setInterval(() => {
      res.write(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: new Date().toISOString() })}\n\n`)
    }, 30000)

    // Store original logs length to detect new logs
    let lastLogCount = allLogs.length

    // Check for new logs every second
    const logChecker = setInterval(() => {
      const currentLogs = getAllLogs()
      if (currentLogs.length > lastLogCount) {
        const newLogs = currentLogs.slice(0, currentLogs.length - lastLogCount)
        res.write(`data: ${JSON.stringify({ type: 'new', logs: newLogs })}\n\n`)
        lastLogCount = currentLogs.length
      }
    }, 1000)

    // Clean up on client disconnect
    req.on('close', () => {
      clearInterval(heartbeat)
      clearInterval(logChecker)
    })
  }
)

module.exports = router