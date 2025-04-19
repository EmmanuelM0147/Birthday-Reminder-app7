import { testEmailConnection, sendBirthdayEmail } from '../services/emailService.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const testUser = {
  username: 'testuser',
  email: process.env.TEST_EMAIL || 'test@example.com'
};

// Test email connection and sending
const runEmailTests = async () => {
  console.log('\n[Test] Starting email service tests...');
  
  try {
    // Test 1: Verify email connection
    console.log('\n[Test 1] Testing email connection...');
    await testEmailConnection();
    console.log('✅ Email connection test passed');

    // Test 2: Send test email
    console.log('\n[Test 2] Sending test email...');
    const result = await sendBirthdayEmail(testUser);
    console.log('✅ Test email sent successfully:', result);

  } catch (error) {
    console.error('❌ Email test failed:', error);
    process.exit(1);
  }
};

// Run the tests
runEmailTests();