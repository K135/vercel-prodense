const mongoose = require('mongoose')

const OTPSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: [true, 'Identifier is required'],
    trim: true
  },
  otp: {
    type: String,
    required: [true, 'OTP is required'],
    length: 6
  },
  type: {
    type: String,
    enum: {
      values: ['phone', 'email'],
      message: 'Type must be either phone or email'
    },
    required: [true, 'Type is required']
  },
  purpose: {
    type: String,
    enum: {
      values: ['login', 'signup', 'verification', 'password-reset'],
      message: 'Purpose must be login, signup, verification, or password-reset'
    },
    required: [true, 'Purpose is required'],
    default: 'login'
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10
      return new Date(Date.now() + expiryMinutes * 60 * 1000)
    }
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    max: [process.env.NODE_ENV === 'development' ? 50 : 5, 'Maximum attempts exceeded']
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
})

// Index for automatic deletion of expired documents
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Index for faster lookups
OTPSchema.index({ identifier: 1, type: 1, purpose: 1 })
OTPSchema.index({ isUsed: 1, expiresAt: 1 })

// Instance method to check if OTP is valid
OTPSchema.methods.isValid = function() {
  const maxAttempts = process.env.NODE_ENV === 'development' ? 50 : 5
  return !this.isUsed && this.expiresAt > new Date() && this.attempts < maxAttempts
}

// Instance method to increment attempts
OTPSchema.methods.incrementAttempts = function() {
  this.attempts += 1
  return this.save()
}

// Instance method to mark as used
OTPSchema.methods.markAsUsed = function() {
  this.isUsed = true
  return this.save()
}

// Static method to generate OTP
OTPSchema.statics.generateOTP = function() {
  // In development, use default OTP for testing
  if (process.env.NODE_ENV === 'development' && process.env.DEFAULT_OTP) {
    return process.env.DEFAULT_OTP
  }
  
  // Generate random 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Static method to create new OTP
OTPSchema.statics.createOTP = async function(identifier, type, purpose = 'login', req = null) {
  // Delete any existing OTP for this identifier
  await this.deleteMany({ identifier, type, purpose })
  
  const otp = this.generateOTP()
  
  const otpData = {
    identifier,
    otp,
    type,
    purpose
  }
  
  // Add request metadata if available
  if (req) {
    otpData.ipAddress = req.ip || req.connection.remoteAddress
    otpData.userAgent = req.get('User-Agent')
  }
  
  const otpRecord = new this(otpData)
  await otpRecord.save()
  
  return otpRecord
}

module.exports = mongoose.model('OTP', OTPSchema)