const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Notification Content
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  
  // Notification Type & Category
  type: {
    type: String,
    required: [true, 'Notification type is required'],
    enum: {
      values: [
        'appointment-reminder', 'appointment-confirmation', 'appointment-cancellation',
        'treatment-update', 'payment-reminder', 'payment-confirmation',
        'document-uploaded', 'document-verified', 'report-available',
        'loyalty-points', 'tier-upgrade', 'promotion', 'system-update',
        'welcome', 'birthday', 'anniversary', 'review-request',
        'emergency', 'security-alert', 'other'
      ],
      message: 'Invalid notification type'
    }
  },
  
  category: {
    type: String,
    enum: ['appointment', 'treatment', 'payment', 'document', 'loyalty', 'promotion', 'system', 'personal', 'security'],
    required: true
  },
  
  // Priority & Urgency
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  urgency: {
    type: String,
    enum: ['normal', 'time-sensitive', 'immediate'],
    default: 'normal'
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'read', 'failed', 'expired'],
    default: 'pending'
  },
  
  isRead: {
    type: Boolean,
    default: false
  },
  
  readAt: Date,
  
  // Delivery Channels
  channels: {
    inApp: {
      enabled: { type: Boolean, default: true },
      status: {
        type: String,
        enum: ['pending', 'delivered', 'read', 'failed'],
        default: 'pending'
      },
      deliveredAt: Date
    },
    email: {
      enabled: { type: Boolean, default: false },
      status: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'opened', 'failed'],
        default: 'pending'
      },
      sentAt: Date,
      deliveredAt: Date,
      openedAt: Date,
      emailId: String // for tracking
    },
    sms: {
      enabled: { type: Boolean, default: false },
      status: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'failed'],
        default: 'pending'
      },
      sentAt: Date,
      deliveredAt: Date,
      messageId: String // for tracking
    },
    push: {
      enabled: { type: Boolean, default: false },
      status: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'clicked', 'failed'],
        default: 'pending'
      },
      sentAt: Date,
      deliveredAt: Date,
      clickedAt: Date,
      pushId: String // for tracking
    },
    whatsapp: {
      enabled: { type: Boolean, default: false },
      status: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
        default: 'pending'
      },
      sentAt: Date,
      deliveredAt: Date,
      readAt: Date,
      messageId: String // for tracking
    }
  },
  
  // Related Data
  relatedTo: {
    model: {
      type: String,
      enum: ['Booking', 'Treatment', 'Payment', 'Document', 'Report', 'User', 'LoyaltyPoints', 'Itinerary']
    },
    id: mongoose.Schema.Types.ObjectId
  },
  
  // Action Items
  actions: [{
    type: {
      type: String,
      enum: ['view', 'confirm', 'reschedule', 'cancel', 'pay', 'download', 'review', 'update', 'redirect']
    },
    label: String,
    url: String,
    data: mongoose.Schema.Types.Mixed, // additional data for the action
    isCompleted: { type: Boolean, default: false },
    completedAt: Date
  }],
  
  // Scheduling
  scheduledFor: Date, // when to send the notification
  
  expiresAt: Date, // when the notification becomes irrelevant
  
  // Personalization
  personalization: {
    userName: String,
    appointmentDate: Date,
    appointmentTime: String,
    clinicName: String,
    doctorName: String,
    amount: Number,
    currency: String,
    customData: mongoose.Schema.Types.Mixed
  },
  
  // Template Information
  template: {
    id: String,
    name: String,
    version: String,
    variables: mongoose.Schema.Types.Mixed
  },
  
  // Tracking & Analytics
  analytics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    lastInteractionAt: Date
  },
  
  // Retry Logic
  retryCount: {
    type: Number,
    default: 0,
    max: 3
  },
  
  lastRetryAt: Date,
  
  failureReason: String,
  
  // Grouping (for batch notifications)
  groupId: String,
  
  batchId: String,
  
  // Metadata
  metadata: {
    source: {
      type: String,
      enum: ['system', 'admin', 'api', 'scheduled', 'trigger'],
      default: 'system'
    },
    campaign: String,
    tags: [String],
    version: { type: String, default: '1.0' }
  },
  
  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  deletedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true }
})

// Indexes
NotificationSchema.index({ userId: 1, isDeleted: 1 })
NotificationSchema.index({ type: 1 })
NotificationSchema.index({ category: 1 })
NotificationSchema.index({ status: 1 })
NotificationSchema.index({ priority: 1 })
NotificationSchema.index({ isRead: 1 })
NotificationSchema.index({ scheduledFor: 1 })
NotificationSchema.index({ expiresAt: 1 })
NotificationSchema.index({ createdAt: -1 })
NotificationSchema.index({ groupId: 1 })
NotificationSchema.index({ batchId: 1 })

// Virtual for overall delivery status
NotificationSchema.virtual('deliveryStatus').get(function() {
  const channels = ['inApp', 'email', 'sms', 'push', 'whatsapp']
  const enabledChannels = channels.filter(channel => this.channels[channel].enabled)
  
  if (enabledChannels.length === 0) return 'no-channels'
  
  const deliveredChannels = enabledChannels.filter(channel => 
    ['delivered', 'read', 'opened', 'clicked'].includes(this.channels[channel].status)
  )
  
  if (deliveredChannels.length === enabledChannels.length) return 'delivered'
  if (deliveredChannels.length > 0) return 'partial'
  
  const failedChannels = enabledChannels.filter(channel => 
    this.channels[channel].status === 'failed'
  )
  
  if (failedChannels.length === enabledChannels.length) return 'failed'
  
  return 'pending'
})

