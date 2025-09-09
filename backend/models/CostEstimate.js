const mongoose = require('mongoose')

const CostEstimateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Estimate Details
  title: {
    type: String,
    required: [true, 'Estimate title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Treatment Information
  treatments: [{
    type: {
      type: String,
      required: true,
      enum: [
        'consultation', 'cleaning', 'filling', 'root-canal',
        'crown', 'bridge', 'implant', 'extraction',
        'orthodontics', 'whitening', 'veneer', 'denture',
        'gum-treatment', 'oral-surgery', 'emergency', 'other'
      ]
    },
    description: String,
    quantity: { type: Number, default: 1, min: 1 },
    unitCost: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'INR' }
    },
    totalCost: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'INR' }
    },
    duration: Number, // estimated duration in minutes
    complexity: {
      type: String,
      enum: ['simple', 'moderate', 'complex'],
      default: 'moderate'
    },
    notes: String
  }],
  
  // Location-based Pricing
  locations: [{
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' },
    priceMultiplier: { type: Number, default: 1.0 }, // multiplier for base cost
    averageCost: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'INR' }
    },
    topClinics: [{
      name: String,
      rating: Number,
      estimatedCost: {
        min: Number,
        max: Number,
        currency: { type: String, default: 'INR' }
      }
    }]
  }],
  
  // Additional Costs
  additionalCosts: [{
    category: {
      type: String,
      enum: [
        'consultation', 'diagnostics', 'anesthesia', 'medications',
        'follow-up', 'emergency-care', 'materials', 'lab-work', 'other'
      ],
      required: true
    },
    description: String,
    cost: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'INR' }
    },
    isOptional: { type: Boolean, default: false },
    notes: String
  }],
  
  // Travel & Accommodation Estimates
  travelCosts: {
    transportation: {
      domestic: {
        flight: { min: Number, max: Number, currency: { type: String, default: 'INR' } },
        train: { min: Number, max: Number, currency: { type: String, default: 'INR' } },
        bus: { min: Number, max: Number, currency: { type: String, default: 'INR' } }
      },
      international: {
        flight: { min: Number, max: Number, currency: { type: String, default: 'USD' } }
      },
      local: {
        perDay: { min: Number, max: Number, currency: { type: String, default: 'INR' } }
      }
    },
    accommodation: {
      budget: { min: Number, max: Number, currency: { type: String, default: 'INR' } },
      midRange: { min: Number, max: Number, currency: { type: String, default: 'INR' } },
      luxury: { min: Number, max: Number, currency: { type: String, default: 'INR' } }
    },
    meals: {
      perDay: { min: Number, max: Number, currency: { type: String, default: 'INR' } }
    },
    estimatedDays: Number
  },
  
  // Total Cost Summary
  totalCost: {
    treatment: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'INR' }
    },
    additional: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' }
    },
    travel: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' }
    },
    grandTotal: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'INR' }
    }
  },
  
  // Insurance Coverage
  insuranceCoverage: {
    isApplicable: { type: Boolean, default: false },
    provider: String,
    coveragePercentage: { type: Number, min: 0, max: 100 },
    maxCoverage: {
      amount: Number,
      currency: { type: String, default: 'INR' }
    },
    estimatedOutOfPocket: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'INR' }
    },
    notes: String
  },
  
  // Financing Options
  financingOptions: [{
    provider: String,
    type: {
      type: String,
      enum: ['emi', 'loan', 'credit-card', 'payment-plan', 'other']
    },
    interestRate: Number,
    tenure: Number, // in months
    monthlyPayment: {
      amount: Number,
      currency: { type: String, default: 'INR' }
    },
    processingFee: {
      amount: Number,
      currency: { type: String, default: 'INR' }
    },
    eligibilityCriteria: String,
    notes: String
  }],
  
  // Comparison Data
  comparisons: [{
    location: String,
    provider: String,
    totalCost: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'INR' }
    },
    quality: {
      rating: Number,
      reviews: Number
    },
    advantages: [String],
    disadvantages: [String]
  }],
  
  // Estimate Metadata
  estimateNumber: {
    type: String,
    unique: true
  },
  
  status: {
    type: String,
    enum: ['draft', 'active', 'expired', 'converted', 'archived'],
    default: 'draft'
  },
  
  validUntil: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    }
  },
  
  // Source Information
  source: {
    type: String,
    enum: ['user-input', 'ai-generated', 'dentist-provided', 'system-calculated'],
    default: 'user-input'
  },
  
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // User Preferences
  preferences: {
    preferredLocation: String,
    budgetRange: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'INR' }
    },
    priorityFactors: [{
      type: String,
      enum: ['cost', 'quality', 'convenience', 'speed', 'reputation']
    }],
    travelWillingness: {
      type: String,
      enum: ['local-only', 'within-state', 'within-country', 'international']
    }
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
  
  // Notes
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
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
CostEstimateSchema.index({ userId: 1, isDeleted: 1 })
CostEstimateSchema.index({ status: 1 })
// Note: estimateNumber already has unique index from schema definition
CostEstimateSchema.index({ validUntil: 1 })
CostEstimateSchema.index({ createdAt: -1 })

