const mongoose = require('mongoose')
require('dotenv').config()

// Import all models
const User = require('../models/User')
const Dentist = require('../models/Dentist')
const Booking = require('../models/Booking')
const Report = require('../models/Report')
const Itinerary = require('../models/Itinerary')
const CostEstimate = require('../models/CostEstimate')
const LoyaltyPoints = require('../models/LoyaltyPoints')
const Notification = require('../models/Notification')
const Chat = require('../models/Chat')
const TravelPackage = require('../models/TravelPackage')

const userId = '68b5bfe60c8ff435ee99f0ec'

const addDummyData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // 1. Update User with complete profile
    console.log('Updating user profile...')
    await User.findByIdAndUpdate(userId, {
      address: {
        street: '123 Tech Street',
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        zipCode: '94105'
      },
      healthProfile: {
        bloodType: 'O+',
        allergies: ['Penicillin', 'Latex', 'Shellfish'],
        medications: ['Aspirin 81mg daily', 'Vitamin D3 1000IU'],
        medicalConditions: ['Hypertension', 'Mild anxiety'],
        surgicalHistory: ['Wisdom tooth extraction (2018)', 'Appendectomy (2015)'],
        familyHistory: ['Heart disease (father)', 'Diabetes Type 2 (mother)', 'Breast cancer (maternal grandmother)'],
        emergencyContact: {
          name: 'Sarah Johnson',
          relationship: 'Sister',
          phone: '+1-555-0123',
          email: 'sarah.johnson@email.com'
        },
        insurance: {
          provider: 'Blue Cross Blue Shield',
          policyNumber: 'BC123456789',
          groupNumber: 'GRP001234',
          memberSince: new Date('2020-01-01')
        },
        lifestyle: {
          smoking: 'never',
          alcohol: 'occasionally',
          exercise: 'regular',
          diet: 'balanced'
        }
      },
      preferences: {
        language: 'en',
        currency: 'USD',
        timezone: 'America/Los_Angeles',
        notifications: {
          email: true,
          sms: true,
          push: true,
          marketing: false
        },
        privacy: {
          profileVisibility: 'private',
          shareHealthData: true
        }
      },
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    })

    // 2. Create sample dentists
    console.log('Creating sample dentists...')
    
    // Clear existing dentists first
    await Dentist.deleteMany({})
    await Booking.deleteMany({})
    await Report.deleteMany({})
    await Itinerary.deleteMany({})
    await CostEstimate.deleteMany({})
    await LoyaltyPoints.deleteMany({})
    await Notification.deleteMany({})
    await Chat.deleteMany({})
    await TravelPackage.deleteMany({})
    
    const dentists = await Dentist.create([
      {
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'dr.sarah@smiledental.com',
        phone: '+91-98765-43210',
        licenseNumber: 'DL-MH-2015-001234',
        specializations: ['orthodontics', 'cosmetic-dentistry'],
        experience: 12,
        rating: {
          average: 4.8,
          count: 156,
          breakdown: {
            5: 89,
            4: 45,
            3: 15,
            2: 5,
            1: 2
          }
        },
        consultationFee: {
          amount: 150,
          currency: 'USD'
        },
        languages: ['english', 'hindi', 'marathi'],
        qualifications: [
          {
            degree: 'DDS',
            institution: 'Harvard School of Dental Medicine',
            year: 2012,
            country: 'USA'
          },
          {
            degree: 'Orthodontics Residency',
            institution: 'UCLA School of Dentistry',
            year: 2015,
            country: 'USA'
          }
        ],
        bio: 'Experienced orthodontist specializing in Invisalign and cosmetic dentistry with over 12 years of practice.',
        clinics: [
          {
            name: 'Smile Dental Clinic',
            address: {
              street: '123 Dental Street',
              city: 'Mumbai',
              state: 'Maharashtra',
              country: 'India',
              pincode: '400001'
            },
            contact: {
              phone: '+91-22-1234-5678'
            },
            isPrimary: true
          }
        ],
        treatmentPricing: [
          {
            treatment: 'orthodontics',
            minPrice: 2000,
            maxPrice: 3000,
            currency: 'USD',
            description: 'Invisalign and traditional braces'
          },
          {
            treatment: 'whitening',
            minPrice: 250,
            maxPrice: 350,
            currency: 'USD',
            description: 'Professional teeth whitening'
          }
        ],
        profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        isActive: true,
        verificationStatus: 'verified'
      },
      {
        firstName: 'Dr. Rajesh',
        lastName: 'Patel',
        email: 'dr.rajesh@dentalcare.com',
        phone: '+91-98765-43211',
        licenseNumber: 'DL-MH-2018-005678',
        specializations: ['oral-surgery', 'implantology'],
        experience: 8,
        rating: {
          average: 4.6,
          count: 89,
          breakdown: {
            5: 45,
            4: 30,
            3: 10,
            2: 3,
            1: 1
          }
        },
        consultationFee: {
          amount: 200,
          currency: 'USD'
        },
        languages: ['english', 'hindi', 'gujarati'],
        qualifications: [
          {
            degree: 'BDS',
            institution: 'Government Dental College, Mumbai',
            year: 2016,
            country: 'India'
          }
        ],
        bio: 'Skilled oral surgeon and implant specialist with expertise in complex dental procedures.',
        clinics: [
          {
            name: 'Advanced Dental Care',
            address: {
              street: '456 Medical Plaza',
              city: 'Mumbai',
              state: 'Maharashtra',
              country: 'India',
              pincode: '400002'
            },
            contact: {
              phone: '+91-22-2345-6789'
            },
            isPrimary: true
          }
        ],
        treatmentPricing: [
          {
            treatment: 'implant',
            minPrice: 1000,
            maxPrice: 1500,
            currency: 'USD',
            description: 'Single tooth implant with crown'
          },
          {
            treatment: 'extraction',
            minPrice: 100,
            maxPrice: 200,
            currency: 'USD',
            description: 'Wisdom tooth extraction'
          }
        ],
        profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
        isActive: true,
        verificationStatus: 'verified'
      }
    ])

    // 3. Create bookings
    console.log('Creating sample bookings...')
    const bookings = await Booking.create([
      {
        userId: userId,
        dentistId: dentists[0]._id,
        bookingNumber: 'BK-2024-001234',
        treatmentType: 'orthodontics',
        treatmentDescription: 'Initial consultation for Invisalign treatment',
        appointmentDate: new Date('2024-03-15T10:00:00Z'),
        appointmentTime: '10:00',
        duration: 60,
        status: 'confirmed',
        estimatedCost: {
          amount: 150,
          currency: 'USD'
        },
        paymentStatus: 'paid',
        paymentMethod: 'card',
        clinic: {
          name: 'Smile Dental Clinic',
          address: {
            street: '123 Dental Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            pincode: '400001'
          },
          contact: {
            phone: '+91-22-1234-5678'
          }
        },
        notes: [
          {
            author: userId,
            message: 'Initial consultation for Invisalign treatment'
          }
        ],
        statusHistory: [
          {
            status: 'pending',
            changedAt: new Date('2024-01-15T10:30:00Z'),
            reason: 'Booking created by patient'
          },
          {
            status: 'confirmed',
            changedAt: new Date('2024-01-15T11:00:00Z'),
            reason: 'Confirmed by Dr. Sarah Johnson'
          }
        ]
      },
      {
        userId: userId,
        dentistId: dentists[1]._id,
        bookingNumber: 'BK-2024-001235',
        treatmentType: 'implant',
        treatmentDescription: 'Consultation for dental implant on upper left molar',
        appointmentDate: new Date('2024-04-20T14:00:00Z'),
        appointmentTime: '14:00',
        duration: 120,
        status: 'pending',
        estimatedCost: {
          amount: 200,
          currency: 'USD'
        },
        paymentStatus: 'pending',
        clinic: {
          name: 'Advanced Dental Care',
          address: {
            street: '456 Medical Plaza',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            pincode: '400002'
          },
          contact: {
            phone: '+91-22-2345-6789'
          }
        },
        notes: [
          {
            author: userId,
            message: 'Consultation for dental implant on upper left molar'
          }
        ],
        statusHistory: [
          {
            status: 'pending',
            changedAt: new Date('2024-01-20T09:15:00Z'),
            reason: 'Booking created by patient'
          }
        ]
      },
      {
        userId: userId,
        dentistId: dentists[0]._id,
        bookingNumber: 'BK-2024-001236',
        treatmentType: 'whitening',
        treatmentDescription: 'Teeth whitening treatment',
        appointmentDate: new Date('2024-02-10T15:30:00Z'),
        appointmentTime: '15:30',
        duration: 90,
        status: 'completed',
        estimatedCost: {
          amount: 300,
          currency: 'USD'
        },
        finalCost: {
          amount: 300,
          currency: 'USD'
        },
        paymentStatus: 'paid',
        paymentMethod: 'card',
        clinic: {
          name: 'Smile Dental Clinic',
          address: {
            street: '123 Dental Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            pincode: '400001'
          },
          contact: {
            phone: '+91-22-1234-5678'
          }
        },
        notes: [
          {
            author: userId,
            message: 'Teeth whitening treatment'
          },
          {
            author: dentists[0]._id,
            message: 'Teeth whitening completed successfully. Patient advised to avoid staining foods for 48 hours.'
          }
        ],
        rating: 5,
        review: 'Excellent whitening results, very satisfied!',
        reviewDate: new Date('2024-02-10T17:30:00Z'),
        statusHistory: [
          {
            status: 'pending',
            changedAt: new Date('2024-01-25T14:20:00Z'),
            reason: 'Booking created by patient'
          },
          {
            status: 'confirmed',
            changedAt: new Date('2024-01-25T15:00:00Z'),
            reason: 'Confirmed by Dr. Sarah Johnson'
          },
          {
            status: 'completed',
            changedAt: new Date('2024-02-10T17:00:00Z'),
            reason: 'Treatment completed successfully'
          }
        ]
      }
    ])

    // 4. Create medical reports
    console.log('Creating sample medical reports...')
    const reports = await Report.create([
      {
        userId: userId,
        reportNumber: 'RPT-2024-001234',
        title: 'Dental X-Ray Report',
        type: 'panoramic-xray',
        category: 'diagnostic',
        description: 'Panoramic X-ray showing overall dental condition',
        files: [
          {
            fileName: 'panoramic_xray_2024.pdf',
            originalName: 'Panoramic X-Ray January 2024.pdf',
            mimeType: 'application/pdf',
            fileSize: 2048576,
            filePath: '/uploads/reports/panoramic_xray_2024.pdf',
            fileType: 'pdf'
          }
        ],
        tags: ['x-ray', 'panoramic', 'diagnostic', 'routine'],
        reportDate: new Date('2024-01-10'),
        clinicName: 'Radiology Center Mumbai',
        findings: [
          {
            category: 'normal',
            description: 'Overall good dental health',
            location: 'general'
          },
          {
            category: 'requires-attention',
            description: 'Minor plaque buildup on lower molars',
            location: 'lower molars',
            severity: 'mild'
          },
          {
            category: 'normal',
            description: 'Wisdom teeth present and properly positioned',
            location: 'wisdom teeth'
          }
        ],
        recommendations: [
          {
            treatment: 'Professional cleaning',
            priority: 'medium',
            description: 'Professional cleaning recommended',
            timeframe: '2-4 weeks'
          },
          {
            treatment: 'Fluoride treatment',
            priority: 'low',
            description: 'Regular fluoride treatment',
            timeframe: '3-6 months'
          },
          {
            treatment: 'Follow-up examination',
            priority: 'low',
            description: 'Follow-up in 6 months',
            timeframe: '6 months'
          }
        ],
        status: 'approved',
        isShared: false
      },
      {
        userId: userId,
        reportNumber: 'RPT-2024-001235',
        title: 'Orthodontic Assessment',
        type: 'consultation-notes',
        category: 'treatment',
        description: 'Initial orthodontic evaluation and treatment planning',
        files: [
          {
            fileName: 'orthodontic_photos_2024.pdf',
            originalName: 'Orthodontic Photos and Assessment.pdf',
            mimeType: 'application/pdf',
            fileSize: 5242880,
            filePath: '/uploads/reports/orthodontic_photos_2024.pdf',
            fileType: 'pdf'
          }
        ],
        tags: ['orthodontics', 'assessment', 'treatment-plan', 'invisalign'],
        reportDate: new Date('2024-01-15'),
        clinicName: 'Smile Dental Clinic',
        dentistId: dentists[0]._id,
        findings: [
          {
            category: 'abnormal',
            description: 'Mild to moderate crowding in lower anterior teeth',
            location: 'lower anterior teeth',
            severity: 'moderate'
          },
          {
            category: 'normal',
            description: 'Upper arch shows good alignment',
            location: 'upper arch'
          },
          {
            category: 'normal',
            description: 'Class I occlusion',
            location: 'bite'
          }
        ],
        recommendations: [
          {
            treatment: 'Invisalign treatment',
            priority: 'high',
            description: 'Invisalign treatment recommended',
            estimatedCost: {
              amount: 2500,
              currency: 'USD'
            },
            timeframe: '12-15 months'
          },
          {
            treatment: 'Regular monitoring',
            priority: 'medium',
            description: 'Regular monitoring every 6 weeks',
            timeframe: 'every 6 weeks'
          }
        ],
        status: 'approved',
        isShared: true,
        sharedWith: [
          {
            recipientType: 'dentist',
            recipientId: dentists[0]._id,
            recipientName: 'Dr. Sarah Johnson',
            sharedAt: new Date('2024-01-15T12:00:00Z'),
            permissions: 'view'
          }
        ]
      },
      {
        userId: userId,
        reportNumber: 'RPT-2024-001236',
        title: 'Blood Test Results',
        type: 'lab-report',
        category: 'diagnostic',
        description: 'Pre-treatment blood work and health screening',
        files: [
          {
            fileName: 'blood_test_results_2024.pdf',
            originalName: 'Blood Test Results January 2024.pdf',
            mimeType: 'application/pdf',
            fileSize: 1024768,
            filePath: '/uploads/reports/blood_test_results_2024.pdf',
            fileType: 'pdf'
          }
        ],
        tags: ['blood-test', 'pre-treatment', 'screening', 'laboratory'],
        reportDate: new Date('2024-01-08'),
        clinicName: 'HealthCheck Labs',
        findings: [
          {
            category: 'normal',
            description: 'All parameters within normal limits',
            location: 'blood work'
          },
          {
            category: 'normal',
            description: 'Hemoglobin: 14.2 g/dL',
            location: 'blood work'
          },
          {
            category: 'normal',
            description: 'WBC: 7200/μL',
            location: 'blood work'
          },
          {
            category: 'normal',
            description: 'Platelets: 280,000/μL',
            location: 'blood work'
          }
        ],
        recommendations: [
          {
            treatment: 'Dental procedures clearance',
            priority: 'low',
            description: 'Cleared for dental procedures',
            timeframe: 'immediate'
          },
          {
            treatment: 'Continue medications',
            priority: 'low',
            description: 'Continue current medications',
            timeframe: 'ongoing'
          },
          {
            treatment: 'Follow-up blood work',
            priority: 'low',
            description: 'Recheck in 6 months',
            timeframe: '6 months'
          }
        ],
        status: 'approved',
        isShared: false
      }
    ])

    // 5. Create itineraries
    console.log('Creating sample itineraries...')
    const itineraries = await Itinerary.create([
      {
        userId: userId,
        title: 'Dental Treatment Trip to Mumbai',
        description: 'Complete dental treatment trip including orthodontic consultation and sightseeing',
        destination: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          coordinates: {
            latitude: 19.0760,
            longitude: 72.8777
          }
        },
        startDate: new Date('2024-03-14'),
        endDate: new Date('2024-03-18'),
        status: 'confirmed',
        treatments: [
          {
            bookingId: bookings[0]._id,
            treatmentType: 'orthodontics',
            dentistName: 'Dr. Sarah Johnson',
            clinicName: 'Smile Dental Clinic',
            appointmentDate: new Date('2024-03-15T10:00:00Z'),
            appointmentTime: '10:00',
            duration: 60,
            status: 'scheduled',
            notes: 'Initial consultation for Invisalign treatment'
          }
        ],
        activities: [
          {
            title: 'Visit Gateway of India',
            description: 'Historic monument and tourist attraction',
            date: new Date('2024-03-15'),
            time: '15:00',
            duration: 120,
            location: {
              name: 'Gateway of India',
              address: 'Gateway of India, Mumbai',
              coordinates: {
                latitude: 18.9220,
                longitude: 72.8347
              }
            },
            cost: {
              amount: 20,
              currency: 'USD'
            },
            category: 'sightseeing',
            bookingRequired: false,
            notes: 'Historic monument and tourist attraction'
          },
          {
            title: 'Elephanta Caves Tour',
            description: 'UNESCO World Heritage Site visit',
            date: new Date('2024-03-17'),
            time: '09:00',
            duration: 480,
            location: {
              name: 'Elephanta Caves',
              address: 'Elephanta Island, Mumbai',
              coordinates: {
                latitude: 18.9633,
                longitude: 72.9311
              }
            },
            cost: {
              amount: 80,
              currency: 'USD'
            },
            category: 'cultural',
            bookingRequired: true,
            notes: 'UNESCO World Heritage Site visit'
          }
        ],
        accommodation: {
          type: 'hotel',
          name: 'The Taj Mahal Palace Hotel',
          address: {
            street: 'Apollo Bunder, Colaba',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            pincode: '400001'
          },
          contact: {
            phone: '+91-22-6665-3366',
            email: 'reservations@tajhotels.com',
            website: 'https://www.tajhotels.com'
          },
          checkIn: new Date('2024-03-14'),
          checkOut: new Date('2024-03-18'),
          roomType: 'Deluxe Room',
          bookingReference: 'TAJ-2024-ABC123',
          cost: {
            amount: 800,
            currency: 'USD',
            perNight: false
          },
          amenities: ['WiFi', 'Breakfast', 'Spa', 'Concierge', 'Airport Transfer'],
          rating: 5,
          notes: 'Luxury heritage hotel with excellent service'
        },
        transportation: {
          arrival: {
            mode: 'flight',
            details: {
              flightNumber: 'AI-131',
              departureLocation: 'San Francisco (SFO)',
              arrivalLocation: 'Mumbai (BOM)',
              departureTime: new Date('2024-03-14T02:30:00Z'),
              arrivalTime: new Date('2024-03-14T18:00:00Z'),
              bookingReference: 'AI-131-ABC123',
              cost: {
                amount: 1200,
                currency: 'USD'
              }
            }
          },
          departure: {
            mode: 'flight',
            details: {
              flightNumber: 'AI-132',
              departureLocation: 'Mumbai (BOM)',
              arrivalLocation: 'San Francisco (SFO)',
              departureTime: new Date('2024-03-18T14:45:00Z'),
              arrivalTime: new Date('2024-03-18T22:30:00Z'),
              bookingReference: 'AI-132-DEF456',
              cost: {
                amount: 1200,
                currency: 'USD'
              }
            }
          },
          local: [
            {
              date: new Date('2024-03-15'),
              mode: 'taxi',
              from: 'Hotel',
              to: 'Smile Dental Clinic',
              estimatedCost: {
                amount: 15,
                currency: 'USD'
              },
              notes: 'Airport taxi to clinic'
            }
          ]
        },
        budget: {
          total: {
            amount: 3000,
            currency: 'USD'
          },
          breakdown: {
            treatment: { amount: 150, currency: 'USD' },
            accommodation: { amount: 800, currency: 'USD' },
            transportation: { amount: 1200, currency: 'USD' },
            food: { amount: 150, currency: 'USD' },
            activities: { amount: 100, currency: 'USD' },
            miscellaneous: { amount: 50, currency: 'USD' }
          },
          spent: {
            amount: 2350,
            currency: 'USD'
          }
        },
        emergencyContacts: [
          {
            name: 'Sarah Johnson',
            relationship: 'Sister',
            phone: '+1-555-0123',
            email: 'sarah.johnson@email.com',
            isLocal: false
          }
        ]
      },
      {
        userId: userId,
        title: 'Follow-up Visit to Mumbai',
        description: 'Follow-up dental consultation for implant treatment',
        destination: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        startDate: new Date('2024-04-19'),
        endDate: new Date('2024-04-21'),
        status: 'draft',
        treatments: [
          {
            bookingId: bookings[1]._id,
            treatmentType: 'implant',
            dentistName: 'Dr. Rajesh Patel',
            clinicName: 'Advanced Dental Care',
            appointmentDate: new Date('2024-04-20T14:00:00Z'),
            appointmentTime: '14:00',
            duration: 120,
            status: 'scheduled',
            notes: 'Consultation for dental implant on upper left molar'
          }
        ],
        budget: {
          total: {
            amount: 1500,
            currency: 'USD'
          },
          breakdown: {
            treatment: { amount: 200, currency: 'USD' },
            accommodation: { amount: 400, currency: 'USD' },
            transportation: { amount: 800, currency: 'USD' },
            food: { amount: 100, currency: 'USD' }
          },
          spent: {
            amount: 0,
            currency: 'USD'
          }
        }
      }
    ])

    // 6. Create cost estimates
    console.log('Creating sample cost estimates...')
    const estimates = await CostEstimate.create([
      {
        userId: userId,
        title: 'Orthodontic Treatment Cost Estimate',
        description: 'Complete cost estimate for Invisalign treatment in Mumbai including travel and accommodation',
        estimateNumber: 'EST-2024-001234',
        treatments: [
          {
            type: 'orthodontics',
            description: 'Invisalign Treatment - Complete orthodontic correction',
            quantity: 1,
            unitCost: {
              min: 2000,
              max: 3000,
              currency: 'USD'
            },
            totalCost: {
              min: 2000,
              max: 3000,
              currency: 'USD'
            },
            complexity: 'moderate',
            duration: 450, // 7.5 hours in minutes
            notes: 'Treatment duration: 12-15 months with regular check-ups'
          }
        ],
        locations: [
          {
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            priceMultiplier: 1.0,
            averageCost: {
              min: 2000,
              max: 3000,
              currency: 'USD'
            },
            topClinics: [
              {
                name: 'Smile Dental Clinic',
                rating: 4.8,
                estimatedCost: {
                  min: 2200,
                  max: 2800,
                  currency: 'USD'
                }
              }
            ]
          }
        ],
        additionalCosts: [
          {
            category: 'consultation',
            description: 'Initial consultation and treatment planning',
            cost: {
              min: 100,
              max: 200,
              currency: 'USD'
            },
            isOptional: false,
            notes: 'Required before treatment'
          },
          {
            category: 'diagnostics',
            description: 'X-rays and dental impressions',
            cost: {
              min: 150,
              max: 250,
              currency: 'USD'
            },
            isOptional: false,
            notes: 'Required for treatment planning'
          }
        ],
        travelCosts: {
          transportation: {
            international: {
              flight: { min: 1000, max: 1500, currency: 'USD' }
            },
            local: {
              perDay: { min: 20, max: 50, currency: 'USD' }
            }
          },
          accommodation: {
            budget: { min: 30, max: 60, currency: 'USD' },
            midRange: { min: 80, max: 150, currency: 'USD' },
            luxury: { min: 200, max: 400, currency: 'USD' }
          },
          meals: {
            perDay: { min: 25, max: 60, currency: 'USD' }
          },
          estimatedDays: 5
        },
        totalCost: {
          treatment: {
            min: 2000,
            max: 3000,
            currency: 'USD'
          },
          additional: {
            min: 250,
            max: 450,
            currency: 'USD'
          },
          travel: {
            min: 1500,
            max: 2500,
            currency: 'USD'
          },
          grandTotal: {
            min: 3750,
            max: 5950,
            currency: 'USD'
          }
        },
        status: 'active',
        validUntil: new Date('2024-04-15')
      },
      {
        userId: userId,
        title: 'Dental Implant Cost Estimate',
        description: 'Cost estimate for single tooth implant treatment in Mumbai',
        estimateNumber: 'EST-2024-001235',
        treatments: [
          {
            type: 'implant',
            description: 'Single Tooth Implant - Complete implant with crown',
            quantity: 1,
            unitCost: {
              min: 1000,
              max: 1500,
              currency: 'USD'
            },
            totalCost: {
              min: 1000,
              max: 1500,
              currency: 'USD'
            },
            complexity: 'moderate',
            duration: 180, // 3 hours in minutes
            notes: 'Treatment includes implant placement and crown fitting'
          }
        ],
        locations: [
          {
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            priceMultiplier: 1.0,
            averageCost: {
              min: 1000,
              max: 1500,
              currency: 'USD'
            },
            topClinics: [
              {
                name: 'Advanced Dental Care',
                rating: 4.6,
                estimatedCost: {
                  min: 1100,
                  max: 1400,
                  currency: 'USD'
                }
              }
            ]
          }
        ],
        additionalCosts: [
          {
            category: 'consultation',
            description: 'Initial consultation and X-rays',
            cost: {
              min: 150,
              max: 250,
              currency: 'USD'
            },
            isOptional: false,
            notes: 'Required for implant planning'
          }
        ],
        travelCosts: {
          transportation: {
            international: {
              flight: { min: 1000, max: 1500, currency: 'USD' }
            },
            local: {
              perDay: { min: 15, max: 30, currency: 'USD' }
            }
          },
          accommodation: {
            budget: { min: 25, max: 50, currency: 'USD' },
            midRange: { min: 60, max: 120, currency: 'USD' },
            luxury: { min: 150, max: 300, currency: 'USD' }
          },
          meals: {
            perDay: { min: 20, max: 50, currency: 'USD' }
          },
          estimatedDays: 3
        },
        totalCost: {
          treatment: {
            min: 1000,
            max: 1500,
            currency: 'USD'
          },
          additional: {
            min: 150,
            max: 250,
            currency: 'USD'
          },
          travel: {
            min: 1200,
            max: 2000,
            currency: 'USD'
          },
          grandTotal: {
            min: 2350,
            max: 3750,
            currency: 'USD'
          }
        },
        status: 'draft',
        validUntil: new Date('2024-05-20')
      }
    ])

    // 7. Create loyalty program data
    console.log('Creating loyalty program data...')
    const loyalty = await LoyaltyPoints.create({
      userId: userId,
      totalPoints: 5000,
      availablePoints: 2500,
      pendingPoints: 150,
      redeemedPoints: 2350,
      expiredPoints: 100,
      tier: {
        current: 'gold',
        pointsToNextTier: 500,
        benefits: [
          'discount',
          'priority',
          'consultation'
        ]
      },
      transactions: [
        {
          type: 'earned',
          points: 500,
          description: 'Completed orthodontic consultation',
          source: 'treatment-completion',
          referenceId: bookings[2]._id,
          referenceModel: 'Booking',
          balanceAfter: 2500,
          expiryDate: new Date('2026-02-10'),
          metadata: {
            treatmentType: 'orthodontics',
            clinicName: 'Smile Dental Clinic',
            bookingAmount: 150
          }
        },
        {
          type: 'earned',
          points: 200,
          description: 'Submitted review for Dr. Sarah Johnson',
          source: 'review',
          balanceAfter: 2000,
          expiryDate: new Date('2026-02-11')
        },
        {
          type: 'earned',
          points: 300,
          description: 'Successful referral - John Smith',
          source: 'referral',
          balanceAfter: 1800,
          expiryDate: new Date('2026-01-20')
        },
        {
          type: 'redeemed',
          points: -200,
          description: 'Applied discount on booking BK-2024-001234',
          source: 'redemption',
          referenceId: bookings[0]._id,
          referenceModel: 'Booking',
          balanceAfter: 1600
        },
        {
          type: 'bonus',
          points: 1000,
          description: 'Welcome bonus for new member',
          source: 'signup-bonus',
          balanceAfter: 1000,
          expiryDate: new Date('2026-01-01')
        }
      ],
      redemptions: [
        {
          redemptionId: 'RED1705123456ABCD',
          type: 'discount',
          pointsUsed: 200,
          value: {
            amount: 20,
            currency: 'USD'
          },
          description: '10% discount on orthodontic consultation',
          status: 'completed',
          appliedTo: bookings[0]._id,
          appliedToModel: 'Booking',
          completedAt: new Date('2024-01-15T12:00:00Z')
        }
      ],
      referrals: {
        referralCode: 'TEST2024',
        referredUsers: [
          {
            userId: new mongoose.Types.ObjectId(),
            referredAt: new Date('2024-01-20'),
            pointsEarned: 300,
            status: 'completed'
          },
          {
            userId: new mongoose.Types.ObjectId(),
            referredAt: new Date('2024-02-01'),
            pointsEarned: 300,
            status: 'completed'
          },
          {
            userId: new mongoose.Types.ObjectId(),
            referredAt: new Date('2024-02-15'),
            pointsEarned: 300,
            status: 'completed'
          },
          {
            userId: new mongoose.Types.ObjectId(),
            referredAt: new Date('2024-02-25'),
            pointsEarned: 0,
            status: 'pending'
          }
        ],
        totalReferrals: 4,
        successfulReferrals: 3,
        referralPointsEarned: 900
      },
      campaigns: [
        {
          campaignId: 'WELCOME2024',
          name: 'Welcome Campaign',
          pointsEarned: 1000,
          participatedAt: new Date('2024-01-01'),
          status: 'completed'
        }
      ],
      notifications: {
        pointsEarned: true,
        pointsExpiring: true,
        tierUpgrade: true,
        specialOffers: true,
        reminderDays: 30
      },
      stats: {
        lifetimePointsEarned: 5000,
        lifetimePointsRedeemed: 2350,
        averageMonthlyEarning: 1250,
        lastEarnedDate: new Date('2024-02-11'),
        lastRedeemedDate: new Date('2024-01-15'),
        memberSince: new Date('2024-01-01')
      }
    })

    // 8. Create notifications
    console.log('Creating sample notifications...')
    const notifications = await Notification.create([
      {
        userId: userId,
        type: 'appointment-confirmation',
        category: 'appointment',
        title: 'Booking Confirmed',
        message: 'Your appointment with Dr. Sarah Johnson has been confirmed for March 15, 2024 at 10:00 AM.',
        isRead: false,
        priority: 'high',
        data: {
          bookingId: bookings[0]._id,
          dentistName: 'Dr. Sarah Johnson',
          appointmentDate: '2024-03-15T10:00:00Z'
        },
        actionUrl: `/bookings/${bookings[0]._id}`
      },
      {
        userId: userId,
        type: 'appointment-reminder',
        category: 'appointment',
        title: 'Appointment Reminder',
        message: 'Reminder: You have an appointment tomorrow at 10:00 AM with Dr. Sarah Johnson.',
        isRead: false,
        priority: 'high',
        data: {
          bookingId: bookings[0]._id,
          dentistName: 'Dr. Sarah Johnson'
        },
        actionUrl: `/bookings/${bookings[0]._id}`,
        scheduledFor: new Date('2024-03-14T10:00:00Z')
      },
      {
        userId: userId,
        type: 'loyalty-points',
        category: 'loyalty',
        title: 'Points Earned!',
        message: 'You earned 500 points for completing your orthodontic consultation. Total points: 2,500',
        isRead: true,
        priority: 'medium',
        data: {
          pointsEarned: 500,
          totalPoints: 2500,
          source: 'booking_completed'
        },
        readAt: new Date('2024-02-11T09:30:00Z')
      },
      {
        userId: userId,
        type: 'document-uploaded',
        category: 'document',
        title: 'Medical Report Uploaded',
        message: 'Your dental X-ray report has been successfully uploaded and is now available in your health records.',
        isRead: true,
        priority: 'medium',
        data: {
          reportId: reports[0]._id,
          reportTitle: 'Dental X-Ray Report'
        },
        actionUrl: `/reports/${reports[0]._id}`,
        readAt: new Date('2024-01-10T14:20:00Z')
      },
      {
        userId: userId,
        type: 'other',
        category: 'personal',
        title: 'Travel Reminder',
        message: 'Your trip to Mumbai starts in 3 days. Don\'t forget to pack your medical documents!',
        isRead: false,
        priority: 'medium',
        data: {
          itineraryId: itineraries[0]._id,
          destination: 'Mumbai',
          startDate: '2024-03-14'
        },
        actionUrl: `/itinerary/${itineraries[0]._id}`
      },
      {
        userId: userId,
        type: 'loyalty-points',
        category: 'loyalty',
        title: 'Referral Successful!',
        message: 'Great news! John Smith has completed his first booking. You earned 300 bonus points!',
        isRead: false,
        priority: 'medium',
        data: {
          referredUser: 'John Smith',
          pointsEarned: 300,
          referralCode: 'TEST2024'
        },
        actionUrl: '/loyalty/referrals'
      }
    ])

    // 9. Create chat conversations
    console.log('Creating sample chat conversations...')
    const chats = await Chat.create([
      {
        participants: [
          {
            userId: userId,
            userModel: 'User',
            role: 'patient',
            isActive: true
          },
          {
            userId: dentists[0]._id,
            userModel: 'Dentist',
            role: 'dentist',
            isActive: true
          }
        ],
        chatType: 'consultation',
        subject: 'Orthodontic Treatment Inquiry',
        relatedBooking: bookings[0]._id,
        status: 'active',
        messages: [
          {
            senderId: userId,
            senderModel: 'User',
            message: 'Hello Dr. Johnson, I would like to inquire about Invisalign treatment options.',
            messageType: 'text',
            isRead: true,
            readAt: new Date('2024-01-15T10:35:00Z')
          },
          {
            senderId: dentists[0]._id,
            senderModel: 'Dentist',
            message: 'Hello! I\'d be happy to help you with information about Invisalign. Based on your inquiry, I can see you\'re interested in orthodontic treatment. Would you like to schedule a consultation to discuss your specific needs?',
            messageType: 'text',
            isRead: true,
            readAt: new Date('2024-01-15T10:40:00Z')
          },
          {
            senderId: userId,
            senderModel: 'User',
            message: 'Yes, that would be great. I\'m planning to visit Mumbai in March. What dates do you have available?',
            messageType: 'text',
            isRead: true,
            readAt: new Date('2024-01-15T10:45:00Z')
          },
          {
            senderId: dentists[0]._id,
            senderModel: 'Dentist',
            message: 'Perfect! I have availability on March 15th at 10:00 AM. This would be an initial consultation where we can assess your teeth and discuss the best treatment options for you.',
            messageType: 'text',
            isRead: false
          }
        ],
        lastMessage: {
          content: 'Perfect! I have availability on March 15th at 10:00 AM.',
          senderId: dentists[0]._id,
          timestamp: new Date('2024-01-15T10:50:00Z')
        },
        unreadCount: new Map([[userId.toString(), 1]])
      },
      {
        participants: [
          {
            userId: userId,
            userModel: 'User',
            role: 'patient',
            isActive: true
          }
        ],
        chatType: 'ai-assistant',
        subject: 'AI Assistant Chat',
        status: 'active',
        messages: [
          {
            senderId: userId,
            senderModel: 'User',
            message: 'I need help finding a dentist for root canal treatment in Mumbai.',
            messageType: 'text',
            isRead: true
          },
          {
            senderId: new mongoose.Types.ObjectId(),
            senderModel: 'AI',
            message: 'I can help you find qualified endodontists in Mumbai for root canal treatment. Based on your location preference, I found several highly-rated specialists. Would you like me to show you the top-rated dentists or help you with specific requirements like budget or availability?',
            messageType: 'text',
            isRead: true
          },
          {
            senderId: userId,
            senderModel: 'User',
            message: 'Show me the top-rated endodontists with availability this month.',
            messageType: 'text',
            isRead: true
          },
          {
            senderId: new mongoose.Types.ObjectId(),
            senderModel: 'AI',
            message: 'Here are the top-rated endodontists in Mumbai with availability this month:\n\n1. Dr. Rajesh Patel - Advanced Dental Care\n   - Rating: 4.6/5 (89 reviews)\n   - Specializes in root canal therapy\n   - Available: March 20, 22, 25\n   - Consultation fee: ₹200\n\nWould you like me to help you book an appointment or get more information about any of these dentists?',
            messageType: 'text',
            isRead: false
          }
        ],
        lastMessage: {
          content: 'Here are the top-rated endodontists in Mumbai...',
          senderId: new mongoose.Types.ObjectId(),
          timestamp: new Date('2024-01-18T14:30:00Z')
        },
        aiContext: {
          sessionId: 'ai_session_123456',
          conversationHistory: [
            {
              query: 'root canal treatment Mumbai',
              response: 'Found 5 qualified endodontists',
              timestamp: new Date('2024-01-18T14:25:00Z'),
              confidence: 0.95
            }
          ],
          userPreferences: {
            language: 'en',
            responseStyle: 'friendly'
          }
        },
        unreadCount: new Map([[userId.toString(), 1]])
      }
    ])

    // 10. Create travel packages
    console.log('Creating sample travel packages...')
    const packages = await TravelPackage.create([
      {
        name: 'Mumbai Dental Excellence Package',
        description: 'Complete dental treatment package in Mumbai with luxury accommodation and guided tours. Perfect for patients seeking high-quality dental care while experiencing the vibrant culture of Mumbai.',
        shortDescription: '5-day dental treatment package with luxury stay and sightseeing',
        destination: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          coordinates: {
            latitude: 19.0760,
            longitude: 72.8777
          },
          timezone: 'Asia/Kolkata',
          currency: 'INR'
        },
        duration: {
          days: 5,
          nights: 4
        },
        pricing: {
          basePrice: 1500,
          currency: 'USD',
          priceIncludes: [
            'Dental consultation and treatment',
            '4 nights luxury hotel accommodation',
            'Airport transfers',
            'City tour guide',
            'All meals at hotel'
          ],
          priceExcludes: [
            'International flights',
            'Travel insurance',
            'Personal expenses',
            'Additional treatments'
          ],
          discounts: [
            {
              type: 'early-bird',
              percentage: 15,
              validFrom: new Date('2024-01-01'),
              validUntil: new Date('2024-12-31'),
              conditions: 'Book 30 days in advance'
            }
          ]
        },
        treatments: [
          {
            type: 'orthodontics',
            name: 'Invisalign Consultation',
            description: 'Complete orthodontic assessment and treatment planning',
            duration: '1-2 hours',
            sessions: 1,
            isIncluded: true
          },
          {
            type: 'cosmetic-dentistry',
            name: 'Teeth Whitening',
            description: 'Professional teeth whitening treatment',
            duration: '1 hour',
            sessions: 1,
            isIncluded: false,
            additionalCost: 300
          }
        ],
        accommodation: {
          type: 'hotel',
          name: 'The Taj Mahal Palace',
          rating: 5,
          amenities: ['WiFi', 'Spa', 'Pool', 'Concierge', 'Room Service'],
          roomType: 'Deluxe Room',
          mealsIncluded: {
            breakfast: true,
            lunch: true,
            dinner: true
          },
          location: {
            address: 'Apollo Bunder, Colaba, Mumbai',
            distanceFromClinic: '2 km',
            distanceFromAirport: '25 km'
          },
          images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400']
        },
        transportation: {
          airportPickup: true,
          airportDrop: true,
          localTransport: 'included',
          transportType: ['private-car', 'taxi'],
          additionalInfo: 'Private car with driver for all transfers'
        },
        activities: [
          {
            name: 'Gateway of India Tour',
            description: 'Visit the iconic Gateway of India monument',
            duration: '2 hours',
            cost: 0,
            isIncluded: true,
            category: 'sightseeing',
            images: ['https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400']
          },
          {
            name: 'Elephanta Caves Excursion',
            description: 'UNESCO World Heritage Site visit',
            duration: '6 hours',
            cost: 80,
            isIncluded: false,
            category: 'cultural',
            images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400']
          }
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival and Check-in',
            activities: [
              {
                time: '18:00',
                activity: 'Airport pickup and hotel check-in',
                location: 'The Taj Mahal Palace',
                notes: 'Welcome drink and orientation'
              }
            ],
            meals: {
              dinner: 'Hotel restaurant'
            },
            accommodation: 'The Taj Mahal Palace'
          },
          {
            day: 2,
            title: 'Dental Consultation',
            activities: [
              {
                time: '10:00',
                activity: 'Orthodontic consultation',
                location: 'Smile Dental Clinic',
                notes: 'Initial assessment and treatment planning'
              },
              {
                time: '15:00',
                activity: 'Gateway of India tour',
                location: 'Gateway of India',
                notes: 'Guided sightseeing tour'
              }
            ],
            meals: {
              breakfast: 'Hotel',
              lunch: 'Local restaurant',
              dinner: 'Hotel restaurant'
            }
          }
        ],
        partneredClinics: [
          {
            clinicId: new mongoose.Types.ObjectId(),
            name: 'Smile Dental Clinic',
            address: '123 Dental Street, Mumbai',
            specializations: ['Orthodontics', 'Cosmetic Dentistry'],
            rating: 4.8,
            certifications: ['ISO 9001', 'JCI Accredited']
          }
        ],
        partneredDentists: [
          {
            dentistId: dentists[0]._id,
            name: 'Dr. Sarah Johnson',
            specializations: ['Orthodontics', 'Cosmetic Dentistry'],
            experience: 12,
            rating: 4.8
          }
        ],
        packageFeatures: [
          {
            feature: 'Luxury Accommodation',
            description: '5-star hotel with all amenities',
            icon: 'hotel'
          },
          {
            feature: 'Expert Dental Care',
            description: 'Treatment by certified specialists',
            icon: 'medical'
          },
          {
            feature: 'Cultural Experience',
            description: 'Guided tours of Mumbai attractions',
            icon: 'tour'
          }
        ],
        targetAudience: {
          ageGroup: ['25-35', '35-50', '50+'],
          budgetRange: {
            min: 1000,
            max: 3000
          },
          treatmentTypes: ['orthodontics', 'cosmetic-dentistry'],
          travelStyle: ['luxury', 'cultural']
        },
        availability: {
          availableDates: [
            {
              from: new Date('2024-03-01'),
              to: new Date('2024-03-31'),
              maxBookings: 10,
              currentBookings: 3
            },
            {
              from: new Date('2024-04-01'),
              to: new Date('2024-04-30'),
              maxBookings: 10,
              currentBookings: 1
            }
          ],
          advanceBookingDays: 30,
          maxGroupSize: 4
        },
        reviews: [
          {
            userId: new mongoose.Types.ObjectId(),
            rating: 5,
            comment: 'Excellent package! The dental treatment was top-notch and the hotel was amazing. Highly recommended!',
            aspects: {
              treatment: 5,
              accommodation: 5,
              transportation: 4,
              activities: 5,
              value: 5
            },
            isVerified: true
          }
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
            caption: 'Luxury hotel accommodation',
            category: 'accommodation',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800',
            caption: 'Modern dental clinic',
            category: 'clinic'
          }
        ],
        tags: ['luxury', 'orthodontics', 'mumbai', 'cultural-tour'],
        category: 'luxury',
        status: 'active',
        isPopular: true,
        isFeatured: true,
        totalBookings: 25,
        averageRating: 4.8,
        reviewCount: 15,
        createdBy: new mongoose.Types.ObjectId(),
        seoData: {
          metaTitle: 'Mumbai Dental Excellence Package - Luxury Dental Tourism',
          metaDescription: 'Experience world-class dental care in Mumbai with luxury accommodation and cultural tours.',
          keywords: ['dental tourism', 'mumbai', 'orthodontics', 'luxury'],
          slug: 'mumbai-dental-excellence-package'
        }
      }
    ])

    console.log('✅ All dummy data created successfully!')
    console.log(`
📊 Data Summary:
- User Profile: Updated with complete health profile
- Dentists: ${dentists.length} created
- Bookings: ${bookings.length} created
- Medical Reports: ${reports.length} created
- Itineraries: ${itineraries.length} created
- Cost Estimates: ${estimates.length} created
- Loyalty Program: 1 created with full history
- Notifications: ${notifications.length} created
- Chat Conversations: ${chats.length} created
- Travel Packages: ${packages.length} created
    `)

  } catch (error) {
    console.error('Error creating dummy data:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the script
addDummyData()
