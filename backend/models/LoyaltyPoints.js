const mongoose = require('mongoose')

const LoyaltyPointsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Points Balance
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  
  availablePoints: {
    type: Number,
    default: 0,
    min: 0
  },
  
  pendingPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  
  redeemedPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  
  expiredPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Membership Tier
  tier: {
    current: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
      default: 'bronze'
    },
    pointsToNextTier: {
      type: Number,
      default: 1000
    },
    benefits: [{
      type: String,
      description: String,
      isActive: { type: Boolean, default: true }
    }]
  },
  
  // Points History
  transactions: [{
    type: {
      type: String,
      enum: ['earned', 'redeemed', 'expired', 'bonus', 'penalty', 'transfer'],
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    source: {
      type: String,
      enum: [
        'booking', 'treatment-completion', 'review', 'referral',
        'signup-bonus', 'birthday-bonus', 'anniversary-bonus',
        'redemption', 'expiry', 'admin-adjustment', 'promotion', 'other'
      ],
      required: true
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'transactions.referenceModel'
    },
    referenceModel: {
      type: String,
      enum: ['Booking', 'Review', 'Redemption', 'User']
    },
    balanceAfter: {
      type: Number,
      required: true
    },
    expiryDate: Date, // for earned points
    isReversible: {
      type: Boolean,
      default: false
    },
    reversedAt: Date,
    reversedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    metadata: {
      bookingAmount: Number,
      treatmentType: String,
      clinicName: String,
      multiplier: Number,
      campaignId: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Redemption History
  redemptions: [{
    redemptionId: {
      type: String,
      unique: true,
      required: true
    },
    type: {
      type: String,
      enum: ['discount', 'cashback', 'gift-card', 'service', 'product', 'donation'],
      required: true
    },
    pointsUsed: {
      type: Number,
      required: true,
      min: 1
    },
    value: {
      amount: Number,
      currency: { type: String, default: 'INR' }
    },
    description: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'completed', 'cancelled', 'expired'],
      default: 'pending'
    },
    appliedTo: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'redemptions.appliedToModel'
    },
    appliedToModel: {
      type: String,
      enum: ['Booking', 'Order', 'Invoice']
    },
    expiryDate: Date,
    redeemedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    notes: String
  }],
  
  // Referral Program
  referrals: {
    referralCode: {
      type: String,
      unique: true,
      sparse: true
    },
    referredUsers: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      referredAt: {
        type: Date,
        default: Date.now
      },
      pointsEarned: Number,
      status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
      }
    }],
    totalReferrals: {
      type: Number,
      default: 0
    },
    successfulReferrals: {
      type: Number,
      default: 0
    },
    referralPointsEarned: {
      type: Number,
      default: 0
    }
  },
  
  // Special Campaigns & Bonuses
  campaigns: [{
    campaignId: String,
    name: String,
    pointsEarned: Number,
    participatedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'expired'],
      default: 'active'
    }
  }],
  
  // Notifications & Preferences
  notifications: {
    pointsEarned: { type: Boolean, default: true },
    pointsExpiring: { type: Boolean, default: true },
    tierUpgrade: { type: Boolean, default: true },
    specialOffers: { type: Boolean, default: true },
    reminderDays: { type: Number, default: 30 } // days before expiry to remind
  },
  
  // Statistics
  stats: {
    lifetimePointsEarned: {
      type: Number,
      default: 0
    },
    lifetimePointsRedeemed: {
      type: Number,
      default: 0
    },
    averageMonthlyEarning: {
      type: Number,
      default: 0
    },
    lastEarnedDate: Date,
    lastRedeemedDate: Date,
    memberSince: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
})

// Indexes
// Note: userId already has unique index from schema definition
LoyaltyPointsSchema.index({ 'tier.current': 1 })
// Note: referrals.referralCode already has unique index from schema definition
LoyaltyPointsSchema.index({ 'transactions.createdAt': -1 })
LoyaltyPointsSchema.index({ 'transactions.expiryDate': 1 })

// Virtual for points expiring soon
LoyaltyPointsSchema.virtual('pointsExpiringSoon').get(function() {
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
  
  return this.transactions
    .filter(t => t.type === 'earned' && t.expiryDate && t.expiryDate <= thirtyDaysFromNow)
    .reduce((total, t) => total + t.points, 0)
})

