const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  // Authentication fields
  phone: {
    type: String,
    sparse: true, // Allows multiple null values
    unique: true,
    trim: true
  },
  email: {
    type: String,
    sparse: true, // Allows multiple null values
    unique: true,
    lowercase: true,
    trim: true
  },
  countryCode: {
    type: String,
    trim: true
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Profile fields
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
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be male, female, or other'
    }
  },
  country: {
    type: String,
    trim: true,
    maxlength: [100, 'Country cannot exceed 100 characters']
  },
  profession: {
    type: String,
    trim: true,
    maxlength: [100, 'Profession cannot exceed 100 characters']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  
  // System fields
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Avatar/Profile picture (for future use)
  avatar: {
    type: String
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v
      delete ret.password // Remove password if added in future
      return ret
    }
  }
})

// Indexes for better performance
UserSchema.index({ phone: 1, countryCode: 1 })
// Note: email index is automatically created by unique constraint
UserSchema.index({ createdAt: -1 })
UserSchema.index({ isActive: 1 })

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

// Ensure virtual fields are serialized
UserSchema.set('toJSON', { virtuals: true })

// Instance method to get full name
UserSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`
}

// Instance method to compare password (for future password-based auth)
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false
  return await bcrypt.compare(candidatePassword, this.password)
}

// Pre-save middleware
UserSchema.pre('save', async function(next) {
  // Ensure at least one contact method is provided
  if (!this.phone && !this.email) {
    const error = new Error('Either phone or email must be provided')
    return next(error)
  }
  
  // Hash password if it's modified (for future use)
  if (this.password && this.isModified('password')) {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
  }
  
  next()
})

// Static method to find user by phone or email
UserSchema.statics.findByIdentifier = async function(identifier, type) {
  if (type === 'phone') {
    // Extract country code and phone number
    // Common country codes to try first (most specific to least specific)
    const commonCountryCodes = [
      // 1-digit country codes
      '+1',   // US, Canada
      '+7',   // Russia, Kazakhstan
      
      // 2-digit country codes (most common)
      '+91',  // India
      '+44',  // UK
      '+33',  // France
      '+49',  // Germany
      '+81',  // Japan
      '+86',  // China
      '+61',  // Australia
      '+55',  // Brazil
      '+34',  // Spain
      '+39',  // Italy
      '+31',  // Netherlands
      '+46',  // Sweden
      '+47',  // Norway
      '+45',  // Denmark
      '+41',  // Switzerland
      '+43',  // Austria
      '+32',  // Belgium
      '+48',  // Poland
      '+90',  // Turkey
      '+82',  // South Korea
      '+65',  // Singapore
      '+60',  // Malaysia
      '+66',  // Thailand
      '+84',  // Vietnam
      '+62',  // Indonesia
      '+63',  // Philippines
      '+92',  // Pakistan
      '+94',  // Sri Lanka
      '+95',  // Myanmar
      '+98',  // Iran
      '+20',  // Egypt
      '+27',  // South Africa
      '+52',  // Mexico
      '+54',  // Argentina
      '+56',  // Chile
      '+57',  // Colombia
      '+58',  // Venezuela
      '+51',  // Peru
      
      // 3-digit country codes (less common)
      '+971', // UAE
      '+966', // Saudi Arabia
      '+965', // Kuwait
      '+974', // Qatar
      '+973', // Bahrain
      '+968', // Oman
      '+964', // Iraq
      '+962', // Jordan
      '+961', // Lebanon
      '+963', // Syria
      '+972', // Israel
      '+970', // Palestine
      '+880', // Bangladesh
      '+977', // Nepal
      '+975', // Bhutan
      '+960', // Maldives
      '+376', // Andorra
      '+378', // San Marino
      '+380', // Ukraine
      '+381', // Serbia
      '+382', // Montenegro
      '+383', // Kosovo
      '+385', // Croatia
      '+386', // Slovenia
      '+387', // Bosnia and Herzegovina
      '+389', // North Macedonia
      '+420', // Czech Republic
      '+421', // Slovakia
      '+423', // Liechtenstein
    ]
    
    // First, try to match against known country codes
    for (const cc of commonCountryCodes) {
      if (identifier.startsWith(cc)) {
        const phone = identifier.substring(cc.length)
        if (phone && /^\d+$/.test(phone)) { // Ensure remaining part is all digits
          const user = await this.findOne({ phone, countryCode: cc })
          if (user) return user
        }
      }
    }
    
    // If no match with common country codes, try generic patterns as fallback
    const patterns = [
      /^(\+\d{1})(\d+)$/,  // 1 digit country code
      /^(\+\d{2})(\d+)$/,  // 2 digit country code
      /^(\+\d{3})(\d+)$/,  // 3 digit country code
      /^(\+\d{4})(\d+)$/   // 4 digit country code (very rare)
    ]
    
    for (const pattern of patterns) {
      const match = identifier.match(pattern)
      if (match) {
        const [, countryCode, phone] = match
        const user = await this.findOne({ phone, countryCode })
        if (user) return user
      }
    }
    
    return null
  } else if (type === 'email') {
    return this.findOne({ email: identifier })
  }
  return null
}

module.exports = mongoose.model('User', UserSchema)