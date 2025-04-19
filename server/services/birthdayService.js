import { createClient } from '@supabase/supabase-js';
import { sendBirthdayEmail } from './emailService.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Check for birthdays today and send emails
export const checkForBirthdays = async () => {
  try {
    console.log('[Birthday Check] Starting daily birthday check...');
    
    // Query for users with birthdays today using EXTRACT
    const { data: birthdayUsers, error } = await supabase
      .from('users')
      .select('username, email')
      .eq('status', 'active')
      .filter(
        'date_of_birth',
        'not.is',
        null
      )
      .filter(
        raw => `
          EXTRACT(MONTH FROM date_of_birth) = EXTRACT(MONTH FROM CURRENT_DATE) AND
          EXTRACT(DAY FROM date_of_birth) = EXTRACT(DAY FROM CURRENT_DATE)
        `
      );
    
    if (error) {
      console.error('[Birthday Check Error] Database query failed:', {
        timestamp: new Date().toISOString(),
        error: error.message
      });
      throw new Error(`Error fetching birthday users: ${error.message}`);
    }
    
    console.log('[Birthday Check] Found users:', {
      timestamp: new Date().toISOString(),
      count: birthdayUsers?.length || 0
    });
    
    // Return the array of users with birthdays
    return birthdayUsers || [];
  } catch (error) {
    console.error('[Birthday Check Error] Service error:', {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Export the checkForBirthdays function for use in the cron job
export default checkForBirthdays;