// Virtual for time until expiry
NotificationSchema.virtual('timeUntilExpiry').get(function() {
  if (!this.expiresAt) return null
  const now = new Date()
  if (this.expiresAt <= now) return 0
  return Math.ceil((this.expiresAt - now) / (1000 * 60 * 60)) // hours
})

// Virtual for is expired
NotificationSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false
  return this.expiresAt <= new Date()
})

// Instance method to mark as read
NotificationSchema.methods.markAsRead = function() {
  if (!this.isRead) {
    this.isRead = true
    this.readAt = new Date()
    this.channels.inApp.status = 'read'
    this.channels.inApp.deliveredAt = new Date()
    this.analytics.lastInteractionAt = new Date()
  }
  return this.save()
}

// Instance method to track interaction
NotificationSchema.methods.trackInteraction = function(type = 'click') {
  this.analytics.lastInteractionAt = new Date()
  
  if (type === 'click') {
    this.analytics.clicks += 1
  } else if (type === 'conversion') {
    this.analytics.conversions += 1
  }
  
  return this.save()
}

// Instance method to update channel status
NotificationSchema.methods.updateChannelStatus = function(channel, status, metadata = {}) {
  if (this.channels[channel]) {
    this.channels[channel].status = status
    
    const now = new Date()
    if (status === 'sent') {
      this.channels[channel].sentAt = now
    } else if (status === 'delivered') {
      this.channels[channel].deliveredAt = now
    } else if (status === 'opened' || status === 'read') {
      this.channels[channel].openedAt = now
      this.channels[channel].readAt = now
    } else if (status === 'clicked') {
      this.channels[channel].clickedAt = now
    }
    
    // Add any additional metadata
    Object.assign(this.channels[channel], metadata)
  }
  
  return this.save()
}

// Static method to get unread notifications
NotificationSchema.statics.getUnread = function(userId, limit = 50) {
  return this.find({
    userId,
    isRead: false,
    isDeleted: false,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  })
  .sort({ priority: -1, createdAt: -1 })
  .limit(limit)
}

// Static method to get notifications by category
NotificationSchema.statics.getByCategory = function(userId, category, limit = 20) {
  return this.find({
    userId,
    category,
    isDeleted: false
  })
  .sort({ createdAt: -1 })
  .limit(limit)
}

// Static method to get recent notifications
NotificationSchema.statics.getRecent = function(userId, days = 30, limit = 100) {
  const since = new Date()
  since.setDate(since.getDate() - days)
  
  return this.find({
    userId,
    createdAt: { $gte: since },
    isDeleted: false
  })
  .sort({ createdAt: -1 })
  .limit(limit)
}

// Static method to create appointment reminder
NotificationSchema.statics.createAppointmentReminder = function(userId, booking, reminderTime = '24h') {
  const scheduledFor = new Date(booking.appointmentDateTime)
  
  // Calculate when to send reminder
  const reminderMinutes = {
    '30m': 30,
    '1h': 60,
    '2h': 120,
    '6h': 360,
    '12h': 720,
    '24h': 1440,
    '48h': 2880
  }[reminderTime] || 1440
  
  scheduledFor.setMinutes(scheduledFor.getMinutes() - reminderMinutes)
  
  return this.create({
    userId,
    title: 'Appointment Reminder',
    message: `You have an appointment for ${booking.treatmentType} at ${booking.clinic.name} on ${booking.appointmentDate.toDateString()} at ${booking.appointmentTime}`,
    type: 'appointment-reminder',
    category: 'appointment',
    priority: 'high',
    urgency: 'time-sensitive',
    scheduledFor,
    expiresAt: booking.appointmentDateTime,
    relatedTo: {
      model: 'Booking',
      id: booking._id
    },
    personalization: {
      appointmentDate: booking.appointmentDate,
      appointmentTime: booking.appointmentTime,
      clinicName: booking.clinic.name,
      treatmentType: booking.treatmentType
    },
    actions: [{
      type: 'confirm',
      label: 'Confirm Appointment',
      url: `/bookings/${booking._id}/confirm`
    }, {
      type: 'reschedule',
      label: 'Reschedule',
      url: `/bookings/${booking._id}/reschedule`
    }]
  })
}

// Pre-save middleware
NotificationSchema.pre('save', function(next) {
  // Set deletedAt when isDeleted is true
  if (this.isModified('isDeleted') && this.isDeleted) {
    this.deletedAt = new Date()
  }
  
  // Update overall status based on channel statuses
  if (this.isModified('channels')) {
    const enabledChannels = Object.keys(this.channels).filter(channel => 
      this.channels[channel].enabled
    )
    
    if (enabledChannels.length > 0) {
      const allDelivered = enabledChannels.every(channel => 
        ['delivered', 'read', 'opened', 'clicked'].includes(this.channels[channel].status)
      )
      
      if (allDelivered) {
        this.status = 'delivered'
      }
    }
  }
  
  next()
})

module.exports = mongoose.model('Notification', NotificationSchema)