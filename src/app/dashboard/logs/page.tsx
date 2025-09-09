'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'

interface LogEntry {
  id: string
  timestamp: string
  level: string
  message: string
  data?: string
}

interface LogsResponse {
  logs: LogEntry[]
  total: number
  showing: number
}

const LogsPage = () => {
  const { token } = useAuth()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const logsEndRef = useRef<HTMLDivElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchLogs = useCallback(async () => {
    if (!token) return

    try {
      setLoading(true)
      const url = selectedLevel === 'all' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/logs?limit=200`
        : `${process.env.NEXT_PUBLIC_API_URL}/logs?level=${selectedLevel}&limit=200`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: { data: LogsResponse } = await response.json()
      setLogs(data.data.logs)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs')
    } finally {
      setLoading(false)
    }
  }, [token, selectedLevel])

  const clearLogs = async () => {
    if (!token) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setLogs([])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear logs')
    }
  }

  const connectToLogStream = () => {
    if (!token || eventSourceRef.current) return

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/logs/stream?token=${encodeURIComponent(token)}`
    )

    eventSource.onopen = () => {
      setIsConnected(true)
      setError(null)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.type === 'initial') {
          setLogs(data.logs)
        } else if (data.type === 'new') {
          setLogs(prevLogs => [...data.logs, ...prevLogs])
          if (autoRefresh) {
            setTimeout(scrollToBottom, 100)
          }
        }
      } catch (err) {
        console.error('Error parsing SSE data:', err)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
      setError('Connection to log stream lost')
      eventSource.close()
      eventSourceRef.current = null
    }

    eventSourceRef.current = eventSource
  }

  const disconnectFromLogStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
      setIsConnected(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchLogs()
    }
  }, [token, fetchLogs])

  useEffect(() => {
    return () => {
      disconnectFromLogStream()
    }
  }, [])

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'text-red-600 bg-red-50'
      case 'warn':
      case 'warning':
        return 'text-yellow-600 bg-yellow-50'
      case 'info':
        return 'text-blue-600 bg-blue-50'
      case 'debug':
        return 'text-gray-600 bg-gray-50'
      case 'success':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatData = (data: string | null) => {
    if (!data) return null
    try {
      const parsed = JSON.parse(data)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return data
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Application Logs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor backend application logs in real-time
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Level Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Level:
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All</option>
                <option value="error">Error</option>
                <option value="warn">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
                <option value="success">Success</option>
              </select>
            </div>

            {/* Auto Refresh Toggle */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto Scroll:
              </label>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-auto">
              <ButtonSecondary
                onClick={fetchLogs}
                disabled={loading}
                className="text-sm px-3 py-1"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </ButtonSecondary>
              
              {!isConnected ? (
                <ButtonPrimary
                  onClick={connectToLogStream}
                  className="text-sm px-3 py-1"
                >
                  Connect Live
                </ButtonPrimary>
              ) : (
                <ButtonSecondary
                  onClick={disconnectFromLogStream}
                  className="text-sm px-3 py-1"
                >
                  Disconnect
                </ButtonSecondary>
              )}

              <ButtonSecondary
                onClick={clearLogs}
                className="text-sm px-3 py-1 text-red-600 hover:text-red-700"
              >
                Clear Logs
              </ButtonSecondary>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Logs Display */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Logs ({logs.length})
            </h2>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading && logs.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Loading logs...
              </div>
            ) : logs.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No logs available
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-start gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {log.message}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </div>
                        {log.data && (
                          <pre className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded mt-2 overflow-x-auto">
                            {formatData(log.data)}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogsPage