/*
  # Update user_profiles to support default user without auth

  1. Changes
    - Remove foreign key constraint to auth.users
    - Allow manual user entries for demo purposes
    - Keep id as uuid primary key
*/

ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

INSERT INTO user_profiles (id, full_name) VALUES ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Demo User')
ON CONFLICT (id) DO NOTHING;