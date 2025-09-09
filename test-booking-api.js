const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5001/api';

async function testBookingAPI() {
  try {
    console.log('Testing booking API...');
    
    // Step 1: Request OTP for the existing user
    console.log('\n1. Requesting OTP...');
    const otpResponse = await fetch(`${API_BASE}/auth/request-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: '9999999999',
        type: 'phone',
        countryCode: '+91',
        purpose: 'login'
      }),
    });
    
    const otpData = await otpResponse.json();
    console.log('OTP Response:', otpData);
    
    if (!otpData.success) {
      throw new Error('Failed to request OTP');
    }
    
    // Step 2: Verify OTP (using default OTP from env)
    console.log('\n2. Verifying OTP...');
    const verifyResponse = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp: '123456', // Default OTP from .env
        identifier: '+919999999999',
        type: 'phone'
      }),
    });
    
    const verifyData = await verifyResponse.json();
    console.log('Verify Response:', verifyData);
    
    if (!verifyData.success) {
      throw new Error('Failed to verify OTP');
    }
    
    const token = verifyData.data.accessToken;
    const user = verifyData.data.user;
    
    console.log('User ID:', user.id);
    console.log('Token:', token ? 'Present' : 'Missing');
    
    // Step 3: Call bookings API
    console.log('\n3. Fetching bookings...');
    const bookingsResponse = await fetch(`${API_BASE}/bookings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const bookingsData = await bookingsResponse.json();
    console.log('Bookings Response:', JSON.stringify(bookingsData, null, 2));
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testBookingAPI();