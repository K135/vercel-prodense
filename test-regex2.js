// Test the regex fix
const identifier = '+918768768765'
console.log('Testing identifier:', identifier)

// New regex (1-3 digits for country code)
const newMatch = identifier.match(/^(\+\d{1,3})(\d+)$/)
if (newMatch) {
  const [, countryCode, phone] = newMatch
  console.log('✅ New regex (1-3 digits):')
  console.log('  - Country Code:', countryCode)
  console.log('  - Phone:', phone)
}

// Test with different country codes
const testCases = [
  '+918768768765',  // India
  '+14155552671',   // US
  '+447911123456',  // UK
  '+33123456789',   // France
  '+861234567890'   // China
]

console.log('\nTesting various country codes:')
testCases.forEach(test => {
  const match = test.match(/^(\+\d{1,3})(\d+)$/)
  if (match) {
    const [, cc, phone] = match
    console.log(`${test} -> CC: "${cc}", Phone: "${phone}"`)
  }
})