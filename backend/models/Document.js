const mongoose = require('mongoose')

const DocumentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Document Details
  title: {
    type: String,
    required: [true, 'Document title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  type: {
    type: String,
    required: [true, 'Document type is required'],
    enum: {
      values: [
        'passport', 'visa', 'id-card', 'driving-license',
        'medical-report', 'dental-xray', 'prescription',
        'insurance-card', 'travel-insurance', 'vaccination-certificate',
        'blood-test', 'other'
      ],
      message: 'Invalid document type'
    }
  },
  
  category: {
    type: String,
    enum: ['identity', 'medical', 'travel', 'insurance', 'other'],
    required: true
  },
  
  // File Information
  fileName: {
    type: String,
    required: true
  },
  
  originalName: {
    type: String,
    required: true
  },
  
  filePath: {
    type: String,
    required: true
  },
  
  fileSize: {
    type: Number,
    required: true
  },
  
  mimeType: {
    type: String,
    required: true
  },

  // Thumbnail Information
  thumbnailPath: {
    type: String
  },

  hasThumbnail: {
    type: Boolean,
    default: false
  },
  
  // Document Metadata
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  issueDate: Date,
  expiryDate: Date,
  
  // Verification Status
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'expired'],
    default: 'pending'
  },
  
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  verifiedAt: Date,
  
  rejectionReason: {
    type: String,
    trim: true
  },
  
  // Access Control
  isPublic: {
    type: Boolean,
    default: false
  },
  
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    },
    permissions: {
      type: String,
      enum: ['view', 'download'],
      default: 'view'
    }
  }],
  
  // Tags for organization
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
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
DocumentSchema.index({ userId: 1, isDeleted: 1 })
DocumentSchema.index({ type: 1 })
DocumentSchema.index({ category: 1 })
DocumentSchema.index({ verificationStatus: 1 })
DocumentSchema.index({ expiryDate: 1 })
DocumentSchema.index({ tags: 1 })
DocumentSchema.index({ createdAt: -1 })

// Virtual for file URL (to be implemented with cloud storage)
DocumentSchema.virtual('fileUrl').get(function() {
  // This would return the full URL to access the file
  // For now, return a placeholder
  return `/api/user/documents/${this._id}/view`
})

// Virtual for thumbnail URL
DocumentSchema.virtual('thumbnailUrl').get(function() {
  if (this.hasThumbnail) {
    return `/api/user/documents/${this._id}/thumbnail`
  }
  return null
})

// Virtual to check if document is expired
DocumentSchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false
  return new Date() > this.expiryDate
})

// Instance method to check if user can access document
DocumentSchema.methods.canAccess = function(userId) {
  // Owner can always access
  if (this.userId.toString() === userId.toString()) return true
  
  // Check if document is public
  if (this.isPublic) return true
  
  // Check if shared with user
  return this.sharedWith.some(share => 
    share.userId.toString() === userId.toString()
  )
}

// Static method to get documents by category
DocumentSchema.statics.getByCategory = function(userId, category) {
  return this.find({
    userId,
    category,
    isDeleted: false
  }).sort({ createdAt: -1 })
}

// Pre-save middleware to set deletedAt when isDeleted is true
DocumentSchema.pre('save', function(next) {
  if (this.isModified('isDeleted') && this.isDeleted) {
    this.deletedAt = new Date()
  }
  next()
})

module.exports = mongoose.model('Document', DocumentSchema)