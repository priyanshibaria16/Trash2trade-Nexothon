const axios = require('axios');

// Test the health endpoint
async function testHealth() {
  try {
    const response = await axios.get('http://localhost:5001/api/health');
    console.log('Health check:', response.data);
  } catch (error) {
    console.error('Health check failed:', error.message);
  }
}

// Test user registration
async function testRegistration() {
  try {
    const response = await axios.post('http://localhost:5001/api/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'citizen'
    });
    console.log('Registration successful:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
  }
}

// Test user login
async function testLogin() {
  try {
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'test@example.com',
      password: 'password123',
      role: 'citizen'
    });
    console.log('Login successful:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
  }
}

// Test get profile (requires authentication)
async function testProfile(token) {
  try {
    const response = await axios.get('http://localhost:5001/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Profile retrieved:', response.data);
  } catch (error) {
    console.error('Profile retrieval failed:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('Testing API endpoints...\n');
  
  // Test health endpoint
  await testHealth();
  console.log();
  
  // Test registration
  const token = await testRegistration();
  console.log();
  
  // Test login
  const loginToken = await testLogin();
  console.log();
  
  // Test profile (if we have a token)
  if (loginToken) {
    await testProfile(loginToken);
  }
}

runTests();