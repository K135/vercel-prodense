const mongoose = require('mongoose')

const BillingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  
  // Invoice Details
  invoiceNumber: {
    type: String,
    unique: true
  },
  
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  
  dueDate: {
    type: Date,
    required: true
  },
  
  // Billing Status
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled', 'refunded'],
    default: 'draft'
  },
  
  // Amount Details
  subtotal: {
    type: Number,
    required: true
  },
  
  taxAmount: {
    type: Number,
    default: 0
  },
  
  discountAmount: {
    type: Number,
    default: 0
  },
  
  totalAmount: {
    type: Number,
    required: true
  },
  
  currency: {
    type: String,
    default: 'USD'
  },
  
  // Line Items
  lineItems: [{
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      enum: ['consultation', 'treatment', 'medication', 'lab-work', 'equipment', 'other'],
      default: 'treatment'
    }
  }],
  
  // Tax Details
  taxDetails: [{
    taxName: String,
    taxRate: Number, // percentage
    taxAmount: Number,
    taxType: {
      type: String,
      enum: ['GST', 'VAT', 'sales-tax', 'other'],
      default: 'GST'
    }
  }],
  
  // Discount Details
  discountDetails: {
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'insurance', 'loyalty'],
      default: 'fixed'
    },
    value: Number,
    description: String,
    code: String // discount code if applicable
  },
  
  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank-transfer', 'insurance', 'wallet'],
    default: 'card'
  },
  
  paymentDate: Date,
  
  paymentReference: String, // transaction ID or reference
  
  // Payment History
  paymentHistory: [{
    amount: Number,
    method: String,
    reference: String,
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['success', 'failed', 'pending', 'cancelled'],
      default: 'success'
    }
  }],
  
  // Billing Address
  billingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
    phone: String,
    email: String
  },
  
  // Provider Details (from booking)
  provider: {
    name: String,
    clinicName: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String
    },
    contact: {
      phone: String,
      email: String
    },
    taxId: String, // GST number or tax ID
    licenseNumber: String
  },
  
  // Insurance Details
  insurance: {
    provider: String,
    policyNumber: String,
    claimNumber: String,
    coverageAmount: Number,
    deductible: Number,
    copayAmount: Number,
    preAuthorizationNumber: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'denied', 'processing'],
      default: 'pending'
    }
  },
  
  // Notes and Comments
  notes: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    createdAt: { type: Date, default: Date.now },
    isInternal: { type: Boolean, default: false }
  }],
  
  // Reminders
  remindersSent: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'whatsapp', 'call']
    },
    sentAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      default: 'sent'
    }
  }],
  
  // Refund Information
  refund: {
    amount: Number,
    reason: String,
    date: Date,
    reference: String,
    status: {
      type: String,
      enum: ['requested', 'processing', 'completed', 'denied'],
      default: 'requested'
    }
  },
  
  // Metadata
  metadata: {
    source: {
      type: String,
      enum: ['booking', 'manual', 'recurring'],
      default: 'booking'
    },
    isRecurring: { type: Boolean, default: false },
    recurringPeriod: String, // monthly, quarterly, etc.
    parentInvoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Billing'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
})

// Indexes
BillingSchema.index({ userId: 1, status: 1 })
BillingSchema.index({ bookingId: 1 })
BillingSchema.index({ invoiceNumber: 1 })
BillingSchema.index({ status: 1 })
BillingSchema.index({ dueDate: 1 })
BillingSchema.index({ paymentStatus: 1 })
BillingSchema.index({ createdAt: -1 })

// Virtual for overdue status
BillingSchema.virtual('isOverdue').get(function() {
  return this.dueDate < new Date() && this.paymentStatus !== 'paid'
})

// Virtual for days overdue
BillingSchema.virtual('daysOverdue').get(function() {
  if (!this.isOverdue) return 0
  const diffTime = new Date() - this.dueDate
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Virtual for amount due
BillingSchema.virtual('amountDue').get(function() {
  if (this.paymentStatus === 'paid') return 0
  
  const totalPaid = this.paymentHistory.reduce((sum, payment) => {
    return payment.status === 'success' ? sum + payment.amount : sum
  }, 0)
  
  return Math.max(0, this.totalAmount - totalPaid)
})

// Pre-save middleware to generate invoice number
BillingSchema.pre('save', async function(next) {
  if (this.isNew && !this.invoiceNumber) {
    const count = await this.constructor.countDocuments()
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    this.invoiceNumber = `INV-${year}${month}-${String(count + 1).padStart(6, '0')}`
  }
  
  // Calculate total amount
  if (this.isModified('subtotal') || this.isModified('taxAmount') || this.isModified('discountAmount')) {
    this.totalAmount = this.subtotal + this.taxAmount - this.discountAmount
  }
  
  // Set due date if not provided (default 30 days)
  if (this.isNew && !this.dueDate) {
    this.dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  }
  
  // Update status based on payment
  if (this.isModified('paymentHistory') || this.isModified('totalAmount')) {
    const totalPaid = this.paymentHistory.reduce((sum, payment) => {
      return payment.status === 'success' ? sum + payment.amount : sum
    }, 0)
    
    if (totalPaid >= this.totalAmount) {
      this.paymentStatus = 'paid'
      this.status = 'paid'
      if (!this.paymentDate) {
        this.paymentDate = new Date()
      }
    } else if (totalPaid > 0) {
      this.paymentStatus = 'partial'
    }
  }
  
  // Check for overdue status
  if (this.dueDate < new Date() && this.paymentStatus !== 'paid' && this.status !== 'overdue') {
    this.status = 'overdue'
  }
  
  next()
})

// Static method to get user bills
BillingSchema.statics.getUserBills = function(userId, options = {}) {
  const { status, paymentStatus, page = 1, limit = 10 } = options
  const skip = (page - 1) * limit
  
  let query = { userId }
  
  if (status) query.status = status
  if (paymentStatus) query.paymentStatus = paymentStatus
  
  return this.find(query)
    .populate('bookingId', 'treatmentType appointmentDate clinic')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
}

// Static method to get overdue bills
BillingSchema.statics.getOverdueBills = function(userId) {
  return this.find({
    userId,
    dueDate: { $lt: new Date() },
    paymentStatus: { $ne: 'paid' }
  }).populate('bookingId')
}

// Instance method to add payment
BillingSchema.methods.addPayment = function(amount, method, reference) {
  this.paymentHistory.push({
    amount,
    method,
    reference,
    status: 'success'
  })
  
  return this.save()
}

// Instance method to calculate tax
BillingSchema.methods.calculateTax = function(taxRate = 18) {
  this.taxAmount = (this.subtotal * taxRate) / 100
  this.taxDetails = [{
    taxName: 'GST',
    taxRate,
    taxAmount: this.taxAmount,
    taxType: 'GST'
  }]
  
  return this
}

module.exports = mongoose.model('Billing', BillingSchema)