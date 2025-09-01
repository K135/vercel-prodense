// Test the new pattern matching approach
const identifier = '+918768768765'
console.log('Testing identifier:', identifier)

const patterns = [
  /^(\+\d{1})(\d+)$/,  // 1 digit country code (like +1)
  /^(\+\d{2})(\d+)$/,  // 2 digit country code (like +91, +44, +33)
  /^(\+\d{3})(\d+)$/   // 3 digit country code (rare, but exists)
]

console.log('Testing patterns:')
for (let i = 0; i < patterns.length; i++) {
  const pattern = patterns[i]
  const match = identifier.match(pattern)
  if (match) {
    const [, countryCode, phone] = match
    console.log(`Pattern ${i + 1}: CC: "${countryCode}", Phone: "${phone}"`)
  } else {
    console.log(`Pattern ${i + 1}: No match`)
  }
}

// Test with the expected values
console.log('\nExpected: CC: "+91", Phone: "8768768765"')
const expectedMatch = identifier.match(/^(\+\d{2})(\d+)$/)
if (expectedMatch) {
  const [, cc, phone] = expectedMatch
  console.log(`Actual: CC: "${cc}", Phone: "${phone}"`)
  console.log('Match:', cc === '+91' && phone === '8768768765')
}