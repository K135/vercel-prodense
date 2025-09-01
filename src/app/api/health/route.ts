import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import { successResponse, serverErrorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await connectDB()
    
    return successResponse(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        environment: process.env.NODE_ENV || 'development'
      },
      'API is healthy'
    )
  } catch (error) {
    console.error('Health check failed:', error)
    return serverErrorResponse('Database connection failed')
  }
}