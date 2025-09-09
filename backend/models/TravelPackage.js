const mongoose = require('mongoose')

const travelPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    maxlength: 500
  },
  destination: {
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'India'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    timezone: String,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  duration: {
    days: {
      type: Number,
      required: true,
      min: 1
    },
    nights: {
      type: Number,
      required: true,
      min: 0
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    priceIncludes: [String],
    priceExcludes: [String],
    discounts: [{
      type: {
        type: String,
        enum: ['early-bird', 'group', 'seasonal', 'loyalty', 'first-time']
      },
      percentage: {
        type: Number,
        min: 0,
        max: 100
      },
      amount: Number,
      validFrom: Date,
      validUntil: Date,
      conditions: String
    }],
    additionalCosts: [{
      name: String,
      amount: Number,
      isOptional: {
        type: Boolean,
        default: false
      },
      description: String
    }]
  },
  treatments: [{
    type: {
      type: String,
      required: true,
      enum: [
        'dental-implant',
        'root-canal',
        'crown-bridge',
        'orthodontics',
        'cosmetic-dentistry',
        'oral-surgery',
        'periodontics',
        'endodontics',
        'prosthodontics',
        'general-checkup',
        'teeth-whitening',
        'dental-cleaning',
        'wisdom-tooth-extraction',
        'full-mouth-rehabilitation'
      ]
    },
    name: String,
    description: String,
    duration: String, // e.g., "2-3 hours"
    sessions: Number,
    isIncluded: {
      type: Boolean,
      default: true
    },
    additionalCost: Number
  }],
  accommodation: {
    type: {
      type: String,
      enum: ['hotel', 'resort', 'apartment', 'guesthouse', 'hospital-stay'],
      required: true
    },
    name: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    amenities: [String],
    roomType: String,
    mealsIncluded: {
      breakfast: {
        type: Boolean,
        default: false
      },
      lunch: {
        type: Boolean,
        default: false
      },
      dinner: {
        type: Boolean,
        default: false
      }
    },
    location: {
      address: String,
      distanceFromClinic: String, // e.g., "2 km"
      distanceFromAirport: String
    },
    images: [String]
  },
  transportation: {
    airportPickup: {
      type: Boolean,
      default: false
    },
    airportDrop: {
      type: Boolean,
      default: false
    },
    localTransport: {
      type: String,
      enum: ['included', 'on-request', 'not-included'],
      default: 'not-included'
    },
    transportType: [String], // e.g., ['taxi', 'bus', 'train']
    additionalInfo: String
  },
  activities: [{
    name: String,
    description: String,
    duration: String,
    cost: Number,
    isIncluded: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      enum: ['sightseeing', 'cultural', 'adventure', 'relaxation', 'shopping', 'food']
    },
    images: [String]
  }],
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    title: String,
    activities: [{
      time: String,
      activity: String,
      location: String,
      notes: String
    }],
    meals: {
      breakfast: String,
      lunch: String,
      dinner: String
    },
    accommodation: String
  }],
  partneredClinics: [{
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic'
    },
    name: String,
    address: String,
    specializations: [String],
    rating: Number,
    certifications: [String]
  }],
  partneredDentists: [{
    dentistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dentist'
    },
    name: String,
    specializations: [String],
    experience: Number,
    rating: Number
  }],
  packageFeatures: [{
    feature: String,
    description: String,
    icon: String
  }],
  targetAudience: {
    ageGroup: [String], // e.g., ['25-35', '35-50', '50+']
    budgetRange: {
      min: Number,
      max: Number
    },
    treatmentTypes: [String],
    travelStyle: [String] // e.g., ['luxury', 'budget', 'family', 'solo']
  },
  availability: {
    availableDates: [{
      from: Date,
      to: Date,
      maxBookings: Number,
      currentBookings: {
        type: Number,
        default: 0
      }
    }],
    blackoutDates: [{
      from: Date,
      to: Date,
      reason: String
    }],
    advanceBookingDays: {
      type: Number,
      default: 30
    },
    maxGroupSize: {
      type: Number,
      default: 1
    }
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: String,
    aspects: {
      treatment: Number,
      accommodation: Number,
      transportation: Number,
      activities: Number,
      value: Number
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  images: [{
    url: String,
    caption: String,
    category: {
      type: String,
      enum: ['destination', 'accommodation', 'clinic', 'activity', 'treatment']
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  tags: [String],
  category: {
    type: String,
    enum: ['budget', 'premium', 'luxury', 'family', 'solo', 'group', 'medical-only'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'archived'],
    default: 'draft'
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  seoData: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    slug: {
      type: String,
      unique: true,
      sparse: true
    }
  }
}, {
  timestamps: true
})

// Indexes
travelPackageSchema.index({ 'destination.city': 1, 'destination.state': 1 })
travelPackageSchema.index({ category: 1, status: 1 })
travelPackageSchema.index({ 'pricing.basePrice': 1 })
travelPackageSchema.index({ averageRating: -1, reviewCount: -1 })
travelPackageSchema.index({ isPopular: 1, isFeatured: 1 })
travelPackageSchema.index({ 'treatments.type': 1 })
travelPackageSchema.index({ tags: 1 })
travelPackageSchema.index({ createdAt: -1 })

// Virtual for total price calculation
travelPackageSchema.virtual('totalPrice').get(function() {
  let total = this.pricing.basePrice
  
  // Add additional costs that are not optional
  if (this.pricing.additionalCosts) {
    this.pricing.additionalCosts.forEach(cost => {
      if (!cost.isOptional) {
        total += cost.amount || 0
      }
    })
  }
  
  return total
})

// Virtual for duration string
travelPackageSchema.virtual('durationString').get(function() {
  return `${this.duration.days} Days / ${this.duration.nights} Nights`
})

// Methods
travelPackageSchema.methods.calculateDiscountedPrice = function(discountType) {
  let price = this.pricing.basePrice
  
  if (this.pricing.discounts && this.pricing.discounts.length > 0) {
    const applicableDiscount = this.pricing.discounts.find(discount => {
      if (discountType && discount.type !== discountType) return false
      
      const now = new Date()
      if (discount.validFrom && now < discount.validFrom) return false
      if (discount.validUntil && now > discount.validUntil) return false
      
      return true
    })
    
    if (applicableDiscount) {
      if (applicableDiscount.percentage) {
        price = price * (1 - applicableDiscount.percentage / 100)
      } else if (applicableDiscount.amount) {
        price = price - applicableDiscount.amount
      }
    }
  }
  
  return Math.max(0, price)
}

travelPackageSchema.methods.addReview = function(userId, rating, comment, aspects) {
  this.reviews.push({
    userId,
    rating,
    comment,
    aspects
  })
  
  this.updateRating()
  return this.save()
}

travelPackageSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0
    this.reviewCount = 0
    return
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0)
  this.averageRating = Math.round((totalRating / this.reviews.length) * 10) / 10
  this.reviewCount = this.reviews.length
}

travelPackageSchema.methods.checkAvailability = function(requestedDate, groupSize = 1) {
  const availability = this.availability.availableDates.find(slot => {
    return requestedDate >= slot.from && 
           requestedDate <= slot.to && 
           (slot.currentBookings + groupSize) <= slot.maxBookings
  })
  
  // Check blackout dates
  const isBlackedOut = this.availability.blackoutDates.some(blackout => {
    return requestedDate >= blackout.from && requestedDate <= blackout.to
  })
  
  return availability && !isBlackedOut
}

travelPackageSchema.methods.bookSlot = function(requestedDate, groupSize = 1) {
  const availability = this.availability.availableDates.find(slot => {
    return requestedDate >= slot.from && requestedDate <= slot.to
  })
  
  if (availability && (availability.currentBookings + groupSize) <= availability.maxBookings) {
    availability.currentBookings += groupSize
    this.totalBookings += groupSize
    return this.save()
  }
  
  throw new Error('Slot not available')
}

// Static methods
travelPackageSchema.statics.findByDestination = function(city, state) {
  return this.find({
    'destination.city': new RegExp(city, 'i'),
    'destination.state': new RegExp(state, 'i'),
    status: 'active'
  }).sort({ averageRating: -1, reviewCount: -1 })
}

travelPackageSchema.statics.findByTreatment = function(treatmentType) {
  return this.find({
    'treatments.type': treatmentType,
    status: 'active'
  }).sort({ averageRating: -1, reviewCount: -1 })
}

travelPackageSchema.statics.findByPriceRange = function(minPrice, maxPrice) {
  return this.find({
    'pricing.basePrice': { $gte: minPrice, $lte: maxPrice },
    status: 'active'
  }).sort({ 'pricing.basePrice': 1 })
}

travelPackageSchema.statics.getFeaturedPackages = function(limit = 6) {
  return this.find({
    isFeatured: true,
    status: 'active'
  })
  .sort({ averageRating: -1, reviewCount: -1 })
  .limit(limit)
}

travelPackageSchema.statics.getPopularPackages = function(limit = 10) {
  return this.find({
    isPopular: true,
    status: 'active'
  })
  .sort({ totalBookings: -1, averageRating: -1 })
  .limit(limit)
}

// Pre-save middleware
travelPackageSchema.pre('save', function(next) {
  // Generate slug if not exists
  if (!this.seoData.slug && this.name) {
    this.seoData.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  
  // Update rating if reviews changed
  if (this.isModified('reviews')) {
    this.updateRating()
  }
  
  next()
})

module.exports = mongoose.model('TravelPackage', travelPackageSchema)