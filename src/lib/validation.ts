export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
}

export function validateLoginRequest(data: any): ValidationResult {
  const errors: Record<string, string[]> = {}

  // Check required fields
  if (!data.inputType) {
    errors.inputType = ['Input type is required']
  } else if (!['phone', 'email'].includes(data.inputType)) {
    errors.inputType = ['Input type must be either phone or email']
  }

  if (!data.inputValue || typeof data.inputValue !== 'string' || data.inputValue.trim() === '') {
    errors.inputValue = ['Input value is required']
  }

  // Validate based on input type
  if (data.inputType === 'phone') {
    if (!data.countryCode) {
      errors.countryCode = ['Country code is required for phone numbers']
    } else if (!data.countryCode.startsWith('+')) {
      errors.countryCode = ['Country code must start with +']
    }

    if (data.inputValue) {
      const phoneRegex = /^\d{7,15}$/
      if (!phoneRegex.test(data.inputValue.replace(/\D/g, ''))) {
        errors.inputValue = ['Please enter a valid phone number (7-15 digits)']
      }
    }
  } else if (data.inputType === 'email') {
    if (data.inputValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.inputValue)) {
        errors.inputValue = ['Please enter a valid email address']
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateOTPRequest(data: any): ValidationResult {
  const errors: Record<string, string[]> = {}

  if (!data.otp || typeof data.otp !== 'string') {
    errors.otp = ['OTP is required']
  } else if (data.otp.length !== 6 || !/^\d{6}$/.test(data.otp)) {
    errors.otp = ['OTP must be a 6-digit number']
  }

  if (!data.identifier || typeof data.identifier !== 'string' || data.identifier.trim() === '') {
    errors.identifier = ['Identifier is required']
  }

  if (!data.type) {
    errors.type = ['Type is required']
  } else if (!['phone', 'email'].includes(data.type)) {
    errors.type = ['Type must be either phone or email']
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateSignupRequest(data: any): ValidationResult {
  const errors: Record<string, string[]> = {}

  // Required fields
  if (!data.firstName || typeof data.firstName !== 'string' || data.firstName.trim() === '') {
    errors.firstName = ['First name is required']
  } else if (data.firstName.trim().length > 50) {
    errors.firstName = ['First name cannot exceed 50 characters']
  }

  if (!data.lastName || typeof data.lastName !== 'string' || data.lastName.trim() === '') {
    errors.lastName = ['Last name is required']
  } else if (data.lastName.trim().length > 50) {
    errors.lastName = ['Last name cannot exceed 50 characters']
  }

  // At least one contact method required
  if (!data.phone && !data.email) {
    errors.contact = ['Either phone number or email address is required']
  }

  // Validate phone if provided
  if (data.phone) {
    if (!data.countryCode) {
      errors.countryCode = ['Country code is required when phone is provided']
    } else if (!data.countryCode.startsWith('+')) {
      errors.countryCode = ['Country code must start with +']
    }

    const phoneRegex = /^\d{7,15}$/
    if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
      errors.phone = ['Please enter a valid phone number (7-15 digits)']
    }
  }

  // Validate email if provided
  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.email = ['Please enter a valid email address']
    }
  }

  // Validate optional fields
  if (data.dateOfBirth) {
    const date = new Date(data.dateOfBirth)
    if (isNaN(date.getTime())) {
      errors.dateOfBirth = ['Please enter a valid date of birth']
    } else if (date > new Date()) {
      errors.dateOfBirth = ['Date of birth cannot be in the future']
    }
  }

  if (data.gender && !['male', 'female', 'other'].includes(data.gender)) {
    errors.gender = ['Gender must be male, female, or other']
  }

  if (data.country && data.country.trim().length > 100) {
    errors.country = ['Country name cannot exceed 100 characters']
  }

  if (data.profession && data.profession.trim().length > 100) {
    errors.profession = ['Profession cannot exceed 100 characters']
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}