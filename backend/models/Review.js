const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
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
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  treatmentType: {
    type: String,
    required: true
  },
  aspects: {
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    professionalism: {
      type: Number,
      min: 1,
      max: 5
    },
    cleanliness: {
      type: Number,
      min: 1,
      max: 5
    },
    value: {
      type: Number,
      min: 1,
      max: 5
    },
    comfort: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  photos: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  helpfulVotes: {
    type: Number,
    default: 0
  },
  reportedCount: {
    type: Number,
    default: 0
  },
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending'
  },
  moderationNotes: String,
  response: {
    message: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dentist'
    }
  }
}, {
  timestamps: true
})

// Indexes
reviewSchema.index({ dentistId: 1, createdAt: -1 })
reviewSchema.index({ userId: 1, createdAt: -1 })
reviewSchema.index({ bookingId: 1 })
reviewSchema.index({ rating: 1 })
reviewSchema.index({ isDeleted: 1, moderationStatus: 1 })

// Virtual for overall rating calculation
reviewSchema.virtual('overallRating').get(function() {
  if (this.aspects) {
    const aspectRatings = Object.values(this.aspects).filter(rating => rating > 0)
    if (aspectRatings.length > 0) {
      return aspectRatings.reduce((sum, rating) => sum + rating, 0) / aspectRatings.length
    }
  }
  return this.rating
})

// Methods
reviewSchema.methods.softDelete = function() {
  this.isDeleted = true
  this.deletedAt = new Date()
  return this.save()
}

reviewSchema.methods.addHelpfulVote = function() {
  this.helpfulVotes += 1
  return this.save()
}

reviewSchema.methods.reportReview = function() {
  this.reportedCount += 1
  if (this.reportedCount >= 3) {
    this.moderationStatus = 'flagged'
  }
  return this.save()
}

// Static methods
reviewSchema.statics.getAverageRating = async function(dentistId) {
  const result = await this.aggregate([
    {
      $match: {
        dentistId: mongoose.Types.ObjectId(dentistId),
        isDeleted: false,
        moderationStatus: 'approved'
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ])

  if (result.length > 0) {
    const distribution = {}
    result[0].ratingDistribution.forEach(rating => {
      distribution[rating] = (distribution[rating] || 0) + 1
    })

    return {
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      totalReviews: result[0].totalReviews,
      distribution
    }
  }

  return {
    averageRating: 0,
    totalReviews: 0,
    distribution: {}
  }
}

reviewSchema.statics.getRecentReviews = async function(dentistId, limit = 5) {
  return this.find({
    dentistId,
    isDeleted: false,
    moderationStatus: 'approved'
  })
  .populate('userId', 'firstName lastName')
  .populate('bookingId', 'treatmentType appointmentDate')
  .sort({ createdAt: -1 })
  .limit(limit)
}

// Pre-save middleware
reviewSchema.pre('save', function(next) {
  if (this.isNew) {
    // Set verification status based on booking verification
    this.isVerified = true // In production, verify against actual booking
  }
  next()
})

// Post-save middleware to update dentist rating
reviewSchema.post('save', async function(doc) {
  if (doc.isNew || doc.isModified('rating')) {
    const Dentist = mongoose.model('Dentist')
    const dentist = await Dentist.findById(doc.dentistId)
    if (dentist) {
      await dentist.updateRating()
    }
  }
})

module.exports = mongoose.model('Review', reviewSchema)