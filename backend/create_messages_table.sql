-- Run this in Supabase Dashboard > SQL Editor
-- https://supabase.com/dashboard/project/bvohfxaryojqhowndkhh/sql

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  sender_role text NOT NULL CHECK (sender_role IN ('mentor', 'student')),
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_conversation_idx ON messages (sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS messages_unread_idx ON messages (receiver_id, is_read);
