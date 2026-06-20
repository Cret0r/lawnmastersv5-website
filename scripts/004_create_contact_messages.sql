-- ============================================================
-- 004_create_contact_messages.sql
-- Creates the contact_messages table for /contact form submissions
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS contact_messages (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  email       text        NOT NULL,
  phone       text,
  subject     text,
  message     text        NOT NULL,
  read        boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert (contact form submissions)
CREATE POLICY "anon_insert_contact_messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service role full access (used by Server Actions via createAdminClient)
CREATE POLICY "service_role_all_contact_messages"
  ON contact_messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to read, update (mark read), and delete
CREATE POLICY "authenticated_select_contact_messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated_update_contact_messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_delete_contact_messages"
  ON contact_messages
  FOR DELETE
  TO authenticated
  USING (true);
