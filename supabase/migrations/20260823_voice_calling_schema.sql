-- ==============================================================================
-- PRAVAAH - Voice Calling & OmniDimension Telephony Schema Migration
-- ==============================================================================

-- 1. Ensure columns exist on the 'conversations' table for Voice Calls & Telephony
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS channel text DEFAULT 'web_chat',
ADD COLUMN IF NOT EXISTS recording_url text,
ADD COLUMN IF NOT EXISTS call_duration integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS call_status text DEFAULT 'completed',
ADD COLUMN IF NOT EXISTS call_summary text,
ADD COLUMN IF NOT EXISTS caller_number text;

-- Add index on channel and status for high-speed dashboard filtering
CREATE INDEX IF NOT EXISTS idx_conversations_channel ON public.conversations(channel);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at DESC);

-- 2. Ensure columns exist on 'agent_settings' table for OmniDimension integration
ALTER TABLE public.agent_settings
ADD COLUMN IF NOT EXISTS omnidim_api_key text,
ADD COLUMN IF NOT EXISTS omnidim_agent_id text,
ADD COLUMN IF NOT EXISTS voice_provider text DEFAULT 'omnidim',
ADD COLUMN IF NOT EXISTS voice_accent text DEFAULT 'en-IN',
ADD COLUMN IF NOT EXISTS voice_persona text DEFAULT 'receptionist',
ADD COLUMN IF NOT EXISTS call_forwarding_number text;

-- 3. Create helper view for Telephony Call Analytics
CREATE OR REPLACE VIEW public.voice_call_stats AS
SELECT
  COUNT(*) FILTER (WHERE channel = 'voice') AS total_voice_calls,
  COUNT(*) FILTER (WHERE channel = 'voice' AND created_at >= CURRENT_DATE) AS voice_calls_today,
  COALESCE(AVG(call_duration) FILTER (WHERE channel = 'voice' AND call_duration > 0), 0) AS avg_duration_seconds,
  COUNT(*) FILTER (WHERE channel = 'voice' AND call_status = 'completed') AS completed_calls,
  COUNT(*) FILTER (WHERE channel = 'voice' AND call_status = 'missed') AS missed_calls
FROM public.conversations;

-- 4. Enable Row Level Security (RLS) policies if not already active
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_settings ENABLE ROW LEVEL SECURITY;

-- Allow public / anon read and write for the operational dashboard demo
CREATE POLICY IF NOT EXISTS "Allow all access to conversations" 
ON public.conversations FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow all access to messages" 
ON public.messages FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow all access to agent_settings" 
ON public.agent_settings FOR ALL USING (true) WITH CHECK (true);
