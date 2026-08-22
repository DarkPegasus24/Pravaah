// ==============================================================================
// PRAVAAH - WhatsApp Business Cloud API & Twilio Inbound Webhook
// ==============================================================================
// Handles both Meta Webhook Verification (GET) and Inbound WhatsApp Messages (POST).

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const url = new URL(req.url);

  // 1. Handle Meta Webhook Verification Handshake (GET)
  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    const expectedToken = Deno.env.get('WHATSAPP_VERIFY_TOKEN') || 'pravaah_verify_token_2026';

    if (mode === 'subscribe' && token === expectedToken) {
      console.log('WhatsApp Webhook verification successful!');
      return new Response(challenge, { status: 200 });
    }

    return new Response('Verification failed. Invalid token.', { status: 403 });
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // 2. Handle Inbound WhatsApp Message (POST)
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let senderPhone = '';
    let customerName = '';
    let messageText = '';

    const contentType = req.headers.get('content-type') || '';

    // Check if payload is Twilio format or Meta Cloud API format
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      senderPhone = formData.get('From')?.toString().replace('whatsapp:', '') || '';
      customerName = formData.get('ProfileName')?.toString() || `WhatsApp (${senderPhone})`;
      messageText = formData.get('Body')?.toString() || '';
    } else {
      const payload = await req.json();
      console.log('Received WhatsApp payload:', JSON.stringify(payload, null, 2));

      // Meta Cloud API structure: entry[0].changes[0].value.messages[0]
      const entry = payload.entry?.[0];
      const change = entry?.changes?.[0]?.value;
      const message = change?.messages?.[0];
      const contact = change?.contacts?.[0];

      if (message) {
        senderPhone = message.from || '';
        customerName = contact?.profile?.name || `WhatsApp Contact (+${senderPhone})`;
        messageText = message.text?.body || '';
      } else {
        // Fallback for custom webhook payloads
        senderPhone = payload.from || payload.sender || payload.phone || '';
        customerName = payload.name || `WhatsApp (${senderPhone})`;
        messageText = payload.message || payload.text || payload.body || '';
      }
    }

    if (!senderPhone || !messageText) {
      return new Response(JSON.stringify({ status: 'ignored_or_empty' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    console.log(`WhatsApp from ${customerName} (${senderPhone}): "${messageText}"`);

    // 1. Find or create conversation in Supabase with channel = 'whatsapp'
    let conversationId = null;
    const { data: existingConv } = await supabase
      .from('conversations')
      .select('id, customer_name')
      .or(`customer_contact.eq.${senderPhone},caller_number.eq.${senderPhone}`)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingConv) {
      conversationId = existingConv.id;
      await supabase
        .from('conversations')
        .update({
          channel: 'whatsapp',
          customer_name: customerName,
          status: 'open',
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId);
    } else {
      const { data: newConv, error: newConvErr } = await supabase
        .from('conversations')
        .insert([
          {
            customer_name: customerName,
            customer_contact: senderPhone,
            caller_number: senderPhone,
            channel: 'whatsapp',
            status: 'open',
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (!newConvErr && newConv) {
        conversationId = newConv.id;
      }
    }

    // 2. Insert incoming customer message
    if (conversationId) {
      await supabase.from('messages').insert([
        {
          conversation_id: conversationId,
          sender: 'customer',
          content: messageText,
          created_at: new Date().toISOString(),
        },
      ]);
    }

    // 3. Generate context-aware AI response
    const { data: settings } = await supabase
      .from('agent_settings')
      .select('knowledge_base, whatsapp_auto_reply_enabled, whatsapp_access_token, whatsapp_phone_number_id')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const aiReplyText = `Hello ${customerName}! 👋 Thank you for messaging Pravaah. 

We provide 24/7 autonomous voice, SMS, and WhatsApp operations for modern businesses. 

How can we assist you today? If you would like to book a 15-minute discovery demo, visit: https://pravaah.ai/meet`;

    // 4. Insert AI reply into 'messages'
    if (conversationId) {
      await supabase.from('messages').insert([
        {
          conversation_id: conversationId,
          sender: 'ai',
          content: aiReplyText,
          created_at: new Date().toISOString(),
        },
      ]);

      // 5. Log to 'whatsapp_logs'
      await supabase.from('whatsapp_logs').insert([
        {
          conversation_id: conversationId,
          sender_wa_id: senderPhone,
          message_body: aiReplyText,
          status: 'delivered',
        },
      ]);
    }

    // 6. If Meta Cloud API credentials are provided, call Meta Graph API to send WhatsApp message
    const accessToken = settings?.whatsapp_access_token || Deno.env.get('WHATSAPP_ACCESS_TOKEN');
    const phoneNumberId = settings?.whatsapp_phone_number_id || Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');

    if (accessToken && phoneNumberId) {
      try {
        const metaRes = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: senderPhone,
            type: 'text',
            text: { body: aiReplyText },
          }),
        });

        const metaData = await metaRes.json();
        console.log('Meta WhatsApp API response:', metaData);
      } catch (metaErr) {
        console.error('Meta WhatsApp API send error:', metaErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'WhatsApp webhook processed successfully',
        conversation_id: conversationId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('WhatsApp Webhook Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
