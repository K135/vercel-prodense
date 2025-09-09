#!/usr/bin/env node

/**
 * Local MongoDB Database Initialization Script
 * This script sets up the local MongoDB database with initial data
 */

const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

// Import models
const User = require('../models/User')
const Dentist = require('../models/Dentist')
const Booking = require('../models/Booking')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prodance'

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing local MongoDB database...')
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB:', MONGODB_URI)

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...')
    await User.deleteMany({})
    await Dentist.deleteMany({})
    await Booking.deleteMany({})

    // Create sample users
    console.log('👥 Creating sample users...')
    const sampleUsers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        password: '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ', // password: 'password123'
        isVerified: true,
        role: 'patient'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1234567891',
        password: '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ', // password: 'password123'
        isVerified: true,
        role: 'patient'
      }
    ]

    const createdUsers = await User.insertMany(sampleUsers)
    console.log(`✅ Created ${createdUsers.length} sample users`)

    // Create sample dentists
    console.log('🦷 Creating sample dentists...')
    const sampleDentists = [
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'dr.sarah@dentalclinic.com',
        phone: '+1234567892',
        licenseNumber: 'DL001234',
        specializations: ['general-dentistry', 'cosmetic-dentistry'],
        experience: 10,
        qualifications: [{
          degree: 'BDS',
          institution: 'Delhi University',
          year: 2014,
          country: 'India'
        }],
        clinics: [{
          name: 'Smile Care Dental Clinic',
          address: {
            street: '123 Dental Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            pincode: '400001',
            coordinates: {
              latitude: 19.0760,
              longitude: 72.8777
            }
          },
          contact: {
            phone: '+91-22-12345678',
            email: 'info@smilecare.com'
          },
          facilities: ['digital-xray', 'laser-treatment', 'air-conditioning'],
          operatingHours: [
            { day: 'monday', openTime: '09:00', closeTime: '17:00', isOpen: true },
            { day: 'tuesday', openTime: '09:00', closeTime: '17:00', isOpen: true },
            { day: 'wednesday', openTime: '09:00', closeTime: '17:00', isOpen: true },
            { day: 'thursday', openTime: '09:00', closeTime: '17:00', isOpen: true },
            { day: 'friday', openTime: '09:00', closeTime: '15:00', isOpen: true }
          ],
          isPrimary: true
        }],
        languages: ['english', 'hindi'],
        bio: 'Experienced dentist specializing in general and cosmetic dentistry with over 10 years of practice.',
        rating: {
          average: 4.8,
          count: 125,
          breakdown: { 5: 100, 4: 20, 3: 3, 2: 1, 1: 1 }
        },
        consultationFee: {
          amount: 500,
          currency: 'INR'
        },
        treatmentPricing: [
          { treatment: 'consultation', minPrice: 500, maxPrice: 500, currency: 'INR' },
          { treatment: 'cleaning', minPrice: 1500, maxPrice: 2500, currency: 'INR' },
          { treatment: 'filling', minPrice: 2000, maxPrice: 5000, currency: 'INR' }
        ],
        availability: {
          isAcceptingPatients: true,
          nextAvailableDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          bookingAdvanceDays: 30,
          cancellationPolicy: '24h'
        },
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        isActive: true
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'dr.michael@dentalclinic.com',
        phone: '+1234567893',
        licenseNumber: 'DL005678',
        specializations: ['orthodontics', 'pediatric-dentistry'],
        experience: 15,
        qualifications: [{
          degree: 'MDS - Orthodontics',
          institution: 'AIIMS Delhi',
          year: 2009,
          country: 'India'
        }],
        clinics: [{
          name: 'Kids Dental Care',
          address: {
            street: '456 Smile Avenue',
            city: 'Delhi',
            state: 'Delhi',
            country: 'India',
            pincode: '110001',
            coordinates: {
              latitude: 28.6139,
              longitude: 77.2090
            }
          },
          contact: {
            phone: '+91-11-87654321',
            email: 'info@kidsdentalcare.com'
          },
          facilities: ['digital-xray', 'ct-scan', 'sedation', 'wheelchair-accessible'],
          operatingHours: [
            { day: 'monday', openTime: '08:00', closeTime: '16:00', isOpen: true },
            { day: 'tuesday', openTime: '08:00', closeTime: '16:00', isOpen: true },
            { day: 'wednesday', openTime: '08:00', closeTime: '16:00', isOpen: true },
            { day: 'thursday', openTime: '08:00', closeTime: '16:00', isOpen: true },
            { day: 'friday', openTime: '08:00', closeTime: '14:00', isOpen: true }
          ],
          isPrimary: true
        }],
        languages: ['english', 'hindi', 'punjabi'],
        bio: 'Specialist in orthodontics and pediatric dentistry with 15 years of experience treating children and adults.',
        rating: {
          average: 4.9,
          count: 200,
          breakdown: { 5: 180, 4: 15, 3: 3, 2: 1, 1: 1 }
        },
        consultationFee: {
          amount: 800,
          currency: 'INR'
        },
        treatmentPricing: [
          { treatment: 'consultation', minPrice: 800, maxPrice: 800, currency: 'INR' },
          { treatment: 'orthodontics', minPrice: 50000, maxPrice: 150000, currency: 'INR' },
          { treatment: 'cleaning', minPrice: 2000, maxPrice: 3000, currency: 'INR' }
        ],
        availability: {
          isAcceptingPatients: true,
          nextAvailableDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          bookingAdvanceDays: 45,
          cancellationPolicy: '48h'
        },
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        isActive: true
      }
    ]

    const createdDentists = await Dentist.insertMany(sampleDentists)
    console.log(`✅ Created ${createdDentists.length} sample dentists`)

    // Create sample bookings
    console.log('📅 Creating sample bookings...')
    const sampleBookings = [
      {
        patientId: createdUsers[0]._id,
        dentistId: createdDentists[0]._id,
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        appointmentTime: '10:00',
        duration: 60,
        treatmentType: 'Regular Checkup',
        status: 'confirmed',
        estimatedCost: {
          amount: 150,
          currency: 'USD'
        },
        notes: 'Regular dental checkup and cleaning'
      },
      {
        patientId: createdUsers[1]._id,
        dentistId: createdDentists[1]._id,
        appointmentDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        appointmentTime: '14:00',
        duration: 90,
        treatmentType: 'Teeth Whitening',
        status: 'pending',
        estimatedCost: {
          amount: 300,
          currency: 'USD'
        },
        notes: 'Professional teeth whitening treatment'
      }
    ]

    const createdBookings = await Booking.insertMany(sampleBookings)
    console.log(`✅ Created ${createdBookings.length} sample bookings`)

    console.log('🎉 Database initialization completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   Users: ${createdUsers.length}`)
    console.log(`   Dentists: ${createdDentists.length}`)
    console.log(`   Bookings: ${createdBookings.length}`)
    console.log('\n🔐 Test Login Credentials:')
    console.log('   Email: john.doe@example.com')
    console.log('   Password: password123')

  } catch (error) {
    console.error('❌ Database initialization failed:', error)
  } finally {
    await mongoose.connection.close()
    console.log('📦 Database connection closed')
    process.exit(0)
  }
}

// Run the initialization
initializeDatabase()