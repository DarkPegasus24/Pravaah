// ==============================================================================
// PRAVAAH - OmniDimension / Telephony Inbound Voice Webhook Handler
// ==============================================================================
// Triggered by OmniDimension (or Telephony Provider) when a phone call starts,
// progresses, or completes. Inserts call logs, recordings, and transcripts into Supabase.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();
    console.log('Received Voice Webhook payload:', JSON.stringify(payload, null, 2));

    // Support OmniDimension, Vapi, Retell, and Custom Telephony Webhook shapes
    const eventType = payload.event || payload.type || payload.event_type || 'call.completed';
    const callData = payload.call || payload.data || payload;

    const callerNumber =
      callData.customer_phone_number ||
      callData.caller_id ||
      callData.from ||
      payload.from_number ||
      'Unknown Caller';

    const customerName =
      callData.customer_name ||
      callData.caller_name ||
      `Caller (${callerNumber})`;

    const recordingUrl =
      callData.recording_url ||
      callData.audio_url ||
      callData.recordingUrl ||
      payload.recording_url ||
      null;

    const durationSeconds =
      callData.duration_seconds ||
      callData.duration ||
      Math.round((callData.duration_ms || 0) / 1000) ||
      payload.duration ||
      60;

    const summary =
      callData.summary ||
      callData.analysis?.summary ||
      payload.summary ||
      'AI Phone inquiry handled autonomously.';

    const transcriptList =
      callData.transcript ||
      callData.messages ||
      callData.transcription ||
      payload.transcript ||
      [];

    // 1. Create or update conversation record in Supabase
    const { data: convData, error: convError } = await supabase
      .from('conversations')
      .insert([
        {
          customer_name: customerName,
          customer_contact: callerNumber,
          channel: 'voice',
          status: 'open',
          recording_url: recordingUrl,
          call_duration: durationSeconds,
          call_status: 'completed',
          call_summary: summary,
          caller_number: callerNumber,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (convError) {
      console.error('Error inserting voice conversation:', convError);
      throw convError;
    }

    const conversationId = convData.id;

    // 2. Insert turn-by-turn dialogue into 'messages' table
    if (Array.isArray(transcriptList) && transcriptList.length > 0) {
      const messagesToInsert = transcriptList.map((item: any) => {
        const sender =
          item.role === 'assistant' || item.speaker === 'agent' || item.sender === 'ai'
            ? 'ai'
            : 'customer';

        const content = item.content || item.text || item.message || '';

        return {
          conversation_id: conversationId,
          sender,
          content,
          created_at: item.timestamp || new Date().toISOString(),
        };
      }).filter((m: any) => m.content.trim().length > 0);

      if (messagesToInsert.length > 0) {
        const { error: msgError } = await supabase
          .from('messages')
          .insert(messagesToInsert);

        if (msgError) {
          console.error('Error inserting transcript messages:', msgError);
        }
      }
    } else if (typeof transcriptList === 'string' && transcriptList.trim()) {
      // If single string transcript
      await supabase.from('messages').insert([
        {
          conversation_id: conversationId,
          sender: 'customer',
          content: transcriptList,
          created_at: new Date().toISOString(),
        },
      ]);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Voice call webhook processed successfully',
        conversation_id: conversationId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Voice Webhook Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal Server Error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
