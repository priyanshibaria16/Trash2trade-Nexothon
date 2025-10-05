import axios from 'axios';

const testApi = async () => {
  try {
    // First, let's login to get a token
    const loginResponse = await axios.post('http://localhost:5004/api/auth/login', {
      email: 'jane@example.com',
      password: 'password123',
      role: 'collector'
    });

    const token = loginResponse.data.token;
    console.log('Login successful, token:', token);

    // Test collector pickups endpoint
    const pickupsResponse = await axios.get('http://localhost:5004/api/pickups/collector', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Collector pickups:', pickupsResponse.data);

    // Test specific pickup endpoint
    if (pickupsResponse.data.pickups && pickupsResponse.data.pickups.length > 0) {
      const pickupId = pickupsResponse.data.pickups[0].id;
      const pickupResponse = await axios.get(`http://localhost:5004/api/pickups/${pickupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Specific pickup details:', pickupResponse.data);
    }
  } catch (error: any) {
    console.error('API test failed:', error.response?.data || error.message);
  }
};

testApi();