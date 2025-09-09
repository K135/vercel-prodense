const mongoose = require('mongoose')
require('dotenv').config()

const Notification = require('../models/Notification')
const User = require('../models/User')

const sampleNotifications = [
  {
    title: "Appointment Reminder",
    message: "Your dental cleaning appointment with Dr. Sarah Johnson is scheduled for tomorrow at 10:00 AM at Smile Dental Clinic.",
    type: "appointment-reminder",
    category: "appointment",
    priority: "high",
    urgency: "time-sensitive",
    isRead: false,
    personalization: {
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      appointmentTime: "10:00 AM",
      clinicName: "Smile Dental Clinic",
      doctorName: "Dr. Sarah Johnson"
    },
    actions: [
      {
        type: "confirm",
        label: "Confirm Appointment",
        url: "/dashboard/booking"
      },
      {
        type: "reschedule",
        label: "Reschedule",
        url: "/dashboard/booking"
      }
    ]
  },
  {
    title: "Payment Confirmation",
    message: "Your payment of $250 for the dental cleaning procedure has been successfully processed.",
    type: "payment-confirmation",
    category: "payment",
    priority: "medium",
    urgency: "normal",
    isRead: true,
    readAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    personalization: {
      amount: 250,
      currency: "USD"
    }
  },
  {
    title: "Treatment Plan Available",
    message: "Dr. Michael Chen has uploaded your comprehensive treatment plan. Please review the recommended procedures and timeline.",
    type: "document-uploaded",
    category: "document",
    priority: "medium",
    urgency: "normal",
    isRead: false,
    personalization: {
      doctorName: "Dr. Michael Chen"
    },
    actions: [
      {
        type: "view",
        label: "View Treatment Plan",
        url: "/dashboard/reports"
      }
    ]
  },
  {
    title: "Loyalty Points Earned",
    message: "Congratulations! You've earned 50 loyalty points for your recent appointment. You now have 350 points total.",
    type: "loyalty-points",
    category: "loyalty",
    priority: "low",
    urgency: "normal",
    isRead: false
  },
  {
    title: "Welcome to Prodense!",
    message: "Welcome to your premium dental care journey! We're excited to help you achieve your perfect smile.",
    type: "welcome",
    category: "system",
    priority: "medium",
    urgency: "normal",
    isRead: true,
    readAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    title: "Security Alert",
    message: "A new device has been used to access your account. If this wasn't you, please contact support immediately.",
    type: "security-alert",
    category: "security",
    priority: "urgent",
    urgency: "immediate",
    isRead: false,
    actions: [
      {
        type: "review",
        label: "Review Activity",
        url: "/dashboard/profile"
      }
    ]
  },
  {
    title: "Special Promotion",
    message: "Limited time offer: Get 20% off on teeth whitening treatments this month. Book now to secure your spot!",
    type: "promotion",
    category: "promotion",
    priority: "low",
    urgency: "normal",
    isRead: false,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    actions: [
      {
        type: "redirect",
        label: "Book Now",
        url: "/treatments/whitening"
      }
    ]
  },
  {
    title: "Post-Treatment Care Instructions",
    message: "Your root canal treatment is complete. Please follow the aftercare instructions to ensure proper healing.",
    type: "treatment-update",
    category: "treatment",
    priority: "high",
    urgency: "time-sensitive",
    isRead: false,
    personalization: {
      treatmentType: "Root Canal"
    },
    actions: [
      {
        type: "view",
        label: "View Instructions",
        url: "/dashboard/continuity"
      }
    ]
  },
  {
    title: "Review Request",
    message: "How was your experience with Dr. Priya Sharma? Your feedback helps us improve our services.",
    type: "review-request",
    category: "system",
    priority: "low",
    urgency: "normal",
    isRead: false,
    personalization: {
      doctorName: "Dr. Priya Sharma"
    },
    actions: [
      {
        type: "review",
        label: "Leave Review",
        url: "/reviews"
      }
    ]
  },
  {
    title: "Appointment Confirmed",
    message: "Your appointment for orthodontic consultation with Dr. Rajesh Patel on March 25th at 2:30 PM has been confirmed.",
    type: "appointment-confirmation",
    category: "appointment",
    priority: "medium",
    urgency: "normal",
    isRead: true,
    readAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    personalization: {
      appointmentDate: new Date('2024-03-25'),
      appointmentTime: "2:30 PM",
      doctorName: "Dr. Rajesh Patel",
      treatmentType: "Orthodontic Consultation"
    }
  }
]

async function addSampleNotifications() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prodense')
    console.log('Connected to MongoDB')

    // Find a user to assign notifications to
    const user = await User.findOne()
    if (!user) {
      console.log('No users found. Please create a user first.')
      return
    }

    console.log(`Adding notifications for user: ${user.email}`)

    // Clear existing notifications for this user
    await Notification.deleteMany({ userId: user._id })
    console.log('Cleared existing notifications')

    // Add sample notifications
    const notifications = sampleNotifications.map(notification => ({
      ...notification,
      userId: user._id,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
      channels: {
        inApp: {
          enabled: true,
          status: 'delivered',
          deliveredAt: new Date()
        },
        email: {
          enabled: false,
          status: 'pending'
        },
        sms: {
          enabled: false,
          status: 'pending'
        },
        push: {
          enabled: true,
          status: 'delivered',
          deliveredAt: new Date()
        },
        whatsapp: {
          enabled: false,
          status: 'pending'
        }
      },
      metadata: {
        source: 'system',
        version: '1.0'
      }
    }))

    const result = await Notification.insertMany(notifications)
    console.log(`Added ${result.length} sample notifications`)

    // Display summary
    const unreadCount = await Notification.countDocuments({ userId: user._id, isRead: false })
    const totalCount = await Notification.countDocuments({ userId: user._id })
    
    console.log(`\nSummary:`)
    console.log(`Total notifications: ${totalCount}`)
    console.log(`Unread notifications: ${unreadCount}`)
    console.log(`Read notifications: ${totalCount - unreadCount}`)

  } catch (error) {
    console.error('Error adding sample notifications:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the script
addSampleNotifications()