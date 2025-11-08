/*
  # Create stores table

  1. New Tables
    - `stores`
      - `id` (uuid, primary key) - Unique identifier for each store
      - `code` (text, unique) - Store code identifier
      - `name` (text) - Store name
      - `area` (text) - Geographic area/location
      - `status` (text) - Active or Inactive status
      - `postcode` (text) - Postal code of the store
      - `created_at` (timestamp) - Record creation timestamp
  
  2. Security
    - Enable RLS on `stores` table
    - Add policy for authenticated users to read all stores
    - Add policy for authenticated users to manage stores
*/

CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  area text NOT NULL,
  status text NOT NULL DEFAULT 'Active',
  postcode text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all stores"
  ON stores
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert stores"
  ON stores
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update stores"
  ON stores
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete stores"
  ON stores
  FOR DELETE
  TO authenticated
  USING (true);