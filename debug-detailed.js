const mongoose = require('mongoose')
require('dotenv').config({ path: './backend/.env' })

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prodance')

// Import User model
const User = require('./backend/models/User')

async function debugDetailed() {
  try {
    console.log('🔍 Detailed debugging for phone number: +91 8768768765')
    
    const identifier = '+918768768765'
    console.log('📱 Full identifier:', identifier)
    
    // Test the regex parsing manually
    const match = identifier.match(/^(\+\d+)(.+)$/)
    if (match) {
      const [, countryCode, phone] = match
      console.log('🔧 Parsed values:')
      console.log('  - Country Code:', countryCode)
      console.log('  - Phone:', phone)
      
      // Try direct database query
      console.log('\n🔍 Direct database query:')
      const directUser = await User.findOne({ phone, countryCode })
      console.log('👤 Direct query result:', directUser ? 'FOUND' : 'NOT FOUND')
      
      if (directUser) {
        console.log('📋 Direct query user details:')
        console.log('  - ID:', directUser._id)
        console.log('  - Name:', directUser.getFullName())
        console.log('  - Phone:', directUser.phone)
        console.log('  - Country Code:', directUser.countryCode)
      }
    }
    
    // Test the findByIdentifier method
    console.log('\n🔍 Testing findByIdentifier method:')
    const user = await User.findByIdentifier(identifier, 'phone')
    console.log('👤 findByIdentifier result:', user ? 'FOUND' : 'NOT FOUND')
    
    if (user) {
      console.log('📋 findByIdentifier user details:')
      console.log('  - ID:', user._id)
      console.log('  - Name:', user.getFullName())
      console.log('  - Phone:', user.phone)
      console.log('  - Country Code:', user.countryCode)
    }
    
    // Check the exact user from database
    console.log('\n🔍 Looking for user with exact phone "8768768765":')
    const exactUser = await User.findOne({ phone: "8768768765" })
    console.log('👤 Exact phone search:', exactUser ? 'FOUND' : 'NOT FOUND')
    
    if (exactUser) {
      console.log('📋 Exact user details:')
      console.log('  - ID:', exactUser._id)
      console.log('  - Name:', exactUser.getFullName())
      console.log('  - Phone:', `"${exactUser.phone}"`)
      console.log('  - Country Code:', `"${exactUser.countryCode}"`)
      console.log('  - Phone type:', typeof exactUser.phone)
      console.log('  - Country Code type:', typeof exactUser.countryCode)
    }
    
    // Check all users to see the data structure
    console.log('\n📊 All users in database:')
    const allUsers = await User.find({})
    console.log(`Total users: ${allUsers.length}`)
    allUsers.forEach((u, index) => {
      console.log(`  ${index + 1}. ${u.getFullName()} - Phone: "${u.phone}" - CC: "${u.countryCode}"`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    mongoose.connection.close()
  }
}

debugDetailed()