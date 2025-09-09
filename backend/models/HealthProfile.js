const mongoose = require('mongoose')

const HealthProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Medical History
  medicalHistory: {
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      trim: true
    },
    allergies: [{
      type: String,
      trim: true
    }],
    medications: [{
      name: { type: String, trim: true },
      dosage: { type: String, trim: true },
      frequency: { type: String, trim: true }
    }],
    chronicConditions: [{
      condition: { type: String, trim: true },
      diagnosedDate: Date,
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe']
      }
    }],
    surgeries: [{
      procedure: { type: String, trim: true },
      date: Date,
      hospital: { type: String, trim: true }
    }]
  },
  
  // Dental History
  dentalHistory: {
    lastDentalVisit: Date,
    dentalProblems: [{
      problem: { type: String, trim: true },
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe']
      },
      dateReported: { type: Date, default: Date.now }
    }],
    previousTreatments: [{
      treatment: { type: String, trim: true },
      date: Date,
      dentist: { type: String, trim: true },
      location: { type: String, trim: true }
    }],
    oralHygiene: {
      brushingFrequency: {
        type: String,
        enum: ['once-daily', 'twice-daily', 'after-meals', 'rarely']
      },
      flossingFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'rarely', 'never']
      },
      mouthwashUse: Boolean
    }
  },
  
  // Emergency Contact
  emergencyContact: {
    name: { type: String, trim: true },
    relationship: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true }
  },
  
  // Insurance Information
  insurance: {
    provider: { type: String, trim: true },
    policyNumber: { type: String, trim: true },
    groupNumber: { type: String, trim: true },
    expiryDate: Date,
    coverageType: {
      type: String,
      enum: ['basic', 'comprehensive', 'premium']
    }
  },
  
  // Preferences
  preferences: {
    preferredLanguage: { type: String, default: 'english' },
    communicationMethod: {
      type: String,
      enum: ['email', 'sms', 'phone', 'whatsapp'],
      default: 'email'
    },
    appointmentReminders: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
})

// Indexes
HealthProfileSchema.index({ userId: 1 })
HealthProfileSchema.index({ 'dentalHistory.lastDentalVisit': -1 })

// Virtual for profile completeness
HealthProfileSchema.virtual('completeness').get(function() {
  let score = 0
  const maxScore = 12
  
  // Check medical history completeness
  if (this.medicalHistory.bloodType) score += 1
  if (this.medicalHistory.allergies.length > 0) score += 1
  if (this.medicalHistory.medications.length > 0) score += 1
  if (this.medicalHistory.chronicConditions.length > 0) score += 1
  
  // Check dental history completeness
  if (this.dentalHistory.lastDentalVisit) score += 2
  if (this.dentalHistory.dentalProblems.length > 0) score += 1
  if (this.dentalHistory.oralHygiene.brushingFrequency) score += 1
  if (this.dentalHistory.oralHygiene.flossingFrequency) score += 1
  
  // Check emergency contact
  if (this.emergencyContact.name && this.emergencyContact.phone) score += 2
  
  // Check preferences
  if (this.preferences.preferredLanguage) score += 1
  
  return Math.round((score / maxScore) * 100)
})

module.exports = mongoose.model('HealthProfile', HealthProfileSchema)