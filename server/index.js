import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

// Import routes
import userRoutes from './routes/users.js';

// Import birthday service
import { checkForBirthdays } from './services/birthdayService.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '..', 'dist')));

// API Routes
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});

// Schedule daily birthday check at 7 AM
cron.schedule('0 7 * * *', async () => {
  console.log('[Cron Job] Starting scheduled birthday check...');
  try {
    const birthdayUsers = await checkForBirthdays();
    console.log(`[Cron Job] Birthday check completed. Found ${birthdayUsers.length} users with birthdays today.`);
    
    // Process each user with a birthday
    for (const user of birthdayUsers) {
      try {
        await sendBirthdayEmail(user);
        console.log(`[Email Sent] Birthday email sent to ${user.email}`);
      } catch (emailError) {
        console.error('[Email Error] Failed to send birthday email:', {
          timestamp: new Date().toISOString(),
          user: user.email,
          error: emailError.message
        });
      }
    }
  } catch (error) {
    console.error('[Cron Job Error] Birthday check failed:', {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;