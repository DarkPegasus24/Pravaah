-- ==============================================================================
-- PRAVAAH - SMS Service Support & Two-Way Messaging Schema Migration
-- ==============================================================================

-- 1. Ensure 'agent_settings' has SMS automation toggles & templates
ALTER TABLE public.agent_settings
ADD COLUMN IF NOT EXISTS sms_auto_reply_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS sms_missed_call_reply_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS sms_post_call_followup_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS sms_missed_call_text text DEFAULT 'Hi! Sorry we missed your call to Pravaah. How can we assist you today? Feel free to reply directly to this text.',
ADD COLUMN IF NOT EXISTS sms_post_call_text text DEFAULT 'Hi {customer_name}, thanks for speaking with Pravaah! Here is your meeting details link: https://pravaah.ai/book. Let us know if you need anything else.',
ADD COLUMN IF NOT EXISTS sms_inbound_provider text DEFAULT 'twilio';

-- 2. Create 'sms_templates' table for quick dispatching in Conversations Hub
CREATE TABLE IF NOT EXISTS public.sms_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text DEFAULT 'general', -- 'followup' | 'confirmation' | 'reminder' | 'promotional'
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default starter SMS templates
INSERT INTO public.sms_templates (name, category, content)
VALUES
  (
    'Post-Call Demo Confirmation',
    'confirmation',
    'Hi {customer_name}! Your Pravaah discovery demo is scheduled. Access your meeting room here: https://pravaah.ai/meet'
  ),
  (
    'Missed Call Auto-Recovery',
    'followup',
    'Hi! Sorry we just missed your phone call. We are available 24/7—reply here with what you need and our AI will assist you immediately!'
  ),
  (
    'Appointment 1-Hour Reminder',
    'reminder',
    'Reminder: Your consultation with Pravaah starts in 1 hour. Reply "1" to confirm or "2" to reschedule.'
  ),
  (
    'Pricing & Deck Follow-up',
    'general',
    'Hi {customer_name}, here is the requested Pravaah platform overview & enterprise pricing sheet: https://pravaah.ai/pricing'
  )
ON CONFLICT DO NOTHING;

-- 3. Create 'sms_logs' table for real-time delivery telemetry
CREATE TABLE IF NOT EXISTS public.sms_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  recipient_phone text NOT NULL,
  sender_phone text DEFAULT '+18302692120',
  message_body text NOT NULL,
  direction text DEFAULT 'outbound', -- 'inbound' | 'outbound'
  delivery_status text DEFAULT 'delivered', -- 'queued' | 'sent' | 'delivered' | 'failed'
  segments integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sms_logs_recipient ON public.sms_logs(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_sms_logs_created_at ON public.sms_logs(created_at DESC);

-- 4. Enable RLS
ALTER TABLE public.sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow all access to sms_templates" ON public.sms_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow all access to sms_logs" ON public.sms_logs FOR ALL USING (true) WITH CHECK (true);
