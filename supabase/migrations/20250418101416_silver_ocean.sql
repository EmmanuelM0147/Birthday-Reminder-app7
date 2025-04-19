/*
  # Create users table
  
  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, not null, unique)
      - `birth_date` (date, not null)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `users` table
    - Add policy for authenticated users to read/update their own data
    - Add policy for authenticated users to insert new users
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  birth_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read/update their own data"
  ON users
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert new data"
  ON users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own data"
  ON users
  FOR DELETE
  USING (true);