# Birthday Reminder Application

A comprehensive application to manage birthday reminders and send automated birthday emails.

## Features

- User registration with validation
- Automated birthday email notifications
- User management dashboard
- Email notification logging
- Responsive design for all devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Email**: Nodemailer with Gmail
- **Scheduling**: Node-cron

## Prerequisites

- Node.js (v14.x or higher)
- A Supabase account
- A Gmail account (for sending emails)

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Server Configuration
PORT=3000

# Email Configuration
GMAIL_USER=your_gmail
GMAIL_PASS=your_app_specific_password
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Connect to Supabase by clicking the "Connect to Supabase" button
3. Run the SQL migration files in the `supabase/migrations` directory

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Servers

```bash
# Start both frontend and backend servers
npm run dev:full

# Or start them separately
npm run dev     # Frontend only
npm run server  # Backend only
```

## API Endpoints

### Users

- `POST /api/users` - Register new user
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Remove user

### Health Check

- `GET /api/health` - Check server status

## Database Schema

### Users Table

| Column      | Type        | Description                |
|-------------|-------------|----------------------------|
| id          | uuid        | Primary key                |
| name        | text        | User's full name           |
| email       | text        | User's email (unique)      |
| birth_date  | date        | User's birth date          |
| created_at  | timestamptz | Record creation timestamp  |

### Email Logs Table

| Column    | Type        | Description                      |
|-----------|-------------|----------------------------------|
| id        | uuid        | Primary key                      |
| user_id   | uuid        | Foreign key to users.id          |
| sent_at   | timestamptz | When the email was sent          |
| status    | text        | Email status (success or failed) |

## Scheduled Jobs

- Birthday check runs daily at 7 AM to identify users with birthdays and send email notifications

## License

MIT