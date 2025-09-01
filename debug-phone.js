const mongoose = require('mongoose')
require('dotenv').config({ path: './backend/.env' })

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prodance')

// Import User model
const User = require('./backend/models/User')

async function debugPhoneNumber() {
  try {
    console.log('🔍 Debugging phone number: +91 8768768765')
    
    const identifier = '+918768768765'
    console.log('📱 Full identifier:', identifier)
    
    // Test the findByIdentifier method
    const user = await User.findByIdentifier(identifier, 'phone')
    console.log('👤 User found:', user ? 'YES' : 'NO')
    
    if (user) {
      console.log('📋 User details:')
      console.log('  - ID:', user._id)
      console.log('  - Name:', user.getFullName())
      console.log('  - Phone:', user.phone)
      console.log('  - Country Code:', user.countryCode)
      console.log('  - Email:', user.email)
      console.log('  - Phone Verified:', user.isPhoneVerified)
      console.log('  - Email Verified:', user.isEmailVerified)
      console.log('  - Created:', user.createdAt)
    }
    
    // Also check all users with similar phone numbers
    console.log('\n🔍 Checking all users with phone containing "8768768765":')
    const similarUsers = await User.find({ 
      phone: { $regex: '8768768765' }
    })
    
    console.log(`Found ${similarUsers.length} users with similar phone numbers:`)
    similarUsers.forEach((u, index) => {
      console.log(`  ${index + 1}. ${u.getFullName()} - ${u.countryCode}${u.phone}`)
    })
    
    // Check all users to see the data structure
    console.log('\n📊 All users in database:')
    const allUsers = await User.find({}).limit(10)
    console.log(`Total users: ${allUsers.length}`)
    allUsers.forEach((u, index) => {
      console.log(`  ${index + 1}. ${u.getFullName()} - Phone: ${u.countryCode || 'N/A'}${u.phone || 'N/A'} - Email: ${u.email || 'N/A'}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    mongoose.connection.close()
  }
}

debugPhoneNumber()