// Virtual for tier progress percentage
LoyaltyPointsSchema.virtual('tierProgressPercentage').get(function() {
  const tierThresholds = {
    bronze: 0,
    silver: 1000,
    gold: 5000,
    platinum: 15000,
    diamond: 50000
  }
  
  const currentThreshold = tierThresholds[this.tier.current]
  const nextTierName = this.getNextTier()
  
  if (!nextTierName) return 100 // Already at highest tier
  
  const nextThreshold = tierThresholds[nextTierName]
  const progress = this.totalPoints - currentThreshold
  const required = nextThreshold - currentThreshold
  
  return Math.round((progress / required) * 100)
})

// Instance method to add points
LoyaltyPointsSchema.methods.addPoints = function(points, source, description, metadata = {}) {
  const expiryDate = new Date()
  expiryDate.setFullYear(expiryDate.getFullYear() + 2) // Points expire in 2 years
  
  this.transactions.push({
    type: 'earned',
    points,
    description,
    source,
    balanceAfter: this.availablePoints + points,
    expiryDate,
    metadata
  })
  
  this.totalPoints += points
  this.availablePoints += points
  this.stats.lifetimePointsEarned += points
  this.stats.lastEarnedDate = new Date()
  
  // Check for tier upgrade
  this.checkTierUpgrade()
  
  return this.save()
}

// Instance method to redeem points
LoyaltyPointsSchema.methods.redeemPoints = function(points, type, description, value = null) {
  if (this.availablePoints < points) {
    throw new Error('Insufficient points balance')
  }
  
  const redemptionId = `RED${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  
  this.transactions.push({
    type: 'redeemed',
    points: -points,
    description,
    source: 'redemption',
    balanceAfter: this.availablePoints - points
  })
  
  this.redemptions.push({
    redemptionId,
    type,
    pointsUsed: points,
    value,
    description,
    status: 'pending'
  })
  
  this.availablePoints -= points
  this.redeemedPoints += points
  this.stats.lifetimePointsRedeemed += points
  this.stats.lastRedeemedDate = new Date()
  
  return this.save()
}

// Instance method to check tier upgrade
LoyaltyPointsSchema.methods.checkTierUpgrade = function() {
  const tierThresholds = {
    bronze: 0,
    silver: 1000,
    gold: 5000,
    platinum: 15000,
    diamond: 50000
  }
  
  let newTier = 'bronze'
  for (const [tier, threshold] of Object.entries(tierThresholds)) {
    if (this.totalPoints >= threshold) {
      newTier = tier
    }
  }
  
  if (newTier !== this.tier.current) {
    this.tier.current = newTier
    
    // Add tier upgrade bonus
    const bonusPoints = {
      silver: 100,
      gold: 500,
      platinum: 1500,
      diamond: 5000
    }[newTier] || 0
    
    if (bonusPoints > 0) {
      this.addPoints(bonusPoints, 'tier-upgrade', `Tier upgrade bonus to ${newTier}`)
    }
  }
  
  // Update points to next tier
  const nextTier = this.getNextTier()
  if (nextTier) {
    this.tier.pointsToNextTier = tierThresholds[nextTier] - this.totalPoints
  } else {
    this.tier.pointsToNextTier = 0
  }
}

// Instance method to get next tier
LoyaltyPointsSchema.methods.getNextTier = function() {
  const tiers = ['bronze', 'silver', 'gold', 'platinum', 'diamond']
  const currentIndex = tiers.indexOf(this.tier.current)
  return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null
}

// Instance method to expire points
LoyaltyPointsSchema.methods.expirePoints = function() {
  const now = new Date()
  let expiredPoints = 0
  
  this.transactions.forEach(transaction => {
    if (transaction.type === 'earned' && 
        transaction.expiryDate && 
        transaction.expiryDate <= now && 
        !transaction.reversedAt) {
      expiredPoints += transaction.points
      transaction.reversedAt = now
    }
  })
  
  if (expiredPoints > 0) {
    this.transactions.push({
      type: 'expired',
      points: -expiredPoints,
      description: 'Points expired',
      source: 'expiry',
      balanceAfter: this.availablePoints - expiredPoints
    })
    
    this.availablePoints -= expiredPoints
    this.expiredPoints += expiredPoints
  }
  
  return this.save()
}

// Static method to generate referral code
LoyaltyPointsSchema.statics.generateReferralCode = function(userId) {
  const code = `REF${userId.toString().slice(-4).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  return code
}

// Pre-save middleware to generate referral code
LoyaltyPointsSchema.pre('save', function(next) {
  if (this.isNew && !this.referrals.referralCode) {
    this.referrals.referralCode = this.constructor.generateReferralCode(this.userId)
  }
  next()
})

module.exports = mongoose.model('LoyaltyPoints', LoyaltyPointsSchema)