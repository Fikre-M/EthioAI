const axios = require('axios');

const BASE_URL = 'http://localhost:5002/api';

async function testAuth() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);

    // Test 2: Register a new user
    console.log('\n2. Testing user registration...');
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123!',
      phone: '+251911234567'
    };

    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ Registration successful:', {
      userId: registerResponse.data.data.user.id,
      email: registerResponse.data.data.user.email,
      hasTokens: !!registerResponse.data.data.tokens
    });

    // Test 3: Login with the registered user
    console.log('\n3. Testing user login...');
    const loginData = {
      email: registerData.email,
      password: registerData.password,
      rememberMe: false
    };

    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('✅ Login successful:', {
      userId: loginResponse.data.data.user.id,
      email: loginResponse.data.data.user.email,
      hasTokens: !!loginResponse.data.data.tokens
    });

    // Test 4: Access protected route
    console.log('\n4. Testing protected route access...');
    const token = loginResponse.data.data.tokens.accessToken;
    const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Protected route access successful:', {
      userId: meResponse.data.data.user.id,
      email: meResponse.data.data.user.email
    });

    // Test 5: Test existing user login
    console.log('\n5. Testing login with existing user...');
    const existingLoginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('✅ Existing user login successful:', {
      userId: existingLoginResponse.data.data.user.id,
      email: existingLoginResponse.data.data.user.email
    });

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📝 Summary:');
    console.log('- ✅ Server is running and healthy');
    console.log('- ✅ User registration works');
    console.log('- ✅ User login works');
    console.log('- ✅ Protected routes work');
    console.log('- ✅ Existing user login works');
    console.log('\n🚀 Your authentication system is working correctly!');

  } catch (error) {
    console.error('\n❌ Test failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running on port 5002:');
      console.log('   npm run dev');
    }
  }
}

// Run the test
testAuth();