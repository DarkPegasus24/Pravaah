import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  BookOpen,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mic,
  Volume2,
  PhoneOff,
  User,
  Sparkles,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Zap,
  Bot,
  Radio,
  Sliders,
  Smartphone,
  MessageCircle,
  Share2,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  Input,
} from '../components/ui';
import { supabase } from '../lib/supabaseClient';

const VOICE_PERSONAS = [
  {
    id: 'receptionist',
    name: 'Front-Desk Receptionist',
    desc: 'Warm, professional, answers FAQs, and books appointments.',
    icon: User,
  },
  {
    id: 'sales_rep',
    name: 'SaaS Solutions Consultant',
    desc: 'Qualifies BANT budget, handles pricing, and books demo slots.',
    icon: Sparkles,
  },
  {
    id: 'healthcare',
    name: 'Clinic Care Coordinator',
    desc: 'Patient intake, physician availability, and clinic procedures.',
    icon: ShieldCheck,
  },
  {
    id: 'support_sla',
    name: 'Emergency SLA Dispatcher',
    desc: 'High-urgency triage, incident logging, and on-call escalation.',
    icon: Zap,
  },
];

const ACCENT_OPTIONS = [
  { id: 'en-IN', label: 'English (India / Hinglish)', flag: '🇮🇳' },
  { id: 'en-US', label: 'English (United States)', flag: '🇺🇸' },
  { id: 'en-GB', label: 'English (United Kingdom)', flag: '🇬🇧' },
  { id: 'hi-IN', label: 'Hindi (National)', flag: '🇮🇳' },
];

