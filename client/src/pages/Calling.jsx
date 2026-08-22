import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  BookOpen,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info,
  Layers,
  Mic,
  Volume2,
  PhoneOff,
  User,
  Sparkles,
  MessageSquare,
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

export default function Calling() {
  // Settings Form State
  const [businessPhone, setBusinessPhone] = useState('8302692120');
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [existingSettingId, setExistingSettingId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Web Voice Demo State
  const [callState, setCallState] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'
  const [transcript, setTranscript] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  const activeCallRef = useRef(false);
  const recognitionRef = useRef(null);
  const activeConvIdRef = useRef(null);
  const transcriptEndRef = useRef(null);

  // Sync ref with state
  useEffect(() => {
    activeConvIdRef.current = activeConvId;
  }, [activeConvId]);

  // Check Web Speech API Support on mount
  useEffect(() => {
    const isSupported =
      typeof window !== 'undefined' &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition) &&
      !!window.speechSynthesis;
    setSpeechSupported(isSupported);
  }, []);

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
          } else {
            // Default phone number and empty knowledge base
            setBusinessPhone('8302692120');
            setKnowledgeBase('');
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

  // 2. Save or update settings in Supabase
  const handleSaveSettings = async (e) => {
    e?.preventDefault();
    if (!knowledgeBase.trim() || isSaving) return;

    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const payload = {
        business_phone: businessPhone.trim() || '8302692120',
        knowledge_base: knowledgeBase.trim(),
        updated_at: new Date().toISOString(),
      };

      if (existingSettingId) {
        // Update existing record
        const { data, error } = await supabase
          .from('agent_settings')
          .update(payload)
          .eq('id', existingSettingId)
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          console.log('Successfully updated agent settings:', data[0]);
          setExistingSettingId(data[0].id);
          setBusinessPhone(data[0].business_phone || '8302692120');
          setKnowledgeBase(data[0].knowledge_base || '');
        }
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('agent_settings')
          .insert([payload])
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          console.log('Successfully inserted agent settings:', data[0]);
          setExistingSettingId(data[0].id);
          setBusinessPhone(data[0].business_phone || '8302692120');
          setKnowledgeBase(data[0].knowledge_base || '');
        }
      }

      setSuccessMessage('Saved — your AI agent is now updated with this data.');

      setTimeout(() => {
        setSuccessMessage(null);
      }, 4500);
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

  // Speech Recognition Listener
  const startListening = (convId) => {
    if (!activeCallRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    // Stop any existing instance
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
      recognition.lang = 'en-IN';
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

        // 1. Add customer message to live transcript
        setTranscript((prev) => [
          ...prev,
          {
            id: `cust-${Date.now()}`,
            sender: 'customer',
            text: customerSpokenText,
            time: new Date(),
          },
        ]);

        // 2. Transition state to thinking
        setCallState('thinking');

        // 3. Invoke Supabase voice-chat-agent Edge Function
        try {
          const { data, error } = await supabase.functions.invoke('voice-chat-agent', {
            body: {
              conversation_id: convId || activeConvIdRef.current,
              customer_message: customerSpokenText,
            },
          });

          if (!activeCallRef.current) return;

          if (error) {
            console.error('voice-chat-agent error:', error);
          }

          const aiReply =
            data?.reply ||
            data?.message ||
            data?.ai_response ||
            data?.response ||
            'I have noted that down. Is there anything else I can help you with?';

          // 4. Add AI response to transcript and speak
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
          // Restart listening on silence/no-speech
          setTimeout(() => {
            if (activeCallRef.current && callState !== 'speaking' && callState !== 'thinking') {
              startListening(convId);
            }
          }, 300);
        }
      };

      recognition.onend = () => {
        if (activeCallRef.current && callState === 'listening') {
          // Silence timeout: re-arm listener
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

  // Speech Synthesis Speaker
  const speakAiResponse = (text, convId) => {
    if (!activeCallRef.current || typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      setCallState('speaking');

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
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

  // Start Voice Call Handler
  const handleStartCall = async () => {
    activeCallRef.current = true;
    setTranscript([]);
    setActiveConvId(null);
    setCallState('thinking');

    try {
      // 1. Initial invoke to create conversation and receive greeting
      const { data, error } = await supabase.functions.invoke('voice-chat-agent', {
        body: {
          conversation_id: null,
          customer_message: null,
        },
      });

      if (!activeCallRef.current) return;

      if (error) {
        console.error('Initial voice-chat-agent invoke error:', error);
      }

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
        'Hello! Thank you for calling. How can I assist you today?';

      // 2. Add greeting to transcript
      setTranscript([
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: greeting,
          time: new Date(),
        },
      ]);

      // 3. Speak greeting and start loop
      speakAiResponse(greeting, returnedConvId);
    } catch (err) {
      console.error('Failed to start voice call:', err);
      if (activeCallRef.current) {
        setCallState('idle');
        activeCallRef.current = false;
      }
    }
  };

  // End Voice Call Handler
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
    <div className="flex flex-col gap-8 max-w-5xl mx-auto animate-fadeIn font-sans selection:bg-[#0058be] selection:text-white pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5eeff]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
              Calling Agent Setup
            </h1>
            <Badge variant="accent" size="sm" className="font-semibold shadow-xs">
              Voice Calling — Coming Soon
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#45464d] leading-relaxed">
            Configure your business knowledge base and phone number to train the AI voice agent for inbound customer calls in English or Hindi.
          </p>
        </div>
      </div>

      {/* 2. Loading State on Initial Fetch */}
      {isLoading ? (
        <Card variant="default" className="p-12 text-center flex flex-col items-center justify-center gap-3 bg-white border-[#e5eeff] rounded-2xl shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-[#0058be]" />
          <p className="text-xs sm:text-sm text-[#76777d]">Loading agent settings from Supabase...</p>
        </Card>
      ) : (
        /* 3. Main Settings Form Card */
        <Card variant="default" className="bg-white border-[#e5eeff] shadow-[0_1px_3px_rgba(11,28,48,0.05)] rounded-2xl overflow-hidden">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e5eeff] p-5 sm:p-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center border border-[#d8e2ff]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-[#0b1c30]">
                  AI Voice Agent Knowledge & Routing
                </CardTitle>
                <CardDescription className="text-xs text-[#45464d]">
                  This raw context will be referenced by the AI during voice conversations.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 flex flex-col gap-6">
            {/* Inline Notifications */}
            {successMessage && (
              <div className="p-4 rounded-xl bg-[#e6fcf8] border border-[#89f5e7] text-[#005049] flex items-center gap-3 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-[#0c9488] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
              {/* Business Phone Number */}
              <div className="flex flex-col gap-1.5">
                <Input
                  label="Business Phone Number"
                  placeholder="+91 9413973399"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  startIcon={<Phone className="w-4 h-4 text-[#76777d]" />}
                  helperText="Customers will call this number and the AI will answer using the knowledge below."
                  size="md"
                  className="bg-white border-[#dce9ff]"
                />
                <p className="text-[11px] text-[#76777d]">
                  Customers will call this number and the AI will answer using the knowledge below.
                </p>
              </div>

              {/* Business Knowledge Base Textarea */}
              <div className="flex flex-col gap-1.5 font-sans">
                <label className="text-xs font-semibold text-[#0b1c30] select-none flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#0058be]" />
                    <span>Business Knowledge Base</span>
                  </span>
                  <span className="text-[11px] font-normal text-[#76777d]">
                    {knowledgeBase.length.toLocaleString()} characters
                  </span>
                </label>

                <textarea
                  rows={12}
                  value={knowledgeBase}
                  onChange={(e) => setKnowledgeBase(e.target.value)}
                  placeholder="Paste your business information here — services, pricing, FAQs, policies, working hours, anything the AI should know before talking to customers. You can paste text extracted from PDFs, Word docs, or just type directly."
                  className="w-full bg-[#f8f9ff] text-[#0b1c30] placeholder:text-[#76777d] border border-[#dce9ff] rounded-xl p-4 text-xs sm:text-sm leading-relaxed transition-all duration-200 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] min-h-[300px] resize-y"
                />

                <div className="flex items-center justify-between text-[11px] text-[#76777d] mt-1">
                  <span>Supports multiline text, FAQ pairs, pricing structures, and company guidelines.</span>
                  <span>{knowledgeBase.trim() ? `${knowledgeBase.trim().split(/\s+/).length} words` : '0 words'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#e5eeff] flex items-center justify-end gap-3">
                <Button
                  type="submit"
                  variant="accent"
                  size="md"
                  disabled={!knowledgeBase.trim() || isSaving}
                  isLoading={isSaving}
                  leftIcon={!isSaving && <Save className="w-4 h-4" />}
                  className="font-bold px-6 shadow-[0_4px_14px_rgba(0,88,190,0.25)]"
                >
                  {isSaving ? 'Saving Settings...' : 'Save Settings'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 4. Try It Now — Browser Speech Demo Card */}
      <Card variant="default" className="bg-white border-[#e5eeff] shadow-[0_2px_8px_rgba(11,28,48,0.04)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[#f8f9ff] border-b border-[#e5eeff] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center border border-[#d8e2ff]">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base font-bold text-[#0b1c30]">
                  Try It Now — Talk to Your AI Agent
                </CardTitle>
                <Badge variant="success" size="sm" dot pulse className="text-[10px]">
                  Web Voice Demo
                </Badge>
              </div>
              <CardDescription className="text-xs text-[#45464d] mt-0.5">
                Works best in Google Chrome. Click Start Call and allow microphone access when prompted.
              </CardDescription>
            </div>
          </div>

          {callState !== 'idle' && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleEndCall}
              leftIcon={<PhoneOff className="w-3.5 h-3.5" />}
              className="font-bold shrink-0 shadow-xs"
            >
              End Call
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-6 flex flex-col gap-6">
          {!speechSupported ? (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-2 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff]">
              <AlertCircle className="w-6 h-6 text-[#76777d]" />
              <p className="text-xs sm:text-sm font-semibold text-[#0b1c30]">
                Voice demo requires Google Chrome
              </p>
              <p className="text-xs text-[#76777d] max-w-sm">
                The Web Speech API is not supported in this browser. Please open this page in Google Chrome to test direct voice calling.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              {/* Large Interactive Call Button */}
              <div className="flex flex-col items-center justify-center gap-3">
                {callState === 'idle' && (
                  <button
                    type="button"
                    onClick={handleStartCall}
                    className="w-20 h-20 rounded-full bg-[#0058be] hover:bg-[#2170e4] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(0,88,190,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                    aria-label="Start Voice Call"
                  >
                    <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  </button>
                )}

                {callState === 'listening' && (
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-24 w-24 rounded-full bg-red-400 opacity-60" />
                    <button
                      type="button"
                      onClick={handleEndCall}
                      className="relative w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-[0_0_0_8px_rgba(239,68,68,0.25)] transition-all cursor-pointer"
                      aria-label="Listening to your voice. Click to end call."
                    >
                      <Mic className="w-8 h-8 animate-pulse" />
                    </button>
                  </div>
                )}

                {callState === 'thinking' && (
                  <div className="w-20 h-20 rounded-full bg-[#0058be] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(0,88,190,0.35)]">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                )}

                {callState === 'speaking' && (
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-24 w-24 rounded-full bg-[#0058be] opacity-50" />
                    <button
                      type="button"
                      onClick={handleEndCall}
                      className="relative w-20 h-20 rounded-full bg-[#0058be] text-white flex items-center justify-center shadow-[0_0_0_8px_rgba(0,88,190,0.25)] transition-all cursor-pointer"
                      aria-label="AI is speaking. Click to end call."
                    >
                      <Volume2 className="w-8 h-8 animate-bounce" />
                    </button>
                  </div>
                )}

                {/* State Label and Guidance */}
                <div className="text-center mt-2">
                  {callState === 'idle' && (
                    <>
                      <span className="font-heading font-bold text-sm text-[#0b1c30] block">
                        Start Call
                      </span>
                      <span className="text-xs text-[#76777d] mt-0.5 block">
                        Click to initiate interactive voice dialogue
                      </span>
                    </>
                  )}

                  {callState === 'listening' && (
                    <>
                      <span className="font-heading font-bold text-sm text-red-600 flex items-center justify-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                        Listening...
                      </span>
                      <span className="text-xs text-[#45464d] mt-0.5 block">
                        Speak clearly in English or Hindi
                      </span>
                    </>
                  )}

                  {callState === 'thinking' && (
                    <>
                      <span className="font-heading font-bold text-sm text-[#0058be] block">
                        Thinking...
                      </span>
                      <span className="text-xs text-[#76777d] mt-0.5 block">
                        AI voice model is analyzing your query
                      </span>
                    </>
                  )}

                  {callState === 'speaking' && (
                    <>
                      <span className="font-heading font-bold text-sm text-[#0058be] flex items-center justify-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#0058be]" />
                        Speaking...
                      </span>
                      <span className="text-xs text-[#45464d] mt-0.5 block">
                        Playing response via speaker audio
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Live Transcript Stream */}
              {transcript.length > 0 && (
                <div className="w-full mt-6 pt-6 border-t border-[#e5eeff] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#0058be]" />
                      <h4 className="font-heading font-bold text-xs text-[#0b1c30] uppercase tracking-wider">
                        Live Call Transcript
                      </h4>
                    </div>
                    <span className="text-[11px] text-[#76777d] font-mono">
                      {transcript.length} {transcript.length === 1 ? 'message' : 'messages'}
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto p-4 rounded-2xl bg-[#f8f9ff] border border-[#e5eeff] flex flex-col gap-3.5">
                    {transcript.map((item) => {
                      const isAi = item.sender === 'ai';

                      return (
                        <div
                          key={item.id}
                          className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                            isAi ? 'self-end flex-row-reverse' : 'self-start'
                          }`}
                        >
                          {/* Avatar */}
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-xs ${
                              isAi
                                ? 'bg-[#0058be] text-white'
                                : 'bg-white border border-[#dce9ff] text-[#0058be]'
                            }`}
                          >
                            {isAi ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                          </div>

                          {/* Bubble */}
                          <div className="flex flex-col gap-1">
                            <div
                              className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                                isAi
                                  ? 'bg-[#0058be] text-white rounded-tr-xs shadow-xs'
                                  : 'bg-white text-[#0b1c30] border border-[#e5eeff] rounded-tl-xs shadow-xs'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{item.text}</p>
                            </div>

                            <span
                              className={`text-[10px] text-[#76777d] font-mono flex items-center gap-1 ${
                                isAi ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              {formatDialogueTime(item.time)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={transcriptEndRef} />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. Muted Informational Roadmap Callout Card */}
      <div className="p-5 rounded-2xl bg-[#eff4ff]/70 border border-[#d8e2ff] flex items-start gap-3.5 text-xs text-[#004395]">
        <div className="p-2 rounded-xl bg-white text-[#0058be] border border-[#d8e2ff] shrink-0 shadow-xs">
          <Info className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-heading font-bold text-xs text-[#0b1c30] mb-0.5">
            Voice Agent Pipeline in Development
          </h4>
          <p className="text-[#45464d] leading-relaxed">
            Once connected, calls to this number will be answered by the AI using the knowledge base above — in English or Hindi depending on how the customer speaks. Voice call handling is being built next.
          </p>
        </div>
      </div>
    </div>
  );
}
