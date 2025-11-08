/*
  # Create messages table

  1. New Tables
    - `messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `title` (text) - Subject/title of the message
      - `body` (text) - Message content
      - `list_of_stores` (jsonb) - Array of store IDs or codes selected for this message
      - `user_id` (uuid) - Foreign key to auth.users, the user who created the message
      - `date_created` (timestamp) - Message creation timestamp
  
  2. Security
    - Enable RLS on `messages` table
    - Add policy for users to read only their own messages
    - Add policy for users to insert their own messages
    - Add policy for users to delete their own messages
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  list_of_stores jsonb DEFAULT '[]'::jsonb,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_created timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
  ON messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);