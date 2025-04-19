/*
  # Update users table schema
  
  1. Changes
    - Add username column
    - Rename birth_date to date_of_birth
    - Add index on date_of_birth for efficient birthday queries
  
  2. Security
    - Update RLS policies for server access
*/

-- Add new username column
ALTER TABLE users ADD COLUMN IF NOT EXISTS username text;

-- Update username from name for existing records
UPDATE users SET username = name WHERE username IS NULL;

-- Make username required after populating data
ALTER TABLE users ALTER COLUMN username SET NOT NULL;

-- Rename birth_date to date_of_birth
ALTER TABLE users RENAME COLUMN birth_date TO date_of_birth;

-- Create index for efficient birthday queries
CREATE INDEX IF NOT EXISTS idx_users_date_of_birth ON users(date_of_birth);

-- Update RLS policies for server access
CREATE POLICY "Server can read all data"
  ON users
  FOR SELECT
  TO service_role
  USING (true);

-- Keep existing policies for authenticated users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);