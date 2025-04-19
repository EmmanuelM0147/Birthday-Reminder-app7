import { checkForBirthdays } from '../services/birthdayService.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const runBirthdayTests = async () => {
  console.log('\n[Test] Starting birthday service tests...');
  
  try {
    // Test 1: Check birthday identification
    console.log('\n[Test 1] Testing birthday identification...');
    const birthdayUsers = await checkForBirthdays();
    console.log('✅ Birthday check completed:', {
      usersFound: birthdayUsers.length,
      users: birthdayUsers
    });

  } catch (error) {
    console.error('❌ Birthday service test failed:', error);
    process.exit(1);
  }
};

// Run the tests
runBirthdayTests();