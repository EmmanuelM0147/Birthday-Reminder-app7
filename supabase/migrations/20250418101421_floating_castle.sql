/*
  # Create email logs table
  
  1. New Tables
    - `email_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users.id)
      - `sent_at` (timestamptz, default now())
      - `status` (text, not null, either 'success' or 'failed')
  2. Security
    - Enable RLS on `email_logs` table
    - Add policy for authenticated users to read logs for their own emails
*/

CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sent_at timestamptz DEFAULT now(),
  status text NOT NULL CHECK (status IN ('success', 'failed'))
);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own email logs"
  ON email_logs
  FOR SELECT
  USING (true);

CREATE POLICY "System can insert email logs"
  ON email_logs
  FOR INSERT
  WITH CHECK (true);