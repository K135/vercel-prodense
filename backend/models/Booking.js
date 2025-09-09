const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  dentistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dentist',
    required: true
  },
  
  // Booking Details
  bookingNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  treatmentType: {
    type: String,
    required: [true, 'Treatment type is required'],
    enum: {
      values: [
        'consultation', 'cleaning', 'filling', 'root-canal',
        'crown', 'bridge', 'implant', 'extraction',
        'orthodontics', 'whitening', 'veneer', 'denture',
        'gum-treatment', 'oral-surgery', 'emergency', 'other'
      ],
      message: 'Invalid treatment type'
    }
  },
  
  treatmentDescription: {
    type: String,
    trim: true,
    maxlength: [1000, 'Treatment description cannot exceed 1000 characters']
  },
  
  // Scheduling
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  
  duration: {
    type: Number, // in minutes
    default: 60
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: {
      values: [
        'pending', 'confirmed', 'scheduled', 'in-progress',
        'completed', 'cancelled', 'no-show', 'rescheduled'
      ],
      message: 'Invalid booking status'
    },
    default: 'pending'
  },
  
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String
  }],
  
  // Pricing
  estimatedCost: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    breakdown: [{
      item: String,
      cost: Number,
      description: String
    }]
  },
  
  finalCost: {
    amount: Number,
    currency: { type: String, default: 'INR' },
    breakdown: [{
      item: String,
      cost: Number,
      description: String
    }]
  },
  
  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank-transfer', 'insurance']
  },
  
  // Location Details
  clinic: {
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
      email: String
    }
  },
  
  // Special Requirements
  specialRequirements: {
    type: String,
    trim: true,
    maxlength: [500, 'Special requirements cannot exceed 500 characters']
  },
  
  // Communication
  notes: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: false
    }
  }],
  
  // Reminders
  reminders: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: false },
    reminderTimes: [{
      type: String,
      enum: ['24h', '12h', '6h', '2h', '1h', '30m']
    }]
  },
  
  // Follow-up
  followUpRequired: {
    type: Boolean,
    default: false
  },
  
  followUpDate: Date,
  
  // Cancellation
  cancellationReason: String,
  cancellationDate: Date,
  cancellationFee: {
    amount: Number,
    currency: { type: String, default: 'INR' }
  },
  
  // Rating & Review
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  review: {
    type: String,
    trim: true,
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  
  reviewDate: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true }
})

// Indexes
BookingSchema.index({ userId: 1, status: 1 })
BookingSchema.index({ dentistId: 1, appointmentDate: 1 })
// Note: bookingNumber already has unique index from schema definition
BookingSchema.index({ appointmentDate: 1, status: 1 })
BookingSchema.index({ status: 1 })
BookingSchema.index({ createdAt: -1 })

// Virtual for full appointment datetime
BookingSchema.virtual('appointmentDateTime').get(function() {
  if (!this.appointmentDate || !this.appointmentTime) return null
  
  const [hours, minutes] = this.appointmentTime.split(':')
  const datetime = new Date(this.appointmentDate)
  datetime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
  
  return datetime
})

// Virtual to check if appointment is upcoming
BookingSchema.virtual('isUpcoming').get(function() {
  if (!this.appointmentDateTime) return false
  return this.appointmentDateTime > new Date() && 
         ['confirmed', 'scheduled'].includes(this.status)
})

// Virtual to check if booking can be cancelled
BookingSchema.virtual('canCancel').get(function() {
  if (!this.appointmentDateTime) return false
  const hoursUntilAppointment = (this.appointmentDateTime - new Date()) / (1000 * 60 * 60)
  return hoursUntilAppointment > 24 && ['pending', 'confirmed', 'scheduled'].includes(this.status)
})

// Pre-save middleware to generate booking number
BookingSchema.pre('save', async function(next) {
  if (this.isNew && !this.bookingNumber) {
    const count = await this.constructor.countDocuments()
    this.bookingNumber = `BK${Date.now()}${String(count + 1).padStart(4, '0')}`
  }
  
  // Add status change to history
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      reason: 'Status updated'
    })
  }
  
  next()
})

// Static method to get upcoming bookings
BookingSchema.statics.getUpcoming = function(userId) {
  return this.find({
    userId,
    appointmentDate: { $gte: new Date() },
    status: { $in: ['confirmed', 'scheduled'] }
  }).populate('dentistId').sort({ appointmentDate: 1 })
}

// Static method to get booking history
BookingSchema.statics.getHistory = function(userId) {
  return this.find({
    userId,
    status: { $in: ['completed', 'cancelled', 'no-show'] }
  }).populate('dentistId').sort({ appointmentDate: -1 })
}

module.exports = mongoose.model('Booking', BookingSchema)