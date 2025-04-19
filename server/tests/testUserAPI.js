import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__dirname);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const API_URL = `http://localhost:${process.env.PORT || 3000}/api`;

const testUser = {
  username: 'testuser123',
  name: 'Test User',
  email: 'test@example.com',
  dateOfBirth: '1990-01-01'
};

const runAPITests = async () => {
  console.log('\n[Test] Starting API tests...');
  
  try {
    // Test 1: Create user with valid data
    console.log('\n[Test 1] Testing user creation with valid data...');
    const createResponse = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const createResult = await createResponse.json();
    console.log('Create user response:', {
      status: createResponse.status,
      body: createResult
    });
    
    // Test 2: Create user with invalid data
    console.log('\n[Test 2] Testing validation with invalid data...');
    const invalidUser = { ...testUser, email: 'invalid-email' };
    const invalidResponse = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidUser)
    });
    
    const invalidResult = await invalidResponse.json();
    console.log('Invalid user response:', {
      status: invalidResponse.status,
      body: invalidResult
    });
    
    // Test 3: Test rate limiting
    console.log('\n[Test 3] Testing rate limiting...');
    const requests = Array(6).fill().map(() => 
      fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...testUser,
          email: `test${Date.now()}@example.com`
        })
      })
    );
    
    const results = await Promise.all(requests);
    const rateLimitHit = results.some(res => res.status === 429);
    console.log('Rate limit test:', {
      rateLimitHit,
      totalRequests: requests.length
    });

  } catch (error) {
    console.error('❌ API test failed:', error);
    process.exit(1);
  }
};

// Run the tests
runAPITests();