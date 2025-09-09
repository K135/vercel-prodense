const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Conversation Details
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  
  // Message Content
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [4000, 'Message cannot exceed 4000 characters']
  },
  
  // Message Type
  type: {
    type: String,
    enum: {
      values: [
        'text', 'image', 'file', 'audio', 'video',
        'quick-reply', 'button', 'carousel', 'list',
        'location', 'contact', 'system', 'ai-response'
      ],
      message: 'Invalid message type'
    },
    default: 'text'
  },
  
  // Sender Information
  sender: {
    type: {
      type: String,
      enum: ['user', 'ai', 'dentist', 'admin', 'system'],
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'sender.model'
    },
    model: {
      type: String,
      enum: ['User', 'Dentist', 'Admin']
    },
    name: String,
    avatar: String
  },
  
  // AI/Bot Specific Fields
  aiContext: {
    intent: String, // detected user intent
    confidence: Number, // confidence score 0-1
    entities: [{
      entity: String,
      value: String,
      confidence: Number
    }],
    sessionId: String,
    model: {
      type: String,
      enum: ['gpt-4', 'gpt-3.5-turbo', 'claude', 'custom'],
      default: 'gpt-3.5-turbo'
    },
    tokens: {
      input: Number,
      output: Number,
      total: Number
    },
    responseTime: Number, // in milliseconds
    isFollowUp: Boolean
  },
  
  // Message Status
  status: {
    type: String,
    enum: ['sending', 'sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  
  // Rich Content
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'document', 'audio', 'video', 'file']
    },
    fileName: String,
    originalName: String,
    filePath: String,
    fileSize: Number,
    mimeType: String,
    url: String,
    thumbnail: String, // for images/videos
    duration: Number, // for audio/video in seconds
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  // Interactive Elements
  quickReplies: [{
    text: String,
    payload: String,
    imageUrl: String
  }],
  
  buttons: [{
    type: {
      type: String,
      enum: ['postback', 'web_url', 'phone_number']
    },
    title: String,
    payload: String,
    url: String,
    phoneNumber: String
  }],
  
  // Location Data
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    name: String
  },
  
  // Contact Information
  contact: {
    name: String,
    phone: String,
    email: String
  },
  
  // Message Context
  context: {
    category: {
      type: String,
      enum: [
        'general-inquiry', 'appointment-booking', 'treatment-info',
        'cost-inquiry', 'emergency', 'complaint', 'feedback',
        'technical-support', 'billing', 'insurance', 'other'
      ]
    },
    relatedTo: {
      model: {
        type: String,
        enum: ['Booking', 'Treatment', 'Report', 'Itinerary', 'CostEstimate']
      },
      id: mongoose.Schema.Types.ObjectId
    },
    language: {
      type: String,
      default: 'en'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    }
  },
  
  // Threading (for replies)
  parentMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  threadId: String,
  
  // Reactions & Feedback
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reaction: {
      type: String,
      enum: ['like', 'dislike', 'love', 'laugh', 'angry', 'sad']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    isHelpful: Boolean,
    feedbackAt: Date
  },
  
  // Message Analytics
  analytics: {
    readAt: Date,
    responseTime: Number, // time to respond in milliseconds
    clickCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 }
  },
  
  // Moderation
  moderation: {
    isReviewed: { type: Boolean, default: false },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    flags: [{
      type: {
        type: String,
        enum: ['spam', 'inappropriate', 'offensive', 'misleading', 'other']
      },
      reason: String,
      flaggedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      flaggedAt: {
        type: Date,
        default: Date.now
      }
    }],
    isBlocked: { type: Boolean, default: false },
    blockedReason: String
  },
  
  // Scheduling (for delayed messages)
  scheduledFor: Date,
  
  // Message Metadata
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'api', 'whatsapp', 'telegram', 'facebook', 'other'],
      default: 'web'
    },
    userAgent: String,
    ipAddress: String,
    deviceInfo: {
      type: String,
      platform: String,
      browser: String
    },
    sessionInfo: {
      sessionId: String,
      pageUrl: String,
      referrer: String
    }
  },
  
  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
})

