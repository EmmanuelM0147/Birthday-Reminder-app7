import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get birthday email template
const getBirthdayEmailTemplate = (username) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Happy Birthday!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <tr>
          <td style="background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); padding: 32px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <!-- Header -->
              <tr>
                <td align="center" style="padding-bottom: 24px;">
                  <h1 style="margin: 0; color: #4F46E5; font-size: 24px; font-weight: bold;">
                    🎉 Happy Birthday, ${username}! 🎂
                  </h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 24px 0; text-align: center;">
                  <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 24px;">
                    We hope your day is filled with joy, laughter, and wonderful moments!
                  </p>
                  <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 24px;">
                    May this year bring you endless opportunities and beautiful memories.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding-top: 24px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                    Best wishes,<br>
                    Birthday Reminder App Team
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Send birthday email with retry logic
export const sendBirthdayEmail = async (user, retryCount = 0) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Birthday Reminder App',
        address: process.env.GMAIL_USER
      },
      to: user.email,
      subject: `🎉 Happy Birthday, ${user.username}!`,
      html: getBirthdayEmailTemplate(user.username),
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);
    
    // Log success
    console.log('[Email Success]', {
      timestamp: new Date().toISOString(),
      messageId: info.messageId,
      recipient: user.email
    });

    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('[Email Error]', {
      timestamp: new Date().toISOString(),
      recipient: user.email,
      error: error.message,
      attempt: retryCount + 1
    });

    // Retry logic
    if (retryCount < MAX_RETRIES) {
      console.log(`[Email Retry] Attempting retry ${retryCount + 1} of ${MAX_RETRIES}`);
      await wait(RETRY_DELAY * (retryCount + 1));
      return sendBirthdayEmail(user, retryCount + 1);
    }

    throw new Error(`Failed to send email after ${MAX_RETRIES} attempts: ${error.message}`);
  }
};

// Test email connection
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('[Email Service] Connection verified successfully');
    return true;
  } catch (error) {
    console.error('[Email Service Error] Connection verification failed:', error);
    throw error;
  }
};