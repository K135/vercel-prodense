const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderModel'
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['User', 'Dentist', 'AI']
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'voice', 'video', 'system'],
    default: 'text'
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'document', 'audio', 'video']
    },
    url: String,
    filename: String,
    size: Number,
    mimeType: String
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  originalMessage: String,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
})

const chatSchema = new mongoose.Schema({
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'participants.userModel'
    },
    userModel: {
      type: String,
      required: true,
      enum: ['User', 'Dentist']
    },
    role: {
      type: String,
      enum: ['patient', 'dentist', 'admin'],
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    leftAt: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  chatType: {
    type: String,
    enum: ['consultation', 'support', 'ai-assistant', 'group'],
    default: 'consultation'
  },
  subject: {
    type: String,
    maxlength: 200
  },
  relatedBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'archived', 'blocked'],
    default: 'active'
  },
  messages: [messageSchema],
  lastMessage: {
    content: String,
    senderId: mongoose.Schema.Types.ObjectId,
    timestamp: Date
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  consultationDetails: {
    type: {
      type: String,
      enum: ['pre-booking', 'post-treatment', 'general', 'emergency', 'follow-up']
    },
    fee: Number,
    duration: Number, // in minutes
    scheduledAt: Date,
    completedAt: Date,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String
  },
  aiContext: {
    sessionId: String,
    conversationHistory: [{
      query: String,
      response: String,
      timestamp: Date,
      confidence: Number
    }],
    userPreferences: {
      language: String,
      responseStyle: {
        type: String,
        enum: ['detailed', 'concise', 'friendly', 'professional'],
        default: 'friendly'
      }
    }
  },
  metadata: {
    tags: [String],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    department: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: Date
}, {
  timestamps: true
})

// Indexes
chatSchema.index({ 'participants.userId': 1, status: 1 })
chatSchema.index({ chatType: 1, status: 1 })
chatSchema.index({ relatedBooking: 1 })
chatSchema.index({ 'lastMessage.timestamp': -1 })
chatSchema.index({ createdAt: -1 })

// Virtual for active participants
chatSchema.virtual('activeParticipants').get(function() {
  return this.participants.filter(p => p.isActive && !p.leftAt)
})

// Methods
chatSchema.methods.addMessage = function(senderId, senderModel, message, messageType = 'text', attachments = []) {
  const newMessage = {
    senderId,
    senderModel,
    message,
    messageType,
    attachments
  }
  
  this.messages.push(newMessage)
  this.lastMessage = {
    content: message,
    senderId,
    timestamp: new Date()
  }
  
  // Update unread count for other participants
  this.participants.forEach(participant => {
    if (participant.userId.toString() !== senderId.toString()) {
      const currentCount = this.unreadCount.get(participant.userId.toString()) || 0
      this.unreadCount.set(participant.userId.toString(), currentCount + 1)
    }
  })
  
  return this.save()
}

chatSchema.methods.markAsRead = function(userId) {
  // Mark messages as read
  this.messages.forEach(message => {
    if (message.senderId.toString() !== userId.toString() && !message.isRead) {
      message.isRead = true
      message.readAt = new Date()
    }
  })
  
  // Reset unread count
  this.unreadCount.set(userId.toString(), 0)
  
  return this.save()
}

chatSchema.methods.addParticipant = function(userId, userModel, role) {
  const existingParticipant = this.participants.find(
    p => p.userId.toString() === userId.toString()
  )
  
  if (existingParticipant) {
    existingParticipant.isActive = true
    existingParticipant.leftAt = undefined
  } else {
    this.participants.push({
      userId,
      userModel,
      role,
      joinedAt: new Date(),
      isActive: true
    })
  }
  
  return this.save()
}

chatSchema.methods.removeParticipant = function(userId) {
  const participant = this.participants.find(
    p => p.userId.toString() === userId.toString()
  )
  
  if (participant) {
    participant.isActive = false
    participant.leftAt = new Date()
  }
  
  return this.save()
}

chatSchema.methods.closeChat = function() {
  this.status = 'closed'
  return this.save()
}

chatSchema.methods.archiveChat = function() {
  this.isArchived = true
  this.archivedAt = new Date()
  this.status = 'archived'
  return this.save()
}

// Static methods
chatSchema.statics.findUserChats = function(userId, status = 'active') {
  return this.find({
    'participants.userId': userId,
    'participants.isActive': true,
    status
  })
  .populate('participants.userId', 'firstName lastName email')
  .populate('relatedBooking', 'treatmentType appointmentDate')
  .sort({ 'lastMessage.timestamp': -1 })
}

chatSchema.statics.createConsultationChat = function(patientId, dentistId, bookingId, subject) {
  return this.create({
    participants: [
      {
        userId: patientId,
        userModel: 'User',
        role: 'patient'
      },
      {
        userId: dentistId,
        userModel: 'Dentist',
        role: 'dentist'
      }
    ],
    chatType: 'consultation',
    subject,
    relatedBooking: bookingId,
    status: 'active'
  })
}

chatSchema.statics.createAIChat = function(userId) {
  return this.create({
    participants: [{
      userId,
      userModel: 'User',
      role: 'patient'
    }],
    chatType: 'ai-assistant',
    subject: 'AI Assistant Chat',
    status: 'active',
    aiContext: {
      sessionId: 'ai_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      conversationHistory: [],
      userPreferences: {
        language: 'en',
        responseStyle: 'friendly'
      }
    }
  })
}

// Pre-save middleware
chatSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    // Update last message timestamp
    if (this.messages.length > 0) {
      const lastMsg = this.messages[this.messages.length - 1]
      this.lastMessage = {
        content: lastMsg.message,
        senderId: lastMsg.senderId,
        timestamp: lastMsg.createdAt || new Date()
      }
    }
  }
  next()
})

module.exports = mongoose.model('Chat', chatSchema)