// Indexes
MessageSchema.index({ userId: 1, conversationId: 1 })
MessageSchema.index({ conversationId: 1, createdAt: -1 })
MessageSchema.index({ 'sender.type': 1, 'sender.id': 1 })
MessageSchema.index({ status: 1 })
MessageSchema.index({ 'context.category': 1 })
MessageSchema.index({ parentMessageId: 1 })
MessageSchema.index({ threadId: 1 })
MessageSchema.index({ scheduledFor: 1 })
MessageSchema.index({ createdAt: -1 })
MessageSchema.index({ isDeleted: 1 })

// Virtual for message age
MessageSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime()
})

// Virtual for is recent (within last hour)
MessageSchema.virtual('isRecent').get(function() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  return this.createdAt > oneHourAgo
})

// Virtual for attachment count
MessageSchema.virtual('attachmentCount').get(function() {
  return this.attachments ? this.attachments.length : 0
})

// Virtual for has reactions
MessageSchema.virtual('hasReactions').get(function() {
  return this.reactions && this.reactions.length > 0
})

// Instance method to add reaction
MessageSchema.methods.addReaction = function(userId, reaction) {
  // Remove existing reaction from this user
  this.reactions = this.reactions.filter(r => 
    r.userId.toString() !== userId.toString()
  )
  
  // Add new reaction
  this.reactions.push({
    userId,
    reaction,
    createdAt: new Date()
  })
  
  return this.save()
}

// Instance method to mark as read
MessageSchema.methods.markAsRead = function() {
  if (this.status !== 'read') {
    this.status = 'read'
    this.analytics.readAt = new Date()
  }
  return this.save()
}

// Instance method to add feedback
MessageSchema.methods.addFeedback = function(rating, comment, isHelpful) {
  this.feedback = {
    rating,
    comment,
    isHelpful,
    feedbackAt: new Date()
  }
  return this.save()
}

// Static method to get conversation messages
MessageSchema.statics.getConversation = function(conversationId, limit = 50, offset = 0) {
  return this.find({
    conversationId,
    isDeleted: false
  })
  .populate('sender.id', 'firstName lastName avatar')
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(offset)
}

// Static method to get user conversations
MessageSchema.statics.getUserConversations = function(userId) {
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        isDeleted: false
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: '$conversationId',
        lastMessage: { $first: '$$ROOT' },
        messageCount: { $sum: 1 },
        unreadCount: {
          $sum: {
            $cond: [{ $ne: ['$status', 'read'] }, 1, 0]
          }
        }
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    }
  ])
}

// Static method to create AI response
MessageSchema.statics.createAIResponse = function(userId, conversationId, content, aiContext = {}) {
  return this.create({
    userId,
    conversationId,
    content,
    type: 'ai-response',
    sender: {
      type: 'ai',
      name: 'Dental Assistant',
      avatar: '/images/ai-avatar.png'
    },
    aiContext: {
      ...aiContext,
      responseTime: aiContext.responseTime || 0,
      model: aiContext.model || 'gpt-3.5-turbo'
    },
    status: 'sent'
  })
}

// Static method to search messages
MessageSchema.statics.searchMessages = function(userId, query, filters = {}) {
  const searchQuery = {
    userId,
    isDeleted: false,
    content: new RegExp(query, 'i')
  }
  
  if (filters.conversationId) {
    searchQuery.conversationId = filters.conversationId
  }
  
  if (filters.type) {
    searchQuery.type = filters.type
  }
  
  if (filters.senderType) {
    searchQuery['sender.type'] = filters.senderType
  }
  
  if (filters.category) {
    searchQuery['context.category'] = filters.category
  }
  
  if (filters.dateFrom || filters.dateTo) {
    searchQuery.createdAt = {}
    if (filters.dateFrom) {
      searchQuery.createdAt.$gte = new Date(filters.dateFrom)
    }
    if (filters.dateTo) {
      searchQuery.createdAt.$lte = new Date(filters.dateTo)
    }
  }
  
  return this.find(searchQuery)
    .populate('sender.id', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .limit(filters.limit || 50)
}

// Pre-save middleware
MessageSchema.pre('save', function(next) {
  // Generate conversation ID if not provided
  if (this.isNew && !this.conversationId) {
    this.conversationId = `conv_${this.userId}_${Date.now()}`
  }
  
  // Set deletedAt when isDeleted is true
  if (this.isModified('isDeleted') && this.isDeleted) {
    this.deletedAt = new Date()
  }
  
  next()
})

module.exports = mongoose.model('Message', MessageSchema)