// Virtual for estimate validity
CostEstimateSchema.virtual('isValid').get(function() {
  return this.validUntil > new Date() && this.status === 'active'
})

// Virtual for days until expiry
CostEstimateSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.validUntil) return null
  const days = Math.ceil((this.validUntil - new Date()) / (1000 * 60 * 60 * 24))
  return Math.max(0, days)
})

// Virtual for savings calculation (if multiple locations)
CostEstimateSchema.virtual('potentialSavings').get(function() {
  if (this.locations.length < 2) return null
  
  const costs = this.locations.map(loc => loc.averageCost.min).filter(cost => cost)
  if (costs.length < 2) return null
  
  const minCost = Math.min(...costs)
  const maxCost = Math.max(...costs)
  
  return {
    amount: maxCost - minCost,
    percentage: Math.round(((maxCost - minCost) / maxCost) * 100),
    currency: 'INR'
  }
})

// Pre-save middleware to generate estimate number and calculate totals
CostEstimateSchema.pre('save', async function(next) {
  if (this.isNew && !this.estimateNumber) {
    const count = await this.constructor.countDocuments()
    this.estimateNumber = `EST${Date.now()}${String(count + 1).padStart(4, '0')}`
  }
  
  // Calculate total treatment cost
  let treatmentMin = 0, treatmentMax = 0
  this.treatments.forEach(treatment => {
    treatmentMin += treatment.totalCost.min
    treatmentMax += treatment.totalCost.max
  })
  
  // Calculate total additional cost
  let additionalMin = 0, additionalMax = 0
  this.additionalCosts.forEach(cost => {
    additionalMin += cost.cost.min
    additionalMax += cost.cost.max
  })
  
  // Calculate travel costs
  let travelMin = 0, travelMax = 0
  if (this.travelCosts.estimatedDays) {
    // Add accommodation and meals
    if (this.travelCosts.accommodation.budget) {
      travelMin += this.travelCosts.accommodation.budget.min * this.travelCosts.estimatedDays
      travelMax += this.travelCosts.accommodation.midRange.max * this.travelCosts.estimatedDays
    }
    if (this.travelCosts.meals.perDay) {
      travelMin += this.travelCosts.meals.perDay.min * this.travelCosts.estimatedDays
      travelMax += this.travelCosts.meals.perDay.max * this.travelCosts.estimatedDays
    }
  }
  
  // Update totals
  this.totalCost.treatment.min = treatmentMin
  this.totalCost.treatment.max = treatmentMax
  this.totalCost.additional.min = additionalMin
  this.totalCost.additional.max = additionalMax
  this.totalCost.travel.min = travelMin
  this.totalCost.travel.max = travelMax
  this.totalCost.grandTotal.min = treatmentMin + additionalMin + travelMin
  this.totalCost.grandTotal.max = treatmentMax + additionalMax + travelMax
  
  // Set deletedAt when isDeleted is true
  if (this.isModified('isDeleted') && this.isDeleted) {
    this.deletedAt = new Date()
  }
  
  next()
})

// Instance method to add treatment
CostEstimateSchema.methods.addTreatment = function(treatmentData) {
  // Calculate total cost based on quantity
  treatmentData.totalCost = {
    min: treatmentData.unitCost.min * treatmentData.quantity,
    max: treatmentData.unitCost.max * treatmentData.quantity,
    currency: treatmentData.unitCost.currency
  }
  
  this.treatments.push(treatmentData)
  return this.save()
}

// Instance method to compare with another estimate
CostEstimateSchema.methods.compareWith = function(otherEstimate) {
  return {
    costDifference: {
      min: this.totalCost.grandTotal.min - otherEstimate.totalCost.grandTotal.min,
      max: this.totalCost.grandTotal.max - otherEstimate.totalCost.grandTotal.max
    },
    percentageDifference: {
      min: Math.round(((this.totalCost.grandTotal.min - otherEstimate.totalCost.grandTotal.min) / otherEstimate.totalCost.grandTotal.min) * 100),
      max: Math.round(((this.totalCost.grandTotal.max - otherEstimate.totalCost.grandTotal.max) / otherEstimate.totalCost.grandTotal.max) * 100)
    }
  }
}

// Static method to get active estimates
CostEstimateSchema.statics.getActive = function(userId) {
  return this.find({
    userId,
    status: 'active',
    validUntil: { $gt: new Date() },
    isDeleted: false
  }).sort({ createdAt: -1 })
}

// Static method to get saved estimates
CostEstimateSchema.statics.getSaved = function(userId) {
  return this.find({
    userId,
    status: { $in: ['active', 'draft'] },
    isDeleted: false
  }).sort({ createdAt: -1 })
}

module.exports = mongoose.model('CostEstimate', CostEstimateSchema)