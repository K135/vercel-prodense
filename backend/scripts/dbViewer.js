#!/usr/bin/env node

/**
 * Simple MongoDB Database Viewer
 * Interactive command-line tool to browse your database
 */

const mongoose = require('mongoose')
const readline = require('readline')

// Models
const User = require('../models/User')
const Dentist = require('../models/Dentist')
const Booking = require('../models/Booking')
const Notification = require('../models/Notification')

const MONGODB_URI = 'mongodb://localhost:27017/prodance'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}

async function showMenu() {
  console.log('\n📊 MongoDB Database Viewer')
  console.log('==========================')
  console.log('1. Show all collections')
  console.log('2. View users')
  console.log('3. View dentists')
  console.log('4. View bookings')
  console.log('5. View notifications')
  console.log('6. Search users by email')
  console.log('7. Search dentists by city')
  console.log('8. Show database stats')
  console.log('9. Exit')
  console.log('==========================')
}

async function showCollections() {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log('\n📋 Collections in database:')
    
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments()
      console.log(`  ${collection.name}: ${count} documents`)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

async function viewUsers() {
  try {
    const users = await User.find({}, 'firstName lastName email phone role createdAt').limit(10)
    console.log('\n👥 Users (showing first 10):')
    console.log('================================')
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Phone: ${user.phone || 'N/A'}`)
      console.log(`   Role: ${user.role || 'user'}`)
      console.log(`   Joined: ${user.createdAt?.toLocaleDateString() || 'N/A'}`)
      console.log('   ---')
    })
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

async function viewDentists() {
  try {
    const dentists = await Dentist.find({}, 'firstName lastName email specializations experience rating consultationFee').limit(10)
    console.log('\n🦷 Dentists (showing first 10):')
    console.log('=================================')
    
    dentists.forEach((dentist, index) => {
      console.log(`${index + 1}. Dr. ${dentist.firstName} ${dentist.lastName}`)
      console.log(`   Email: ${dentist.email}`)
      console.log(`   Specializations: ${dentist.specializations?.join(', ') || 'N/A'}`)
      console.log(`   Experience: ${dentist.experience} years`)
      console.log(`   Rating: ${dentist.rating?.average || 'N/A'}/5`)
      console.log(`   Consultation Fee: ₹${dentist.consultationFee?.amount || 'N/A'}`)
      console.log('   ---')
    })
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

async function viewBookings() {
  try {
    const bookings = await Booking.find({})
      .populate('userId', 'firstName lastName email')
      .populate('dentistId', 'firstName lastName')
      .limit(10)
    
    console.log('\n📅 Bookings (showing first 10):')
    console.log('=================================')
    
    bookings.forEach((booking, index) => {
      console.log(`${index + 1}. Booking #${booking.bookingNumber || booking._id}`)
      console.log(`   Patient: ${booking.userId?.firstName} ${booking.userId?.lastName}`)
      console.log(`   Dentist: Dr. ${booking.dentistId?.firstName} ${booking.dentistId?.lastName}`)
      console.log(`   Treatment: ${booking.treatmentType}`)
      console.log(`   Date: ${booking.appointmentDate?.toLocaleDateString()}`)
      console.log(`   Time: ${booking.appointmentTime}`)
      console.log(`   Status: ${booking.status}`)
      console.log(`   Cost: ₹${booking.estimatedCost?.amount || 'N/A'}`)
      console.log('   ---')
    })
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

async function viewNotifications() {
  try {
    const notifications = await Notification.find({})
      .populate('userId', 'firstName lastName')
      .limit(10)
      .sort({ createdAt: -1 })
    
    console.log('\n🔔 Notifications (showing latest 10):')
    console.log('======================================')
    
    notifications.forEach((notification, index) => {
      console.log(`${index + 1}. ${notification.title}`)
      console.log(`   User: ${notification.userId?.firstName} ${notification.userId?.lastName}`)
      console.log(`   Message: ${notification.message}`)
      console.log(`   Type: ${notification.type}`)
      console.log(`   Read: ${notification.isRead ? 'Yes' : 'No'}`)
      console.log(`   Date: ${notification.createdAt?.toLocaleString()}`)
      console.log('   ---')
    })
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

async function searchUsersByEmail() {
  return new Promise((resolve) => {
    rl.question('\n🔍 Enter email to search: ', async (email) => {
      try {
        const users = await User.find({ 
          email: { $regex: email, $options: 'i' } 
        }, 'firstName lastName email phone role')
        
        if (users.length === 0) {
          console.log('❌ No users found with that email')
        } else {
          console.log(`\n✅ Found ${users.length} user(s):`)
          users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`)
          })
        }
      } catch (error) {
        console.error('❌ Error:', error.message)
      }
      resolve()
    })
  })
}

async function searchDentistsByCity() {
  return new Promise((resolve) => {
    rl.question('\n🔍 Enter city to search: ', async (city) => {
      try {
        const dentists = await Dentist.find({ 
          'clinics.address.city': { $regex: city, $options: 'i' } 
        }, 'firstName lastName email clinics.address.city')
        
        if (dentists.length === 0) {
          console.log('❌ No dentists found in that city')
        } else {
          console.log(`\n✅ Found ${dentists.length} dentist(s):`)
          dentists.forEach((dentist, index) => {
            const cities = dentist.clinics?.map(c => c.address?.city).filter(Boolean).join(', ')
            console.log(`${index + 1}. Dr. ${dentist.firstName} ${dentist.lastName} - ${cities}`)
          })
        }
      } catch (error) {
        console.error('❌ Error:', error.message)
      }
      resolve()
    })
  })
}

async function showStats() {
  try {
    const stats = await mongoose.connection.db.stats()
    const userCount = await User.countDocuments()
    const dentistCount = await Dentist.countDocuments()
    const bookingCount = await Booking.countDocuments()
    const notificationCount = await Notification.countDocuments()
    
    console.log('\n📊 Database Statistics:')
    console.log('========================')
    console.log(`Database: ${stats.db}`)
    console.log(`Collections: ${stats.collections}`)
    console.log(`Total Documents: ${stats.objects}`)
    console.log(`Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`)
    console.log(`Storage Size: ${(stats.storageSize / 1024).toFixed(2)} KB`)
    console.log('')
    console.log('Document Counts:')
    console.log(`  Users: ${userCount}`)
    console.log(`  Dentists: ${dentistCount}`)
    console.log(`  Bookings: ${bookingCount}`)
    console.log(`  Notifications: ${notificationCount}`)
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

async function handleChoice(choice) {
  switch (choice) {
    case '1':
      await showCollections()
      break
    case '2':
      await viewUsers()
      break
    case '3':
      await viewDentists()
      break
    case '4':
      await viewBookings()
      break
    case '5':
      await viewNotifications()
      break
    case '6':
      await searchUsersByEmail()
      break
    case '7':
      await searchDentistsByCity()
      break
    case '8':
      await showStats()
      break
    case '9':
      console.log('👋 Goodbye!')
      await mongoose.connection.close()
      rl.close()
      process.exit(0)
    default:
      console.log('❌ Invalid choice. Please try again.')
  }
}

async function main() {
  await connectDB()
  
  console.log('🚀 Welcome to MongoDB Database Viewer!')
  
  while (true) {
    await showMenu()
    
    const choice = await new Promise((resolve) => {
      rl.question('\nEnter your choice (1-9): ', resolve)
    })
    
    await handleChoice(choice.trim())
  }
}

// Handle Ctrl+C
process.on('SIGINT', async () => {
  console.log('\n👋 Goodbye!')
  await mongoose.connection.close()
  rl.close()
  process.exit(0)
})

main().catch(console.error)