export default function Calling() {
  // Settings Form State
  const [businessPhone, setBusinessPhone] = useState('8302692120');
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [omnidimApiKey, setOmnidimApiKey] = useState('');
  const [omnidimAgentId, setOmnidimAgentId] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('receptionist');
  const [selectedAccent, setSelectedAccent] = useState('en-IN');
  const [existingSettingId, setExistingSettingId] = useState(null);

  // SMS Automation Settings State
  const [smsAutoReplyEnabled, setSmsAutoReplyEnabled] = useState(true);
  const [smsMissedCallEnabled, setSmsMissedCallEnabled] = useState(true);
  const [smsPostCallEnabled, setSmsPostCallEnabled] = useState(true);
  const [smsMissedCallText, setSmsMissedCallText] = useState(
    'Hi! Sorry we missed your call to Pravaah. How can we assist you today? Feel free to reply directly to this text.'
  );
  const [smsPostCallText, setSmsPostCallText] = useState(
    'Hi {customer_name}, thanks for speaking with Pravaah! Here is your meeting details link: https://pravaah.ai/book. Let us know if you need anything else.'
  );

  // WhatsApp Automation Settings State
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [whatsappPhoneNumberId, setWhatsappPhoneNumberId] = useState('');
  const [whatsappAccessToken, setWhatsappAccessToken] = useState('');
  const [whatsappVerifyToken] = useState('pravaah_verify_token_2026');
  const [whatsappAutoReplyEnabled, setWhatsappAutoReplyEnabled] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedSmsWebhook, setCopiedSmsWebhook] = useState(false);
  const [copiedWaWebhook, setCopiedWaWebhook] = useState(false);
  const [copiedWaToken, setCopiedWaToken] = useState(false);

  // Web Voice Demo State
  const [callState, setCallState] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'
  const [transcript, setTranscript] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);

  const activeCallRef = useRef(false);
  const recognitionRef = useRef(null);
  const activeConvIdRef = useRef(null);
  const transcriptEndRef = useRef(null);

  const voiceWebhookEndpoint = `${import.meta.env.VITE_SUPABASE_URL || 'https://khncmjutalqwepxrydvt.supabase.co'}/functions/v1/voice-call-webhook`;
  const smsWebhookEndpoint = `${import.meta.env.VITE_SUPABASE_URL || 'https://khncmjutalqwepxrydvt.supabase.co'}/functions/v1/sms-inbound-webhook`;
  const whatsappWebhookEndpoint = `${import.meta.env.VITE_SUPABASE_URL || 'https://khncmjutalqwepxrydvt.supabase.co'}/functions/v1/whatsapp-webhook`;

  // Sync ref with state
  useEffect(() => {
    activeConvIdRef.current = activeConvId;
  }, [activeConvId]);

  // 1. Fetch existing settings from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchAgentSettings() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const { data, error } = await supabase
          .from('agent_settings')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (isMounted) {
          if (data && data.length > 0) {
            const setting = data[0];
            setExistingSettingId(setting.id);
            setBusinessPhone(setting.business_phone || '8302692120');
            setKnowledgeBase(setting.knowledge_base || '');
            setOmnidimApiKey(setting.omnidim_api_key || '');
            setOmnidimAgentId(setting.omnidim_agent_id || '');
            setSelectedPersona(setting.voice_persona || 'receptionist');
            setSelectedAccent(setting.voice_accent || 'en-IN');
            setSmsAutoReplyEnabled(setting.sms_auto_reply_enabled !== false);
            setSmsMissedCallEnabled(setting.sms_missed_call_reply_enabled !== false);
            setSmsPostCallEnabled(setting.sms_post_call_followup_enabled !== false);
            if (setting.sms_missed_call_text) setSmsMissedCallText(setting.sms_missed_call_text);
            if (setting.sms_post_call_text) setSmsPostCallText(setting.sms_post_call_text);

            setWhatsappEnabled(setting.whatsapp_enabled !== false);
            setWhatsappPhoneNumberId(setting.whatsapp_phone_number_id || '');
            setWhatsappAccessToken(setting.whatsapp_access_token || '');
            setWhatsappAutoReplyEnabled(setting.whatsapp_auto_reply_enabled !== false);
          } else {
            setBusinessPhone('8302692120');
            setKnowledgeBase('');
            setSelectedPersona('receptionist');
            setSelectedAccent('en-IN');
          }
        }
      } catch (err) {
        console.error('Error fetching agent settings:', err);
        if (isMounted) {
          setErrorMessage(err.message || 'Failed to load agent settings.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchAgentSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      activeCallRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore cleanup errors
        }
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-scroll transcript when new dialogue is added
  useEffect(() => {
    if (transcript.length > 0) {
      transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript]);

  // Copy webhook URL helper
  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(voiceWebhookEndpoint);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2500);
  };

  const handleCopySmsWebhook = () => {
    navigator.clipboard.writeText(smsWebhookEndpoint);
    setCopiedSmsWebhook(true);
    setTimeout(() => setCopiedSmsWebhook(false), 2500);
  };

  const handleCopyWaWebhook = () => {
    navigator.clipboard.writeText(whatsappWebhookEndpoint);
    setCopiedWaWebhook(true);
    setTimeout(() => setCopiedWaWebhook(false), 2500);
  };

  const handleCopyWaToken = () => {
    navigator.clipboard.writeText(whatsappVerifyToken);
    setCopiedWaToken(true);
    setTimeout(() => setCopiedWaToken(false), 2500);
  };

  // Quick Template Helper
  const handleInsertTemplate = (type) => {
    if (type === 'clinic') {
      setKnowledgeBase(
        `Business Name: Apex Dental & Wellness Care\nWorking Hours: Monday to Saturday, 9:00 AM - 7:00 PM EST\nAddress: 450 Medical Plaza, Suite 200\nServices & Pricing:\n- General Dental Consultation: $75\n- Teeth Whitening & Cleaning: $180\n- Root Canal & Crown Therapy: $650 - $950\n- Emergency Dental Care: 24/7 On-Call Support\nBooking Policy: Appointments require 24h advance notice for cancellations. We accept major dental insurance (Delta, Cigna, Aetna, MetLife).\nEmergency Line: For acute pain or fractures, route immediately to on-call duty nurse.`
      );
    } else if (type === 'saas') {
      setKnowledgeBase(
        `Company: Pravaah Cloud Technologies\nProduct: AI Autonomous Business Operations Platform\nPricing Plans:\n- Starter: $199/month (Includes 500 autonomous voice minutes + CRM sync)\n- Growth: $499/month (2,500 voice minutes, custom voice cloning, SLA escalations)\n- Enterprise: Custom ($1,500+/mo, dedicated SIP trunking, 99.99% uptime)\nTarget Customers: B2B SaaS, Dental/Medical Clinics, Legal Firms, Real Estate Agencies.\nDemo Booking: Book 30-min architecture walkthrough with Senior Solutions Architect Monday through Friday 10 AM to 5 PM EST.`
      );
    }
  };

  // 2. Save or update settings in Supabase
  const handleSaveSettings = async (e) => {
    e?.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const payload = {
        business_phone: businessPhone.trim() || '8302692120',
        knowledge_base: knowledgeBase.trim(),
        omnidim_api_key: omnidimApiKey.trim(),
        omnidim_agent_id: omnidimAgentId.trim(),
        voice_persona: selectedPersona,
        voice_accent: selectedAccent,
        voice_provider: 'omnidim',
        sms_auto_reply_enabled: smsAutoReplyEnabled,
        sms_missed_call_reply_enabled: smsMissedCallEnabled,
        sms_post_call_followup_enabled: smsPostCallEnabled,
        sms_missed_call_text: smsMissedCallText.trim(),
        sms_post_call_text: smsPostCallText.trim(),
        whatsapp_enabled: whatsappEnabled,
        whatsapp_phone_number_id: whatsappPhoneNumberId.trim(),
        whatsapp_access_token: whatsappAccessToken.trim(),
        whatsapp_verify_token: whatsappVerifyToken,
        whatsapp_auto_reply_enabled: whatsappAutoReplyEnabled,
        updated_at: new Date().toISOString(),
      };

      if (existingSettingId) {
        const { data, error } = await supabase
          .from('agent_settings')
          .update(payload)
          .eq('id', existingSettingId)
          .select();

        if (error) throw error;
        if (data && data.length > 0) {
          setExistingSettingId(data[0].id);
        }
      } else {
        const { data, error } = await supabase
          .from('agent_settings')
          .insert([payload])
          .select();

        if (error) throw error;
        if (data && data.length > 0) {
          setExistingSettingId(data[0].id);
        }
      }

      setSuccessMessage('Voice, SMS, WhatsApp, and Knowledge Base successfully saved to Supabase!');
      setTimeout(() => setSuccessMessage(null), 4500);
    } catch (err) {
      console.error('Error saving agent settings:', err);
      setErrorMessage(err.message || 'Failed to save settings. Please check database connection.');
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // Web Voice Agent Logic (Speech API Loop)
  // ==========================================
  const startListening = (convId) => {
    if (!activeCallRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore
      }
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedAccent;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        if (activeCallRef.current) {
          setCallState('listening');
        }
      };

      recognition.onresult = async (event) => {
        if (!activeCallRef.current) return;

        const customerSpokenText = event.results[0][0]?.transcript;
        if (!customerSpokenText || !customerSpokenText.trim()) {
          if (activeCallRef.current) startListening(convId);
          return;
        }

        setTranscript((prev) => [
          ...prev,
          {
            id: `cust-${Date.now()}`,
            sender: 'customer',
            text: customerSpokenText,
            time: new Date(),
          },
        ]);

        setCallState('thinking');

        try {
          const { data, error } = await supabase.functions.invoke('voice-chat-agent', {
            body: {
              conversation_id: convId || activeConvIdRef.current,
              customer_message: customerSpokenText,
              knowledge_base: knowledgeBase,
              persona: selectedPersona,
            },
          });

          if (!activeCallRef.current) return;
          if (error) console.error('voice-chat-agent error:', error);

          const aiReply =
            data?.reply ||
            data?.message ||
            data?.ai_response ||
            data?.response ||
            'I have noted that down. Is there anything else I can help you with?';

          setTranscript((prev) => [
            ...prev,
            {
              id: `ai-${Date.now()}`,
              sender: 'ai',
              text: aiReply,
              time: new Date(),
            },
          ]);

          speakAiResponse(aiReply, convId || activeConvIdRef.current);
        } catch (err) {
          console.error('Error invoking voice-chat-agent:', err);
          if (activeCallRef.current) {
            startListening(convId);
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn('SpeechRecognition event error:', event.error);
        if (activeCallRef.current && event.error !== 'not-allowed') {
          setTimeout(() => {
            if (activeCallRef.current && callState !== 'speaking' && callState !== 'thinking') {
              startListening(convId);
            }
          }, 300);
        }
      };

      recognition.onend = () => {
        if (activeCallRef.current && callState === 'listening') {
          setTimeout(() => {
            if (activeCallRef.current && callState === 'listening') {
              startListening(convId);
            }
          }, 200);
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start SpeechRecognition:', err);
      if (activeCallRef.current) {
        setTimeout(() => startListening(convId), 500);
      }
    }
  };

  const speakAiResponse = (text, convId) => {
    if (!activeCallRef.current || typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      setCallState('speaking');

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedAccent;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        if (activeCallRef.current) {
          startListening(convId);
        }
      };

      utterance.onerror = (err) => {
        console.warn('SpeechSynthesis error:', err);
        if (activeCallRef.current) {
          startListening(convId);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Failed SpeechSynthesis:', err);
      if (activeCallRef.current) {
        startListening(convId);
      }
    }
  };

  const handleStartCall = async () => {
    activeCallRef.current = true;
    setTranscript([]);
    setActiveConvId(null);
    setCallState('thinking');

    try {
      const { data, error } = await supabase.functions.invoke('voice-chat-agent', {
        body: {
          conversation_id: null,
          customer_message: null,
          knowledge_base: knowledgeBase,
          persona: selectedPersona,
        },
      });

      if (!activeCallRef.current) return;
      if (error) console.error('Initial voice-chat-agent invoke error:', error);

      const returnedConvId = data?.conversation_id || data?.conversationId || null;
      if (returnedConvId) {
        setActiveConvId(returnedConvId);
        activeConvIdRef.current = returnedConvId;
      }

      const greeting =
        data?.reply ||
        data?.message ||
        data?.greeting ||
        data?.ai_response ||
        'Hello! Thank you for calling Pravaah. How can I help you today?';

      setTranscript([
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: greeting,
          time: new Date(),
        },
      ]);

      speakAiResponse(greeting, returnedConvId);
    } catch (err) {
      console.error('Failed to start voice call:', err);
      if (activeCallRef.current) {
        setCallState('idle');
        activeCallRef.current = false;
      }
    }
  };

  const handleEndCall = () => {
    activeCallRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setCallState('idle');
  };

  const formatDialogueTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto animate-fadeIn font-sans selection:bg-[#0058be] selection:text-white pb-14">
      {/* 1. Page Executive Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#e5eeff]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
              Omnichannel Telephony & Messaging Hub
            </h1>
            <Badge variant="success" dot pulse size="sm" className="font-semibold shadow-xs">
              Voice • SMS • WhatsApp
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#45464d] leading-relaxed">
            Configure 24/7 AI voice reception, automated SMS confirmations, and Meta WhatsApp Business Cloud API automated customer messaging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://developers.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#dce9ff] text-[#0b1c30] hover:text-[#0c9488] hover:border-[#0c9488] transition-colors shadow-xs"
          >
            <span>Meta Developers</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#0c9488]" />
          </a>
        </div>
      </div>

      {isLoading ? (
        <Card variant="default" className="p-12 text-center flex flex-col items-center justify-center gap-3 bg-white border-[#e5eeff] rounded-2xl shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-[#0058be]" />
          <p className="text-xs sm:text-sm text-[#76777d]">Loading channels configuration from Supabase...</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Voice, SMS & WhatsApp Settings (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Inbound Phone & Voice Webhook Card */}
            <Card variant="default" className="bg-white border-[#e5eeff] shadow-[0_1px_3px_rgba(11,28,48,0.05)] rounded-2xl overflow-hidden">
              <CardHeader className="bg-[#0b1c30] text-white p-5 sm:p-6 border-b border-[#131b2e]">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#131b2e] border border-[#213145] text-[#89f5e7] flex items-center justify-center">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                        Inbound Voice Line
                        <Badge variant="success" size="sm" className="text-[10px] bg-[#0c9488]/20 text-[#89f5e7] border-[#0c9488]/40">
                          Active
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-xs text-[#adc6ff]">
                        Assigned Telephony Number & Voice Webhook
                      </CardDescription>
                    </div>
                  </div>

                  <div className="font-mono text-sm font-bold text-[#89f5e7] px-3 py-1 rounded-lg bg-[#131b2e] border border-[#213145]">
                    +{businessPhone || '8302692120'}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-6 flex flex-col gap-5">
                {/* Voice Webhook URL Endpoint Box */}
                <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#dce9ff] flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0b1c30] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#0058be]" />
                      <span>Post-Call Voice Webhook Endpoint URL</span>
                    </span>
                    <button
                      onClick={handleCopyWebhook}
                      className="text-xs font-semibold text-[#0058be] hover:text-[#004395] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedWebhook ? <Check className="w-3.5 h-3.5 text-[#0c9488]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedWebhook ? 'Copied!' : 'Copy Webhook'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-[#45464d] bg-white p-2.5 rounded-lg border border-[#e5eeff] break-all select-all">
                    {voiceWebhookEndpoint}
                  </div>
                </div>

                {/* Voice Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Voice Agent ID"
                    placeholder="e.g. 243470"
                    value={omnidimAgentId}
                    onChange={(e) => setOmnidimAgentId(e.target.value)}
                    helperText="Agent ID from your voice provider."
                    size="sm"
                    className="bg-white border-[#dce9ff]"
                  />
                  <Input
                    label="Business Phone Number"
                    placeholder="+1 8302692120"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    startIcon={<Phone className="w-3.5 h-3.5 text-[#76777d]" />}
                    helperText="Customers dial this number to speak or text."
                    size="sm"
                    className="bg-white border-[#dce9ff]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Business Cloud API Card (NEW FEATURE) */}
            <Card variant="default" className="bg-white border-[#e5eeff] shadow-[0_1px_3px_rgba(11,28,48,0.05)] rounded-2xl overflow-hidden">
              <CardHeader className="bg-[#f0fdf4] border-b border-[#bbf7d0] p-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-[#14532d] flex items-center gap-2">
                        WhatsApp Business Cloud API
                        <Badge variant="success" size="sm" className="text-[10px] bg-[#25D366]/20 text-[#166534] border-[#25D366]/40">
                          Meta Ready
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-[11px] text-[#15803d]">
                        Direct 24/7 AI conversations on official WhatsApp Business
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 flex flex-col gap-5">
                {/* WhatsApp Webhook & Verify Token Box */}
                <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#14532d] flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#16a34a]" />
                        <span>Callback URL (Webhook)</span>
                      </span>
                      <button
                        onClick={handleCopyWaWebhook}
                        className="text-xs font-semibold text-[#16a34a] hover:text-[#15803d] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedWaWebhook ? <Check className="w-3.5 h-3.5 text-[#16a34a]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedWaWebhook ? 'Copied!' : 'Copy URL'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-[#14532d] bg-white p-2 rounded-lg border border-[#bbf7d0] break-all select-all">
                      {whatsappWebhookEndpoint}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#14532d]">Verify Token (Meta Handshake)</span>
                      <button
                        onClick={handleCopyWaToken}
                        className="text-xs font-semibold text-[#16a34a] hover:text-[#15803d] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedWaToken ? <Check className="w-3.5 h-3.5 text-[#16a34a]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedWaToken ? 'Copied!' : 'Copy Token'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-[#14532d] bg-white p-2 rounded-lg border border-[#bbf7d0] select-all">
                      {whatsappVerifyToken}
                    </div>
                  </div>
                </div>

                {/* WhatsApp Toggles & Fields */}
                <div className="p-3.5 rounded-xl bg-white border border-[#e5eeff] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#0b1c30] block">
                      24/7 AI WhatsApp Auto-Pilot
                    </span>
                    <span className="text-[11px] text-[#76777d]">
                      AI automatically replies to WhatsApp messages using your Knowledge Base.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={whatsappAutoReplyEnabled}
                    onChange={(e) => setWhatsappAutoReplyEnabled(e.target.checked)}
                    className="w-5 h-5 accent-[#16a34a] rounded cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="WhatsApp Phone Number ID"
                    placeholder="e.g. 1049283749284"
                    value={whatsappPhoneNumberId}
                    onChange={(e) => setWhatsappPhoneNumberId(e.target.value)}
                    helperText="From Meta App Dashboard > WhatsApp > API Setup"
                    size="sm"
                    className="bg-white border-[#dce9ff]"
                  />
                  <Input
                    label="Meta Permanent Access Token"
                    type="password"
                    placeholder="EAABw..."
                    value={whatsappAccessToken}
                    onChange={(e) => setWhatsappAccessToken(e.target.value)}
                    helperText="System User token with whatsapp_business_messaging"
                    size="sm"
                    className="bg-white border-[#dce9ff]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* SMS Automations & Two-Way Texting Card */}
            <Card variant="default" className="bg-white border-[#e5eeff] shadow-[0_1px_3px_rgba(11,28,48,0.05)] rounded-2xl overflow-hidden">
              <CardHeader className="bg-[#f8f9ff] border-b border-[#e5eeff] p-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#0058be] flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                        SMS Service Automations & Auto-Followups
                        <Badge variant="accent" size="sm" className="text-[10px]">
                          2-Way SMS
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-[11px] text-[#45464d]">
                        Automate text replies, missed-call recovery, and post-booking confirmations
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 flex flex-col gap-5">
                {/* SMS Inbound Webhook Endpoint */}
                <div className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#dce9ff] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0b1c30] flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-[#0058be]" />
                      <span>Inbound SMS Webhook URL</span>
                    </span>
                    <button
                      onClick={handleCopySmsWebhook}
                      className="text-xs font-semibold text-[#0058be] hover:text-[#004395] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSmsWebhook ? <Check className="w-3.5 h-3.5 text-[#0c9488]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSmsWebhook ? 'Copied!' : 'Copy SMS URL'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-[#45464d] bg-white p-2 rounded-lg border border-[#e5eeff] break-all select-all">
                    {smsWebhookEndpoint}
                  </div>
                </div>

                {/* SMS Toggles */}
                <div className="flex flex-col gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-[#e5eeff] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#0b1c30] block">
                        24/7 AI Two-Way SMS Auto-Reply
                      </span>
                      <span className="text-[11px] text-[#76777d]">
                        When customers text your number, Pravaah AI replies automatically in under 2s.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsAutoReplyEnabled}
                      onChange={(e) => setSmsAutoReplyEnabled(e.target.checked)}
                      className="w-5 h-5 accent-[#0058be] rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-[#e5eeff] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#0b1c30] block">
                        Instant Post-Call SMS Follow-up
                      </span>
                      <span className="text-[11px] text-[#76777d]">
                        Automatically text callers a calendar booking or thank-you link when phone calls end.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsPostCallEnabled}
                      onChange={(e) => setSmsPostCallEnabled(e.target.checked)}
                      className="w-5 h-5 accent-[#0058be] rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-[#e5eeff] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#0b1c30] block">
                        Missed-Call Instant Text Back
                      </span>
                      <span className="text-[11px] text-[#76777d]">
                        If a phone call is missed, instantly send a text to recover and qualify the lead.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsMissedCallEnabled}
                      onChange={(e) => setSmsMissedCallEnabled(e.target.checked)}
                      className="w-5 h-5 accent-[#0058be] rounded cursor-pointer"
                    />
                  </div>
                </div>

                {smsPostCallEnabled && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#0b1c30]">Post-Call SMS Message Text</label>
                    <textarea
                      rows={2}
                      value={smsPostCallText}
                      onChange={(e) => setSmsPostCallText(e.target.value)}
                      className="w-full bg-[#f8f9ff] text-[#0b1c30] text-xs p-3 rounded-xl border border-[#dce9ff] focus:outline-none focus:border-[#0058be]"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Persona & Language Selection */}
            <Card variant="default" className="bg-white border-[#e5eeff] shadow-[0_1px_3px_rgba(11,28,48,0.05)] rounded-2xl overflow-hidden">
              <CardHeader className="bg-[#f8f9ff] border-b border-[#e5eeff] p-5">
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-[#0058be]" />
                  <CardTitle className="text-sm font-bold text-[#0b1c30]">
                    Agent Persona & Voice Customization
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="p-5 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#0b1c30]">Select Voice, SMS & WhatsApp Agent Persona</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {VOICE_PERSONAS.map((persona) => {
                      const IconC = persona.icon;
                      const isSelected = selectedPersona === persona.id;
                      return (
                        <button
                          key={persona.id}
                          type="button"
                          onClick={() => setSelectedPersona(persona.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col gap-1.5 ${
                            isSelected
                              ? 'bg-[#eff4ff] border-[#0058be] text-[#004395] shadow-xs'
                              : 'bg-white border-[#dce9ff] hover:border-[#0058be]/50 text-[#45464d]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#0b1c30]">{persona.name}</span>
                            <IconC className={`w-4 h-4 ${isSelected ? 'text-[#0058be]' : 'text-[#76777d]'}`} />
                          </div>
                          <p className="text-[11px] leading-tight text-[#45464d]">{persona.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#0b1c30]">Language & Regional Accent</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ACCENT_OPTIONS.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setSelectedAccent(acc.id)}
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          selectedAccent === acc.id
                            ? 'bg-[#0058be] text-white border-[#0058be] shadow-xs'
                            : 'bg-white text-[#45464d] border-[#dce9ff] hover:border-[#0058be]'
                        }`}
                      >
                        <span>{acc.flag}</span>
                        <span>{acc.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Knowledge Base Editor Card */}
            <Card variant="default" className="bg-white border-[#e5eeff] shadow-[0_1px_3px_rgba(11,28,48,0.05)] rounded-2xl overflow-hidden">
              <CardHeader className="bg-[#f8f9ff] border-b border-[#e5eeff] p-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#0058be]" />
                    <CardTitle className="text-sm font-bold text-[#0b1c30]">
                      Unified Knowledge Base (Voice, SMS & WhatsApp)
                    </CardTitle>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#76777d]">Templates:</span>
                    <button
                      type="button"
                      onClick={() => handleInsertTemplate('clinic')}
                      className="text-[11px] font-semibold text-[#0058be] hover:underline cursor-pointer"
                    >
                      + Dental Clinic
                    </button>
                    <span className="text-[#dce9ff]">|</span>
                    <button
                      type="button"
                      onClick={() => handleInsertTemplate('saas')}
                      className="text-[11px] font-semibold text-[#0058be] hover:underline cursor-pointer"
                    >
                      + SaaS Pricing
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 flex flex-col gap-4">
                {successMessage && (
                  <div className="p-3.5 rounded-xl bg-[#e6fcf8] border border-[#89f5e7] text-[#005049] flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-[#0c9488] shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <textarea
                  rows={8}
                  value={knowledgeBase}
                  onChange={(e) => setKnowledgeBase(e.target.value)}
                  placeholder="Paste company FAQs, pricing, operating hours, and booking rules. Voice, SMS, and WhatsApp AI services will all reference this knowledge base."
                  className="w-full bg-[#f8f9ff] text-[#0b1c30] placeholder:text-[#76777d] border border-[#dce9ff] rounded-xl p-4 text-xs leading-relaxed transition-all focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] resize-y"
                />

                <div className="flex items-center justify-between text-[11px] text-[#76777d]">
                  <span>{knowledgeBase.length.toLocaleString()} characters ({knowledgeBase.trim() ? knowledgeBase.trim().split(/\s+/).length : 0} words)</span>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="font-bold text-xs rounded-xl shadow-xs"
                    leftIcon={isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  >
                    {isSaving ? 'Syncing...' : 'Save All Channels'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: In-Browser AI Voice Sandbox (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Card variant="default" className="bg-[#0b1c30] text-white border border-[#131b2e] shadow-xl rounded-3xl overflow-hidden flex flex-col justify-between sticky top-24">
              <CardHeader className="bg-[#131b2e] border-b border-[#213145] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0c9488] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0c9488]" />
                    </span>
                    <CardTitle className="text-sm font-bold text-white">
                      Voice Agent Test Sandbox
                    </CardTitle>
                  </div>
                  <Badge variant="accent" size="sm" className="text-[10px] bg-[#213145] text-[#adc6ff] border-[#324866]">
                    Browser Simulator
                  </Badge>
                </div>
                <CardDescription className="text-xs text-[#adc6ff] mt-1">
                  Rehearse and test how your AI sounds with your knowledge base before taking real phone calls.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 flex flex-col gap-4">
                {/* Visualizer Status Orb */}
                <div className="p-6 rounded-2xl bg-[#131b2e]/60 border border-[#213145] flex flex-col items-center justify-center gap-3">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      callState === 'listening'
                        ? 'bg-red-500/20 text-red-400 border-2 border-red-400 animate-pulse scale-110 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                        : callState === 'thinking'
                        ? 'bg-amber-500/20 text-amber-300 border-2 border-amber-400 animate-spin'
                        : callState === 'speaking'
                        ? 'bg-[#0058be]/30 text-[#89f5e7] border-2 border-[#89f5e7] animate-pulse scale-105 shadow-[0_0_20px_rgba(0,88,190,0.5)]'
                        : 'bg-white/10 text-white/60 border border-white/15'
                    }`}
                  >
                    {callState === 'listening' ? (
                      <Mic className="w-7 h-7 text-red-400" />
                    ) : callState === 'thinking' ? (
                      <Loader2 className="w-7 h-7 text-amber-300 animate-spin" />
                    ) : callState === 'speaking' ? (
                      <Volume2 className="w-7 h-7 text-[#89f5e7]" />
                    ) : (
                      <Phone className="w-7 h-7" />
                    )}
                  </div>

                  <div className="text-center">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#89f5e7] block">
                      {callState === 'idle' && 'Ready for Test Call'}
                      {callState === 'listening' && 'Listening to Your Microphone...'}
                      {callState === 'thinking' && 'AI Generating Voice Response...'}
                      {callState === 'speaking' && 'AI Speaking Response...'}
                    </span>
                    <span className="text-[11px] text-[#adc6ff]">
                      {callState === 'idle' ? 'Click below to start a live audio session.' : 'Speak into your microphone.'}
                    </span>
                  </div>

                  {(callState === 'speaking' || callState === 'listening') && (
                    <div className="flex items-center gap-1.5 h-6 mt-1">
                      <div className="w-1 bg-[#89f5e7] h-3 animate-pulse" />
                      <div className="w-1 bg-[#89f5e7] h-6 animate-pulse delay-75" />
                      <div className="w-1 bg-[#89f5e7] h-4 animate-pulse delay-150" />
                      <div className="w-1 bg-[#89f5e7] h-5 animate-pulse delay-100" />
                      <div className="w-1 bg-[#89f5e7] h-2 animate-pulse delay-200" />
                    </div>
                  )}
                </div>

                {/* Live Transcript Stream */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-[#adc6ff]">
                    <span className="font-semibold flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Live Speech Transcript</span>
                    </span>
                    {transcript.length > 0 && (
                      <button
                        onClick={() => setTranscript([])}
                        className="text-[10px] text-[#adc6ff] hover:text-white underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="h-52 bg-[#131b2e] rounded-xl p-3.5 border border-[#213145] overflow-y-auto flex flex-col gap-2.5 text-xs">
                    {transcript.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-[#7c839b] gap-1">
                        <Bot className="w-5 h-5 text-[#324866]" />
                        <span>No dialogue yet. Click "Start Test Call" to begin speaking.</span>
                      </div>
                    ) : (
                      transcript.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col gap-1 max-w-[85%] ${
                            msg.sender === 'ai' ? 'self-start items-start' : 'self-end items-end'
                          }`}
                        >
                          <div className="flex items-center gap-1 text-[10px] text-[#7c839b]">
                            <span>{msg.sender === 'ai' ? 'Pravaah AI' : 'You (Caller)'}</span>
                            <span>•</span>
                            <span>{formatDialogueTime(msg.time)}</span>
                          </div>
                          <div
                            className={`p-2.5 rounded-xl leading-relaxed ${
                              msg.sender === 'ai'
                                ? 'bg-[#213145] text-white rounded-tl-none border border-[#324866]'
                                : 'bg-[#0058be] text-white rounded-tr-none'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={transcriptEndRef} />
                  </div>
                </div>

                {/* Call Control Button */}
                <div className="pt-1">
                  {callState === 'idle' ? (
                    <button
                      type="button"
                      onClick={handleStartCall}
                      className="w-full py-3.5 rounded-xl bg-[#0058be] hover:bg-[#2170e4] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,88,190,0.35)] transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <Phone className="w-4 h-4 text-[#89f5e7]" />
                      <span>Start Voice Simulator Session</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEndCall}
                      className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(220,38,38,0.35)] transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <PhoneOff className="w-4 h-4" />
                      <span>End Test Call</span>
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
