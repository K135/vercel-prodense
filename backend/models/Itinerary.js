const mongoose = require('mongoose')

const ItinerarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Trip Details
  title: {
    type: String,
    required: [true, 'Itinerary title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Travel Dates
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  
  // Destination
  destination: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Treatment Schedule
  treatments: [{
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    treatmentType: String,
    dentistName: String,
    clinicName: String,
    appointmentDate: Date,
    appointmentTime: String,
    duration: Number, // in minutes
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled'
    },
    notes: String
  }],
  
  // Accommodation
  accommodation: {
    type: {
      type: String,
      enum: ['hotel', 'guesthouse', 'apartment', 'hostel', 'other']
    },
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String
    },
    contact: {
      phone: String,
      email: String,
      website: String
    },
    checkIn: Date,
    checkOut: Date,
    roomType: String,
    bookingReference: String,
    cost: {
      amount: Number,
      currency: { type: String, default: 'INR' },
      perNight: Boolean
    },
    amenities: [String],
    rating: Number,
    notes: String
  },
  
  // Transportation
  transportation: {
    arrival: {
      mode: {
        type: String,
        enum: ['flight', 'train', 'bus', 'car', 'other']
      },
      details: {
        flightNumber: String,
        trainNumber: String,
        busOperator: String,
        departureLocation: String,
        arrivalLocation: String,
        departureTime: Date,
        arrivalTime: Date,
        bookingReference: String,
        cost: {
          amount: Number,
          currency: { type: String, default: 'INR' }
        }
      }
    },
    departure: {
      mode: {
        type: String,
        enum: ['flight', 'train', 'bus', 'car', 'other']
      },
      details: {
        flightNumber: String,
        trainNumber: String,
        busOperator: String,
        departureLocation: String,
        arrivalLocation: String,
        departureTime: Date,
        arrivalTime: Date,
        bookingReference: String,
        cost: {
          amount: Number,
          currency: { type: String, default: 'INR' }
        }
      }
    },
    local: [{
      date: Date,
      mode: {
        type: String,
        enum: ['taxi', 'uber', 'auto', 'bus', 'metro', 'walking', 'other']
      },
      from: String,
      to: String,
      estimatedCost: {
        amount: Number,
        currency: { type: String, default: 'INR' }
      },
      notes: String
    }]
  },
  
  // Activities & Sightseeing
  activities: [{
    title: String,
    description: String,
    date: Date,
    time: String,
    duration: Number, // in minutes
    location: {
      name: String,
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    cost: {
      amount: Number,
      currency: { type: String, default: 'INR' }
    },
    category: {
      type: String,
      enum: ['sightseeing', 'cultural', 'adventure', 'relaxation', 'shopping', 'dining', 'other']
    },
    bookingRequired: Boolean,
    bookingReference: String,
    notes: String
  }],
  
  // Budget Tracking
  budget: {
    total: {
      amount: Number,
      currency: { type: String, default: 'INR' }
    },
    breakdown: {
      treatment: { amount: Number, currency: { type: String, default: 'INR' } },
      accommodation: { amount: Number, currency: { type: String, default: 'INR' } },
      transportation: { amount: Number, currency: { type: String, default: 'INR' } },
      food: { amount: Number, currency: { type: String, default: 'INR' } },
      activities: { amount: Number, currency: { type: String, default: 'INR' } },
      miscellaneous: { amount: Number, currency: { type: String, default: 'INR' } }
    },
    spent: {
      amount: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' }
    }
  },
  
  // Emergency Information
  emergencyContacts: [{
    name: String,
    relationship: String,
    phone: String,
    email: String,
    isLocal: Boolean
  }],
  
  // Important Documents
  documents: [{
    type: {
      type: String,
      enum: ['passport', 'visa', 'ticket', 'hotel-booking', 'insurance', 'medical-records', 'other']
    },
    title: String,
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    notes: String
  }],
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'draft'
  },
  
  // Sharing
  isShared: {
    type: Boolean,
    default: false
  },
  
  sharedWith: [{
    email: String,
    name: String,
    sharedAt: { type: Date, default: Date.now },
    permissions: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    }
  }],
  
  // Reminders
  reminders: [{
    title: String,
    description: String,
    reminderDate: Date,
    type: {
      type: String,
      enum: ['appointment', 'travel', 'document', 'payment', 'other']
    },
    isCompleted: { type: Boolean, default: false },
    completedAt: Date
  }],
  
  // Notes
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
})

// Indexes
ItinerarySchema.index({ userId: 1, status: 1 })
ItinerarySchema.index({ startDate: 1, endDate: 1 })
ItinerarySchema.index({ 'destination.city': 1 })
ItinerarySchema.index({ status: 1 })
ItinerarySchema.index({ createdAt: -1 })

// Virtual for trip duration
ItinerarySchema.virtual('duration').get(function() {
  if (!this.startDate || !this.endDate) return 0
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24))
})

// Virtual for total treatments
ItinerarySchema.virtual('totalTreatments').get(function() {
  return this.treatments.length
})

// Virtual for completed treatments
ItinerarySchema.virtual('completedTreatments').get(function() {
  return this.treatments.filter(t => t.status === 'completed').length
})

// Virtual for progress percentage
ItinerarySchema.virtual('progressPercentage').get(function() {
  if (this.treatments.length === 0) return 0
  return Math.round((this.completedTreatments / this.totalTreatments) * 100)
})

// Virtual for budget utilization
ItinerarySchema.virtual('budgetUtilization').get(function() {
  if (!this.budget.total.amount || this.budget.total.amount === 0) return 0
  return Math.round((this.budget.spent.amount / this.budget.total.amount) * 100)
})

// Virtual to check if trip is current
ItinerarySchema.virtual('isCurrent').get(function() {
  const now = new Date()
  return this.startDate <= now && this.endDate >= now
})

// Virtual to check if trip is upcoming
ItinerarySchema.virtual('isUpcoming').get(function() {
  return this.startDate > new Date()
})

// Instance method to add treatment
ItinerarySchema.methods.addTreatment = function(bookingId, treatmentDetails) {
  this.treatments.push({
    bookingId,
    ...treatmentDetails
  })
  return this.save()
}

// Instance method to update budget spent
ItinerarySchema.methods.updateBudgetSpent = function(amount, category = 'miscellaneous') {
  this.budget.spent.amount += amount
  if (this.budget.breakdown[category]) {
    this.budget.breakdown[category].amount += amount
  }
  return this.save()
}

// Static method to get current itineraries
ItinerarySchema.statics.getCurrent = function(userId) {
  const now = new Date()
  return this.find({
    userId,
    startDate: { $lte: now },
    endDate: { $gte: now },
    status: { $in: ['confirmed', 'in-progress'] }
  }).populate('treatments.bookingId')
}

// Static method to get upcoming itineraries
ItinerarySchema.statics.getUpcoming = function(userId) {
  return this.find({
    userId,
    startDate: { $gt: new Date() },
    status: { $in: ['draft', 'confirmed'] }
  }).sort({ startDate: 1 })
}

// Pre-save validation
ItinerarySchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date'))
  }
  next()
})

module.exports = mongoose.model('Itinerary', ItinerarySchema)