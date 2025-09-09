require('dotenv').config()
console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'Yes' : 'No')

const mongoose = require('mongoose')
const { generateTokenPair } = require('../lib/jwt')
const User = require('../models/User')

async function testLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prodense')
    console.log('Connected to MongoDB')

    // Find a user
    const user = await User.findOne()
    if (!user) {
      console.log('No users found')
      return
    }

    console.log(`Found user: ${user.email}`)
    console.log(`User ID: ${user._id}`)

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user)
    
    console.log('\nGenerated tokens:')
    console.log('Access Token:', accessToken)
    console.log('Refresh Token:', refreshToken)

    // Test the notifications API
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
    
    try {
      const response = await fetch('http://localhost:5001/api/notifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      console.log('\nAPI Response:')
      console.log('Status:', response.status)
      console.log('Data:', JSON.stringify(data, null, 2))
    } catch (apiError) {
      console.error('API Error:', apiError.message)
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

testLogin()