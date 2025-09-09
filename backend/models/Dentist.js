const mongoose = require('mongoose')

const DentistSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  
  // Professional Information
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    trim: true
  },
  
  specializations: [{
    type: String,
    enum: [
      'general-dentistry', 'orthodontics', 'periodontics', 'endodontics',
      'oral-surgery', 'prosthodontics', 'pediatric-dentistry', 'cosmetic-dentistry',
      'implantology', 'oral-pathology', 'maxillofacial-surgery'
    ]
  }],
  
  experience: {
    type: Number, // years of experience
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  
  qualifications: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: Number, required: true },
    country: { type: String, default: 'India' }
  }],
  
  // Clinic Information
  clinics: [{
    name: { type: String, required: true },
    address: {
      street: String,
      city: String,
      state: String,
      country: { type: String, default: 'India' },
      pincode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    contact: {
      phone: String,
      email: String,
      website: String
    },
    facilities: [{
      type: String,
      enum: [
        'digital-xray', 'ct-scan', 'laser-treatment', 'sedation',
        'emergency-care', 'wheelchair-accessible', 'parking',
        'wifi', 'air-conditioning', 'sterilization-equipment'
      ]
    }],
    operatingHours: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      openTime: String,
      closeTime: String,
      isOpen: { type: Boolean, default: true }
    }],
    isPrimary: { type: Boolean, default: false }
  }],
  
  // Professional Details
  languages: [{
    type: String,
    enum: ['english', 'hindi', 'bengali', 'tamil', 'telugu', 'marathi', 'gujarati', 'kannada', 'malayalam', 'punjabi', 'other']
  }],
  
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  
  // Ratings & Reviews
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
    breakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  
  // Pricing
  consultationFee: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' }
  },
  
  treatmentPricing: [{
    treatment: {
      type: String,
      enum: [
        'consultation', 'cleaning', 'filling', 'root-canal',
        'crown', 'bridge', 'implant', 'extraction',
        'orthodontics', 'whitening', 'veneer', 'denture',
        'gum-treatment', 'oral-surgery'
      ]
    },
    minPrice: Number,
    maxPrice: Number,
    currency: { type: String, default: 'INR' },
    description: String
  }],
  
  // Availability
  availability: {
    isAcceptingPatients: { type: Boolean, default: true },
    nextAvailableDate: Date,
    bookingAdvanceDays: { type: Number, default: 30 }, // how far in advance bookings can be made
    cancellationPolicy: {
      type: String,
      enum: ['24h', '48h', '72h', 'flexible'],
      default: '24h'
    }
  },
  
  // Media
  profileImage: String,
  clinicImages: [String],
  certificates: [String],
  
  // Verification Status
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'suspended'],
    default: 'pending'
  },
  
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Statistics
  stats: {
    totalPatients: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    completedTreatments: { type: Number, default: 0 },
    cancellationRate: { type: Number, default: 0 }, // percentage
    responseTime: { type: Number, default: 0 }, // average response time in hours
    joinedDate: { type: Date, default: Date.now }
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastLogin: Date,
  
  // Communication Preferences
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: false },
    bookingAlerts: { type: Boolean, default: true },
    reviewAlerts: { type: Boolean, default: true }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
})

// Indexes
// Note: email and licenseNumber already have unique indexes from schema definition
DentistSchema.index({ specializations: 1 })
DentistSchema.index({ 'rating.average': -1 })
DentistSchema.index({ 'clinics.address.city': 1 })
DentistSchema.index({ 'clinics.address.state': 1 })
DentistSchema.index({ verificationStatus: 1 })
DentistSchema.index({ isActive: 1 })
DentistSchema.index({ createdAt: -1 })

// Virtual for full name
DentistSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

// Virtual for primary clinic
DentistSchema.virtual('primaryClinic').get(function() {
  if (!this.clinics || !Array.isArray(this.clinics) || this.clinics.length === 0) {
    return null
  }
  return this.clinics.find(clinic => clinic.isPrimary) || this.clinics[0]
})

// Virtual for years of experience display
DentistSchema.virtual('experienceDisplay').get(function() {
  return `${this.experience} year${this.experience !== 1 ? 's' : ''}`
})

// Instance method to check availability on a specific date
DentistSchema.methods.isAvailableOn = function(date, clinicId = null) {
  if (!this.availability.isAcceptingPatients) return false
  
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'lowercase' })
  
  // Check clinic operating hours
  const clinic = clinicId 
    ? this.clinics.id(clinicId) 
    : this.primaryClinic
  
  if (!clinic) return false
  
  const daySchedule = clinic.operatingHours.find(schedule => 
    schedule.day === dayOfWeek && schedule.isOpen
  )
  
  return !!daySchedule
}

// Instance method to update rating
DentistSchema.methods.updateRating = function(newRating) {
  this.rating.breakdown[newRating] += 1
  this.rating.count += 1
  
  // Recalculate average
  let totalScore = 0
  for (let i = 1; i <= 5; i++) {
    totalScore += i * this.rating.breakdown[i]
  }
  
  this.rating.average = totalScore / this.rating.count
  
  return this.save()
}

// Static method to search dentists
DentistSchema.statics.search = function(filters = {}) {
  const query = { isActive: true, verificationStatus: 'verified' }
  
  if (filters.city) {
    query['clinics.address.city'] = new RegExp(filters.city, 'i')
  }
  
  if (filters.state) {
    query['clinics.address.state'] = new RegExp(filters.state, 'i')
  }
  
  if (filters.specialization) {
    query.specializations = { $in: [filters.specialization] }
  }
  
  if (filters.minRating) {
    query['rating.average'] = { $gte: filters.minRating }
  }
  
  if (filters.maxConsultationFee) {
    query['consultationFee.amount'] = { $lte: filters.maxConsultationFee }
  }
  
  return this.find(query).sort({ 'rating.average': -1, 'rating.count': -1 })
}

// Static method to get top-rated dentists
DentistSchema.statics.getTopRated = function(limit = 10) {
  return this.find({
    isActive: true,
    verificationStatus: 'verified',
    'rating.count': { $gte: 5 }
  })
  .sort({ 'rating.average': -1, 'rating.count': -1 })
  .limit(limit)
}

module.exports = mongoose.model('Dentist', DentistSchema)