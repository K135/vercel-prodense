const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Report Details
  title: {
    type: String,
    required: [true, 'Report title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  type: {
    type: String,
    required: [true, 'Report type is required'],
    enum: {
      values: [
        'dental-xray', 'ct-scan', 'panoramic-xray', 'intraoral-photo',
        'treatment-plan', 'progress-report', 'lab-report', 'prescription',
        'discharge-summary', 'follow-up-report', 'consultation-notes', 'other'
      ],
      message: 'Invalid report type'
    }
  },
  
  category: {
    type: String,
    enum: ['diagnostic', 'treatment', 'follow-up', 'administrative'],
    required: true
  },
  
  // Associated Treatment
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  
  dentistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dentist'
  },
  
  clinicName: String,
  
  // Report Content
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  findings: [{
    category: {
      type: String,
      enum: ['normal', 'abnormal', 'requires-attention', 'urgent']
    },
    description: String,
    location: String, // tooth number or area
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    }
  }],
  
  diagnosis: [{
    condition: String,
    icd10Code: String, // International Classification of Diseases code
    description: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    }
  }],
  
  recommendations: [{
    treatment: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent']
    },
    description: String,
    estimatedCost: {
      amount: Number,
      currency: { type: String, default: 'INR' }
    },
    timeframe: String
  }],
  
  // File Attachments
  files: [{
    fileName: String,
    originalName: String,
    filePath: String,
    fileSize: Number,
    mimeType: String,
    fileType: {
      type: String,
      enum: ['image', 'pdf', 'document', 'video', 'other']
    },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Report Metadata
  reportDate: {
    type: Date,
    required: [true, 'Report date is required'],
    default: Date.now
  },
  
  reportNumber: {
    type: String,
    unique: true
  },
  
  // Verification & Approval
  status: {
    type: String,
    enum: ['draft', 'pending-review', 'approved', 'rejected', 'archived'],
    default: 'draft'
  },
  
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dentist'
  },
  
  reviewedAt: Date,
  
  approvalNotes: String,
  
  // Sharing & Access
  isShared: {
    type: Boolean,
    default: false
  },
  
  sharedWith: [{
    recipientType: {
      type: String,
      enum: ['dentist', 'patient', 'clinic', 'insurance', 'other']
    },
    recipientId: mongoose.Schema.Types.ObjectId,
    recipientEmail: String,
    recipientName: String,
    sharedAt: { type: Date, default: Date.now },
    permissions: {
      type: String,
      enum: ['view', 'download', 'edit'],
      default: 'view'
    },
    expiresAt: Date,
    accessCount: { type: Number, default: 0 },
    lastAccessedAt: Date
  }],
  
  // Cloud Storage
  cloudStorage: {
    provider: {
      type: String,
      enum: ['aws-s3', 'google-cloud', 'azure', 'local']
    },
    bucketName: String,
    objectKey: String,
    publicUrl: String,
    backupUrl: String
  },
  
  // Privacy & Compliance
  privacyLevel: {
    type: String,
    enum: ['public', 'private', 'confidential', 'restricted'],
    default: 'private'
  },
  
  complianceFlags: [{
    standard: {
      type: String,
      enum: ['hipaa', 'gdpr', 'pipeda', 'local-privacy-law']
    },
    isCompliant: Boolean,
    notes: String
  }],
  
  // Analytics
  analytics: {
    viewCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    lastViewedAt: Date,
    lastDownloadedAt: Date
  },
  
  // Tags for organization
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Follow-up
  followUpRequired: {
    type: Boolean,
    default: false
  },
  
  followUpDate: Date,
  followUpNotes: String,
  
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
ReportSchema.index({ userId: 1, isDeleted: 1 })
ReportSchema.index({ type: 1 })
ReportSchema.index({ category: 1 })
ReportSchema.index({ status: 1 })
ReportSchema.index({ reportDate: -1 })
ReportSchema.index({ bookingId: 1 })
ReportSchema.index({ dentistId: 1 })
// Note: reportNumber already has unique index from schema definition
ReportSchema.index({ tags: 1 })
ReportSchema.index({ createdAt: -1 })

// Virtual for file URLs
ReportSchema.virtual('fileUrls').get(function() {
  return this.files.map(file => ({
    ...file.toObject(),
    url: `/api/reports/${this._id}/files/${file._id}/download`
  }))
})

// Virtual for urgency level based on findings
ReportSchema.virtual('urgencyLevel').get(function() {
  const urgentFindings = this.findings.filter(f => f.category === 'urgent')
  const highPriorityRecommendations = this.recommendations.filter(r => r.priority === 'urgent' || r.priority === 'high')
  
  if (urgentFindings.length > 0 || highPriorityRecommendations.length > 0) {
    return 'urgent'
  }
  
  const abnormalFindings = this.findings.filter(f => f.category === 'abnormal' || f.category === 'requires-attention')
  if (abnormalFindings.length > 0) {
    return 'medium'
  }
  
  return 'low'
})

// Virtual for total file size
ReportSchema.virtual('totalFileSize').get(function() {
  return this.files.reduce((total, file) => total + (file.fileSize || 0), 0)
})

// Pre-save middleware to generate report number
ReportSchema.pre('save', async function(next) {
  if (this.isNew && !this.reportNumber) {
    const count = await this.constructor.countDocuments()
    const year = new Date().getFullYear()
    this.reportNumber = `RPT${year}${String(count + 1).padStart(6, '0')}`
  }
  
  // Set deletedAt when isDeleted is true
  if (this.isModified('isDeleted') && this.isDeleted) {
    this.deletedAt = new Date()
  }
  
  next()
})

// Instance method to add file
ReportSchema.methods.addFile = function(fileData) {
  this.files.push(fileData)
  return this.save()
}

// Instance method to share report
ReportSchema.methods.shareWith = function(recipientData) {
  this.sharedWith.push(recipientData)
  this.isShared = true
  this.analytics.shareCount += 1
  return this.save()
}

// Instance method to track view
ReportSchema.methods.trackView = function() {
  this.analytics.viewCount += 1
  this.analytics.lastViewedAt = new Date()
  return this.save()
}

// Instance method to track download
ReportSchema.methods.trackDownload = function() {
  this.analytics.downloadCount += 1
  this.analytics.lastDownloadedAt = new Date()
  return this.save()
}

// Static method to get reports by type
ReportSchema.statics.getByType = function(userId, type) {
  return this.find({
    userId,
    type,
    isDeleted: false
  }).sort({ reportDate: -1 })
}

// Static method to get recent reports
ReportSchema.statics.getRecent = function(userId, limit = 10) {
  return this.find({
    userId,
    isDeleted: false
  })
  .populate('bookingId dentistId')
  .sort({ reportDate: -1 })
  .limit(limit)
}

// Static method to search reports
ReportSchema.statics.search = function(userId, query) {
  const searchRegex = new RegExp(query, 'i')
  
  return this.find({
    userId,
    isDeleted: false,
    $or: [
      { title: searchRegex },
      { description: searchRegex },
      { 'findings.description': searchRegex },
      { 'diagnosis.condition': searchRegex },
      { tags: searchRegex }
    ]
  }).sort({ reportDate: -1 })
}

module.exports = mongoose.model('Report', ReportSchema)