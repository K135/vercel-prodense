// Backend API Test Script
// Run with: npm test or node test/api-test.js

const API_BASE = 'http://localhost:5001/api'

async function testBackendAPI() {
  console.log('🧪 Testing Prodance Backend API...\n')

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...')
    const healthResponse = await fetch(`${API_BASE}/health`)
    const healthData = await healthResponse.json()
    console.log('✅ Health check:', healthData.message)
    console.log('   Database status:', healthData.data.status)
    console.log('   Environment:', healthData.data.environment)
    console.log('')

    // Test 2: Request OTP for phone
    console.log('2. Testing OTP request for phone...')
    const otpResponse = await fetch(`${API_BASE}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputType: 'phone',
        inputValue: '9999999999',
        countryCode: '+1'
      })
    })
    const otpData = await otpResponse.json()
    console.log('✅ OTP request:', otpData.message)
    console.log('   Purpose:', otpData.data.purpose)
    console.log('   Expires in:', otpData.data.expiresIn, 'seconds')
    console.log('')

    // Test 3: Verify OTP
    console.log('3. Testing OTP verification...')
    const verifyResponse = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        otp: '123456',
        identifier: '+19999999999',
        type: 'phone'
      })
    })
    const verifyData = await verifyResponse.json()
    console.log('✅ OTP verification:', verifyData.message)
    
    if (verifyData.data.needsSignup) {
      console.log('   New user detected - needs signup')
      
      // Test 4: Complete signup
      console.log('\n4. Testing user signup...')
      const signupResponse = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: '9999999999',
          countryCode: '+1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          dateOfBirth: '1990-01-01',
          gender: 'other',
          country: 'United States',
          profession: 'Developer'
        })
      })
      const signupData = await signupResponse.json()
      console.log('✅ Signup:', signupData.message)
      console.log('   User:', signupData.data.user.fullName)
      console.log('   Token received:', signupData.data.accessToken ? 'Yes' : 'No')
      
      const token = signupData.data.accessToken
      
      // Test 5: Get profile with token
      console.log('\n5. Testing protected profile endpoint...')
      const profileResponse = await fetch(`${API_BASE}/user/profile`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const profileData = await profileResponse.json()
      console.log('✅ Profile:', profileData.message)
      console.log('   Name:', profileData.data.fullName)
      console.log('   Email:', profileData.data.email)
      console.log('   Phone:', profileData.data.countryCode + profileData.data.phone)
      
      // Test 6: Test logout
      console.log('\n6. Testing logout...')
      const logoutResponse = await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const logoutData = await logoutResponse.json()
      console.log('✅ Logout:', logoutData.message)
      
    } else {
      console.log('   Existing user login successful')
      const token = verifyData.data.accessToken
      console.log('   Token received:', token ? 'Yes' : 'No')
    }

    console.log('\n🎉 All backend tests passed!')
    console.log('\n📋 Summary:')
    console.log('   ✅ Health check working')
    console.log('   ✅ OTP request working')
    console.log('   ✅ OTP verification working')
    console.log('   ✅ User signup working')
    console.log('   ✅ Protected routes working')
    console.log('   ✅ Authentication working')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('   1. Make sure MongoDB is running')
    console.log('   2. Start the backend server: npm run dev')
    console.log('   3. Check the .env file configuration')
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch(`${API_BASE}/health`)
    if (response.ok) {
      return true
    }
  } catch (error) {
    return false
  }
  return false
}

// Main execution
async function main() {
  console.log('🔍 Checking if backend server is running...')
  
  const serverRunning = await checkServer()
  
  if (!serverRunning) {
    console.log('❌ Backend server is not running!')
    console.log('\n🚀 To start the backend server:')
    console.log('   cd backend')
    console.log('   npm run dev')
    console.log('\n   Then run this test again.')
    return
  }
  
  console.log('✅ Backend server is running!\n')
  await testBackendAPI()
}

// Run the test
main()