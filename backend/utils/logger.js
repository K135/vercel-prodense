// In-memory log storage (in production, you'd use a proper logging service)
let logs = []
const MAX_LOGS = 1000 // Keep only the last 1000 logs

// Function to add log entry
function addLog(level, message, data = null) {
  const logEntry = {
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
    level,
    message,
    data: data ? JSON.stringify(data, null, 2) : null
  }
  
  logs.unshift(logEntry) // Add to beginning
  
  // Keep only the last MAX_LOGS entries
  if (logs.length > MAX_LOGS) {
    logs = logs.slice(0, MAX_LOGS)
  }
  
  // Also log to console for terminal viewing
  console.log(`[${logEntry.timestamp}] ${level.toUpperCase()}: ${message}`, data || '')
}

// Function to get logs
function getLogs(level = null, limit = 100) {
  let filteredLogs = logs
  
  // Filter by log level if specified
  if (level) {
    filteredLogs = logs.filter(log => log.level.toLowerCase() === level.toLowerCase())
  }
  
  // Limit the number of logs returned
  return filteredLogs.slice(0, parseInt(limit))
}

// Function to clear logs
function clearLogs() {
  logs = []
}

// Function to get all logs (for streaming)
function getAllLogs() {
  return logs
}

// Add some initial logs
addLog('info', 'Logger system initialized')

module.exports = {
  addLog,
  getLogs,
  clearLogs,
  getAllLogs
}