// Test the improved country code matching
const testCases = [
  '+918768768765',  // India - should extract +91 and 8768768765
  '+19999999999',   // US - should extract +1 and 9999999999
  '+447911123456',  // UK - should extract +44 and 7911123456
  '+971501234567',  // UAE - should extract +971 and 501234567
]

const commonCountryCodes = [
  '+1', '+7', '+91', '+44', '+33', '+49', '+81', '+86', '+61', '+55',
  '+34', '+39', '+31', '+46', '+47', '+45', '+41', '+43', '+32', '+48',
  '+90', '+82', '+65', '+60', '+66', '+84', '+62', '+63', '+92', '+94',
  '+95', '+98', '+20', '+27', '+52', '+54', '+56', '+57', '+58', '+51',
  '+971', '+966', '+965', '+974', '+973', '+968', '+964', '+962', '+961',
  '+963', '+972', '+970', '+880', '+977', '+975', '+960'
]

console.log('Testing improved country code extraction:')
testCases.forEach(identifier => {
  console.log(`\nTesting: ${identifier}`)
  
  // Try the new approach
  let found = false
  for (const cc of commonCountryCodes) {
    if (identifier.startsWith(cc)) {
      const phone = identifier.substring(cc.length)
      if (phone && /^\d+$/.test(phone)) {
        console.log(`  ✅ Matched: CC="${cc}", Phone="${phone}"`)
        found = true
        break
      }
    }
  }
  
  if (!found) {
    console.log('  ❌ No match with known country codes')
  }
})