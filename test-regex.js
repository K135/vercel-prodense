// Test the regex fix
const identifier = '+918768768765'
console.log('Testing identifier:', identifier)

// Old regex (broken)
const oldMatch = identifier.match(/^(\+\d+)(.+)$/)
if (oldMatch) {
  const [, countryCode, phone] = oldMatch
  console.log('❌ Old regex:')
  console.log('  - Country Code:', countryCode)
  console.log('  - Phone:', phone)
}

// New regex (fixed)
const newMatch = identifier.match(/^(\+\d{1,4})(\d+)$/)
if (newMatch) {
  const [, countryCode, phone] = newMatch
  console.log('✅ New regex:')
  console.log('  - Country Code:', countryCode)
  console.log('  - Phone:', phone)
}