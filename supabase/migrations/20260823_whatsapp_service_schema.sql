-- ==============================================================================
-- PRAVAAH - WhatsApp Business AI Support & Messaging Schema Migration
-- ==============================================================================

-- 1. Ensure 'agent_settings' has WhatsApp credentials & automation toggles
ALTER TABLE public.agent_settings
ADD COLUMN IF NOT EXISTS whatsapp_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS whatsapp_phone_number_id text,
ADD COLUMN IF NOT EXISTS whatsapp_business_account_id text,
ADD COLUMN IF NOT EXISTS whatsapp_access_token text,
ADD COLUMN IF NOT EXISTS whatsapp_verify_token text DEFAULT 'pravaah_verify_token_2026',
ADD COLUMN IF NOT EXISTS whatsapp_auto_reply_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS whatsapp_greeting text DEFAULT 'Hello! 👋 Thank you for messaging Pravaah on WhatsApp. How can our AI assistant help you today?';

-- 2. Create 'whatsapp_logs' table for message delivery tracking
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_wa_id text NOT NULL,
  recipient_wa_id text,
  message_body text NOT NULL,
  message_id text,
  status text DEFAULT 'delivered', -- 'sent' | 'delivered' | 'read' | 'failed'
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_sender ON public.whatsapp_logs(sender_wa_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_created_at ON public.whatsapp_logs(created_at DESC);

-- 3. Enable RLS
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow all access to whatsapp_logs" ON public.whatsapp_logs FOR ALL USING (true) WITH CHECK (true);
