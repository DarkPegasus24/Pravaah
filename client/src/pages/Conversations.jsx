import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  User,
  MessageSquare,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Clock,
  Sparkles,
  Phone,
  Play,
  Pause,
  Volume2,
  Download,
  Radio,
  Smartphone,
  Plus,
  CheckCircle2,
  Share2,
  CheckCheck,
} from 'lucide-react';
import { Button, Input, Card, Badge, Modal } from '../components/ui';
import { supabase } from '../lib/supabaseClient';

const STARTER_TEMPLATES = [
  {
    id: 'tpl-1',
    name: 'Post-Call Demo Confirmation',
    content: 'Hi! Your Pravaah discovery demo is scheduled. Access your meeting room here: https://pravaah.ai/meet',
  },
  {
    id: 'tpl-2',
    name: 'Missed Call Recovery',
    content: 'Hi! Sorry we missed your call. We are available 24/7—reply here with what you need and our AI will assist you immediately!',
  },
  {
    id: 'tpl-3',
    name: '1-Hour Appointment Reminder',
    content: 'Reminder: Your consultation with Pravaah starts in 1 hour. Reply "1" to confirm or "2" to reschedule.',
  },
  {
    id: 'tpl-4',
    name: 'Platform Overview & Pricing',
    content: 'Hi! Here is the requested Pravaah platform overview & pricing sheet: https://pravaah.ai/pricing',
  },
];

export default function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState('all'); // 'all' | 'voice' | 'sms' | 'whatsapp' | 'web_chat'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'open' | 'completed' | 'qualified'
  const [inputMessage, setInputMessage] = useState('');
  const [mobileChatView, setMobileChatView] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Audio Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);

  // Outbound SMS/WhatsApp Modal State
  const [composeModalOpen, setComposeModalOpen] = useState(false);
  const [composeChannel, setComposeChannel] = useState('sms'); // 'sms' | 'whatsapp'
  const [composePhone, setComposePhone] = useState('');
  const [composeMessage, setComposeMessage] = useState('');
  const [composeSending, setComposeSending] = useState(false);
  const [composeSuccess, setComposeSuccess] = useState(null);

  const chatEndRef = useRef(null);

  // 1. Fetch conversations from Supabase on mount
  const fetchConversations = async () => {
    try {
      setIsLoadingConversations(true);
      setErrorMessage(null);

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setConversations(data);
        if (data.length > 0) {
          setSelectedId((prev) => (prev && data.some((c) => c.id === prev) ? prev : data[0].id));
        } else {
          setSelectedId(null);
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setErrorMessage(err.message || 'Failed to load conversations from Supabase.');
    } finally {
      setIsLoadingConversations(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // 2. Fetch messages for the selected conversation
  const fetchMessages = async (convId) => {
    if (!convId) {
      setMessages([]);
      return;
    }

    try {
      setIsLoadingMessages(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (selectedId) {
      fetchMessages(selectedId);
      setIsPlayingAudio(false);
      setAudioProgress(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } else {
      setMessages([]);
    }
  }, [selectedId]);

  // 3. Realtime subscription to messages for the selected conversation
  useEffect(() => {
    if (!selectedId) return;

    const channel = supabase
      .channel(`realtime:messages:${selectedId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedId}`,
        },
        (payload) => {
          if (payload?.new) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedId]);

  // Auto-scroll chat to bottom when messages update
  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const activeConversation = conversations.find((c) => c.id === selectedId) || null;

  const handleSelectConversation = (id) => {
    setSelectedId(id);
    setMobileChatView(true);
  };

  // Audio Playback Handlers
  const handleTogglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch((err) => {
        console.warn('Audio play error:', err);
        setIsPlayingAudio(true);
      });
    }
  };

  const handleAudioTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 1;
    setAudioProgress((current / dur) * 100);
  };

  const handleAudioSeek = (e) => {
    if (!audioRef.current) return;
    const seekPercent = parseFloat(e.target.value);
    const dur = audioRef.current.duration || 1;
    audioRef.current.currentTime = (seekPercent / 100) * dur;
    setAudioProgress(seekPercent);
  };

  const handleTogglePlaybackRate = () => {
    if (!audioRef.current) return;
    const rates = [1, 1.25, 1.5, 2];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    audioRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  // Send Message handler
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || !selectedId || isSending) return;

    const textToSend = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    try {
      const channel = activeConversation?.channel;

      if (channel === 'sms' || channel === 'whatsapp') {
        // Direct database insert
        await supabase.from('messages').insert([
          {
            conversation_id: selectedId,
            sender: 'ai',
            content: textToSend,
            created_at: new Date().toISOString(),
          },
        ]);
      } else {
        const { error } = await supabase.functions.invoke('ai-agent', {
          body: {
            conversation_id: selectedId,
            customer_message: textToSend,
          },
        });

        if (error) {
          console.error('Edge Function error:', error);
        }
      }

      await fetchMessages(selectedId);
      await fetchConversations();
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Outbound Dispatch Handler
  const handleSendCompose = async (e) => {
    e?.preventDefault();
    if (!composePhone.trim() || !composeMessage.trim() || composeSending) return;

    try {
      setComposeSending(true);

      const targetChannel = composeChannel || 'sms';

      const { data: convData, error: convErr } = await supabase
        .from('conversations')
        .insert([
          {
            customer_name: targetChannel === 'whatsapp' ? `WhatsApp (${composePhone.trim()})` : `SMS (${composePhone.trim()})`,
            customer_contact: composePhone.trim(),
            caller_number: composePhone.trim(),
            channel: targetChannel,
            status: 'open',
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (convErr) throw convErr;

      const newConvId = convData.id;

      await supabase.from('messages').insert([
        {
          conversation_id: newConvId,
          sender: 'ai',
          content: composeMessage.trim(),
          created_at: new Date().toISOString(),
        },
      ]);

      setComposeSuccess(`${targetChannel.toUpperCase()} dispatched successfully to ${composePhone}!`);
      setTimeout(() => {
        setComposeSuccess(null);
        setComposeModalOpen(false);
        setComposePhone('');
        setComposeMessage('');
        fetchConversations();
        setSelectedId(newConvId);
      }, 1200);
    } catch (err) {
      console.error('Error dispatching message:', err);
      alert(err.message || 'Failed to dispatch message.');
    } finally {
      setComposeSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return '1m 24s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      c.customer_name?.toLowerCase().includes(query) ||
      c.customer_contact?.toLowerCase().includes(query) ||
      c.caller_number?.toLowerCase().includes(query) ||
      c.status?.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    // Channel filter
    const channel = c.channel || 'web_chat';
    if (filterChannel === 'voice' && channel !== 'voice') return false;
    if (filterChannel === 'sms' && channel !== 'sms') return false;
    if (filterChannel === 'whatsapp' && channel !== 'whatsapp') return false;
    if (filterChannel === 'web_chat' && channel !== 'web_chat') return false;

    // Status filter
    if (filterStatus === 'all') return true;
    if (filterStatus === 'open') return c.status?.toLowerCase().includes('open');
    if (filterStatus === 'completed') return c.status?.toLowerCase().includes('complete') || c.call_status === 'completed';
    if (filterStatus === 'qualified') return c.status?.toLowerCase().includes('qualif');
    return true;
  });

  return (
    <div className="h-[calc(100vh-9rem)] md:h-[calc(100vh-8.5rem)] min-h-[580px] flex flex-col gap-4 animate-fadeIn font-sans bg-[#f8f9ff] text-[#0b1c30]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#0b1c30] tracking-tight flex items-center gap-2.5">
            <span>Conversations & Telephony Hub</span>
            <Badge variant="accent" size="sm">
              {conversations.length} Active {conversations.length === 1 ? 'Record' : 'Records'}
            </Badge>
          </h1>
          <p className="text-xs text-[#45464d]">
            Omnichannel customer inquiries from Voice Calls, WhatsApp, SMS Texts, and Web Chat.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Channel Filter Selector */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#dce9ff] shadow-xs">
            {[
              { id: 'all', label: 'All', icon: Radio },
              { id: 'voice', label: 'Calls', icon: Phone },
              { id: 'whatsapp', label: 'WhatsApp', icon: Share2 },
              { id: 'sms', label: 'SMS Texts', icon: Smartphone },
              { id: 'web_chat', label: 'Web Chat', icon: MessageSquare },
            ].map((item) => {
              const IconComp = item.icon;
              const isSelected = filterChannel === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setFilterChannel(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? item.id === 'whatsapp'
                        ? 'bg-[#25D366] text-white shadow-xs'
                        : 'bg-[#0058be] text-white shadow-xs'
                      : 'text-[#45464d] hover:text-[#0058be] hover:bg-[#eff4ff]'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* New Outbound Message Button */}
          <Button
            variant="accent"
            size="sm"
            onClick={() => setComposeModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="font-bold text-xs rounded-xl shadow-xs"
          >
            New Message
          </Button>
        </div>
      </div>

      {/* Main Dual-Panel Container */}
      <Card
        variant="default"
        className="flex-1 min-h-0 border-[#e5eeff] overflow-hidden flex flex-col md:flex-row shadow-[0_1px_3px_rgba(11,28,48,0.05)] bg-white rounded-2xl"
      >
        {/* ================= LEFT PANEL: CONVERSATIONS LIST ================= */}
        <div
          className={`w-full md:w-80 lg:w-88 border-r border-[#e5eeff] flex flex-col bg-white shrink-0 ${
            mobileChatView ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search Bar */}
          <div className="p-3.5 border-b border-[#e5eeff] flex flex-col gap-2.5 bg-[#f8f9ff]">
            <Input
              placeholder="Search customer, phone, status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="sm"
              startIcon={<Search className="w-4 h-4 text-[#76777d]" />}
              className="bg-white border-[#dce9ff]"
            />

            {/* Quick Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'open', label: 'Open' },
                { id: 'completed', label: 'Completed' },
                { id: 'qualified', label: 'Qualified' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setFilterStatus(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                    filterStatus === st.id
                      ? 'bg-[#0058be] text-white shadow-xs'
                      : 'bg-white text-[#45464d] hover:text-[#0058be] border border-[#dce9ff]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#e5eeff] flex flex-col">
            {isLoadingConversations ? (
              <div className="p-10 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-[#0058be]" />
                <p className="text-xs text-[#76777d]">Loading conversations...</p>
              </div>
            ) : errorMessage ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
                <Button variant="secondary" size="sm" onClick={fetchConversations} className="mt-2 text-xs">
                  Retry
                </Button>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center border border-[#d8e2ff]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-[#0b1c30]">No records found</h3>
                  <p className="text-xs text-[#76777d] mt-1">
                    {searchQuery ? 'Try matching a different phone or name.' : 'Inbound calls, SMS, and WhatsApp chats will appear here.'}
                  </p>
                </div>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedId;
                const isVoice = conv.channel === 'voice';
                const isSMS = conv.channel === 'sms';
                const isWhatsApp = conv.channel === 'whatsapp';

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`p-4 transition-all cursor-pointer flex items-start gap-3 relative ${
                      isSelected
                        ? isWhatsApp
                          ? 'bg-[#f0fdf4] border-l-4 border-[#25D366]'
                          : 'bg-[#eff4ff] border-l-4 border-[#0058be]'
                        : 'hover:bg-[#f8f9ff]'
                    }`}
                  >
                    {/* Channel / User Avatar */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-colors ${
                        isVoice
                          ? isSelected
                            ? 'bg-[#0058be] text-[#89f5e7]'
                            : 'bg-[#eff4ff] text-[#0058be] border border-[#d8e2ff]'
                          : isWhatsApp
                          ? isSelected
                            ? 'bg-[#25D366] text-white'
                            : 'bg-[#dcf8c6] text-[#128c7e] border border-[#bbf7d0]'
                          : isSMS
                          ? isSelected
                            ? 'bg-[#0c9488] text-white'
                            : 'bg-[#e6fcf8] text-[#0c9488] border border-[#89f5e7]'
                          : isSelected
                          ? 'bg-[#0058be] text-white'
                          : 'bg-[#eff4ff] text-[#004395] border border-[#d8e2ff]'
                      }`}
                    >
                      {isVoice ? (
                        <Phone className="w-4.5 h-4.5" />
                      ) : isWhatsApp ? (
                        <Share2 className="w-4.5 h-4.5" />
                      ) : isSMS ? (
                        <Smartphone className="w-4.5 h-4.5" />
                      ) : (
                        <User className="w-4.5 h-4.5" />
                      )}
                    </div>

                    {/* Content Preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-heading font-bold text-xs text-[#0b1c30] truncate">
                          {conv.customer_name ||
                            (isVoice
                              ? `Caller (${conv.caller_number || conv.customer_contact || 'Inbound'})`
                              : isWhatsApp
                              ? `WhatsApp (${conv.customer_contact || 'Contact'})`
                              : isSMS
                              ? `SMS (${conv.customer_contact || 'Contact'})`
                              : 'Customer Inquiry')}
                        </span>
                        <span className="text-[10px] text-[#76777d] font-mono shrink-0">
                          {formatTime(conv.updated_at || conv.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-[#76777d] mb-1.5">
                        <span className="truncate">
                          {conv.customer_contact || conv.caller_number || (isVoice ? 'Voice Line' : isWhatsApp ? 'WhatsApp Inbound' : isSMS ? 'Inbound SMS' : 'Web Chat')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        {isVoice ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#e6fcf8] text-[#005049] border border-[#89f5e7] flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#0c9488]" />
                              {formatDuration(conv.call_duration)}
                            </span>
                          </div>
                        ) : isWhatsApp ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#dcf8c6] text-[#166534] border border-[#bbf7d0] flex items-center gap-1">
                            <Share2 className="w-3 h-3 text-[#16a34a]" />
                            WhatsApp
                          </span>
                        ) : isSMS ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#eff4ff] text-[#0058be] border border-[#d8e2ff] flex items-center gap-1">
                            <Smartphone className="w-3 h-3 text-[#0058be]" />
                            SMS Two-Way
                          </span>
                        ) : (
                          <Badge variant="secondary" size="sm" className="text-[9px] bg-white border-[#d8e2ff] text-[#004395]">
                            {conv.status || 'Active'}
                          </Badge>
                        )}

                        {conv.call_status && isVoice && (
                          <span className="text-[10px] font-medium text-[#76777d] capitalize">
                            {conv.call_status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= RIGHT PANEL: CHAT, WHATSAPP & VOICE CALL DETAILS ================= */}
        <div
          className={`flex-1 flex flex-col bg-white min-w-0 ${
            !mobileChatView ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversation ? (
            <>
              {/* Top Details Bar */}
              <div
                className={`p-4 sm:px-6 border-b border-[#e5eeff] flex flex-col gap-3 shrink-0 ${
                  activeConversation.channel === 'whatsapp' ? 'bg-[#f0fdf4]' : 'bg-[#f8f9ff]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => setMobileChatView(false)}
                      className="md:hidden p-1.5 rounded-lg bg-white border border-[#dce9ff] text-[#45464d] hover:text-[#0b1c30]"
                      aria-label="Back to list"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                        activeConversation.channel === 'voice'
                          ? 'bg-[#0b1c30] text-[#89f5e7]'
                          : activeConversation.channel === 'whatsapp'
                          ? 'bg-[#25D366] text-white'
                          : activeConversation.channel === 'sms'
                          ? 'bg-[#0c9488] text-white'
                          : 'bg-[#0058be] text-white'
                      }`}
                    >
                      {activeConversation.channel === 'voice' ? (
                        <Phone className="w-4.5 h-4.5" />
                      ) : activeConversation.channel === 'whatsapp' ? (
                        <Share2 className="w-4.5 h-4.5" />
                      ) : activeConversation.channel === 'sms' ? (
                        <Smartphone className="w-4.5 h-4.5" />
                      ) : (
                        <User className="w-4.5 h-4.5 text-white" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-heading font-bold text-sm text-[#0b1c30] truncate">
                          {activeConversation.customer_name ||
                            (activeConversation.channel === 'voice'
                              ? `Caller ${activeConversation.caller_number || activeConversation.customer_contact || ''}`
                              : activeConversation.channel === 'whatsapp'
                              ? `WhatsApp Contact ${activeConversation.customer_contact || ''}`
                              : activeConversation.channel === 'sms'
                              ? `SMS Contact ${activeConversation.customer_contact || ''}`
                              : 'Customer Inquiry')}
                        </h2>
                        {activeConversation.channel === 'voice' ? (
                          <Badge variant="success" size="sm" className="text-[10px]">
                            Voice Call Record
                          </Badge>
                        ) : activeConversation.channel === 'whatsapp' ? (
                          <Badge variant="success" size="sm" className="text-[10px] bg-[#25D366]/20 text-[#166534] border-[#25D366]/40">
                            WhatsApp Verified
                          </Badge>
                        ) : activeConversation.channel === 'sms' ? (
                          <Badge variant="accent" size="sm" className="text-[10px]">
                            SMS Two-Way Thread
                          </Badge>
                        ) : (
                          <Badge variant="secondary" size="sm" className="text-[10px]">
                            {activeConversation.status || 'Open'}
                          </Badge>
                        )}
                      </div>

                      <p className="text-[11px] text-[#76777d] truncate">
                        {activeConversation.customer_contact || activeConversation.caller_number || 'Omnichannel Inbound'}
                      </p>
                    </div>
                  </div>

                  {activeConversation.channel === 'voice' && (
                    <div className="flex items-center gap-2 text-xs font-mono text-[#0058be] font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDuration(activeConversation.call_duration)}</span>
                    </div>
                  )}
                </div>

                {/* Voice Call Audio Player Bar */}
                {activeConversation.channel === 'voice' && (
                  <div className="p-3.5 rounded-xl bg-white border border-[#dce9ff] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <audio
                      ref={audioRef}
                      src={activeConversation.recording_url || 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg'}
                      onTimeUpdate={handleAudioTimeUpdate}
                      onEnded={() => setIsPlayingAudio(false)}
                      preload="metadata"
                      className="hidden"
                    />

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleTogglePlayAudio}
                        className="w-8 h-8 rounded-full bg-[#0058be] hover:bg-[#2170e4] text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
                      >
                        {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>

                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-[#0058be]" />
                          <span>Call Audio Recording</span>
                        </span>
                        <span className="text-[10px] text-[#76777d]">
                          {isPlayingAudio ? 'Playing call audio...' : 'Click play to listen to caller audio'}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 w-full flex items-center gap-2 px-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={audioProgress}
                        onChange={handleAudioSeek}
                        className="w-full accent-[#0058be] h-1.5 bg-[#eff4ff] rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleTogglePlaybackRate}
                        className="px-2 py-1 rounded-md bg-[#eff4ff] hover:bg-[#d8e2ff] text-[#004395] text-[11px] font-bold border border-[#d8e2ff] cursor-pointer"
                      >
                        {playbackRate}x
                      </button>

                      {activeConversation.recording_url && (
                        <a
                          href={activeConversation.recording_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="p-1.5 rounded-md bg-white border border-[#dce9ff] text-[#45464d] hover:text-[#0058be] cursor-pointer"
                          title="Download Audio"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Message / Dialogue History Feed */}
              <div
                className={`flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 ${
                  activeConversation.channel === 'whatsapp' ? 'bg-[#efeae2]/30' : 'bg-[#f8f9ff]/40'
                }`}
              >
                {isLoadingMessages ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#0058be]" />
                    <p className="text-xs text-[#76777d]">Loading conversation messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                        activeConversation.channel === 'whatsapp'
                          ? 'bg-[#dcf8c6] text-[#128c7e] border-[#bbf7d0]'
                          : 'bg-[#eff4ff] text-[#0058be] border-[#d8e2ff]'
                      }`}
                    >
                      {activeConversation.channel === 'whatsapp' ? (
                        <Share2 className="w-6 h-6" />
                      ) : activeConversation.channel === 'sms' ? (
                        <Smartphone className="w-6 h-6" />
                      ) : (
                        <MessageSquare className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-[#0b1c30]">No messages recorded yet</h3>
                      <p className="text-xs text-[#76777d] mt-1">
                        {activeConversation.channel === 'whatsapp'
                          ? 'Type a WhatsApp message below to chat with this customer.'
                          : activeConversation.channel === 'sms'
                          ? 'Send an SMS reply below to message this customer.'
                          : 'Send a message below to test the AI agent response.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isAI =
                      msg.sender === 'ai' ||
                      msg.sender === 'assistant' ||
                      msg.sender_type === 'business';

                    const isWhatsApp = activeConversation.channel === 'whatsapp';

                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                          isAI ? 'self-end flex-row-reverse' : 'self-start'
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                            isAI
                              ? isWhatsApp
                                ? 'bg-[#25D366] text-white shadow-xs'
                                : activeConversation.channel === 'sms'
                                ? 'bg-[#0c9488] text-white shadow-xs'
                                : 'bg-[#0058be] text-white shadow-xs'
                              : 'bg-white border border-[#dce9ff] text-[#0058be]'
                          }`}
                        >
                          {isAI ? (
                            isWhatsApp ? (
                              <Share2 className="w-3.5 h-3.5" />
                            ) : activeConversation.channel === 'sms' ? (
                              <Smartphone className="w-3.5 h-3.5" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5" />
                            )
                          ) : (
                            <User className="w-3.5 h-3.5" />
                          )}
                        </div>

                        {/* Speech Bubble */}
                        <div className="flex flex-col gap-1">
                          <div
                            className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                              isAI
                                ? isWhatsApp
                                  ? 'bg-[#dcf8c6] text-[#0b1c30] rounded-tr-xs border border-[#c3e6b5]'
                                  : activeConversation.channel === 'sms'
                                  ? 'bg-[#0c9488] text-white rounded-tr-xs'
                                  : 'bg-[#0058be] text-white rounded-tr-xs'
                                : 'bg-white text-[#0b1c30] border border-[#e5eeff] rounded-tl-xs'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content || msg.text}</p>
                          </div>

                          <span
                            className={`text-[10px] text-[#76777d] font-mono flex items-center gap-1 ${
                              isAI ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {isWhatsApp ? (
                              <CheckCheck className="w-3 h-3 text-[#34b7f1]" />
                            ) : (
                              <Clock className="w-2.5 h-2.5" />
                            )}
                            <span>
                              {isAI
                                ? isWhatsApp
                                  ? 'Pravaah WhatsApp AI'
                                  : activeConversation.channel === 'sms'
                                  ? 'Pravaah SMS Auto-Pilot'
                                  : 'Pravaah AI'
                                : isWhatsApp
                                ? 'WhatsApp Customer'
                                : activeConversation.channel === 'voice'
                                ? 'Caller'
                                : 'Customer'}
                            </span>
                            <span>•</span>
                            <span>{formatTime(msg.created_at)}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 border-t border-[#e5eeff] bg-white flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  placeholder={
                    activeConversation.channel === 'whatsapp'
                      ? 'Type a WhatsApp reply to customer...'
                      : activeConversation.channel === 'sms'
                      ? 'Type an SMS text reply to customer...'
                      : 'Type a message to test the AI agent response...'
                  }
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isSending}
                  className="flex-1 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl px-3.5 py-2.5 text-xs text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] disabled:opacity-60"
                />

                <Button
                  type="submit"
                  variant="accent"
                  size="sm"
                  disabled={!inputMessage.trim() || isSending}
                  rightIcon={isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  className={`font-bold px-4 py-2.5 ${
                    activeConversation.channel === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#20bd5a] text-white' : ''
                  }`}
                >
                  {isSending
                    ? 'Sending...'
                    : activeConversation.channel === 'whatsapp'
                    ? 'Send WhatsApp'
                    : activeConversation.channel === 'sms'
                    ? 'Send SMS'
                    : 'Send'}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center border border-[#d8e2ff] mb-3">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-sm text-[#0b1c30]">Select a conversation or channel</h3>
              <p className="text-xs text-[#76777d] mt-1 max-w-xs">
                Choose an inquiry from the left panel to inspect message history, listen to voice recordings, or reply via WhatsApp or SMS.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Outbound Message Composer Modal */}
      <Modal
        isOpen={composeModalOpen}
        onClose={() => setComposeModalOpen(false)}
        title="Compose New Outbound Message"
        description="Send an instant text or WhatsApp message directly to a customer phone number."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSendCompose} className="flex flex-col gap-4 font-sans text-xs">
          {composeSuccess && (
            <div className="p-3 rounded-xl bg-[#e6fcf8] border border-[#89f5e7] text-[#005049] flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#0c9488]" />
              <span>{composeSuccess}</span>
            </div>
          )}

          {/* Channel Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-[#0b1c30]">Delivery Channel</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setComposeChannel('whatsapp')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all cursor-pointer ${
                  composeChannel === 'whatsapp'
                    ? 'bg-[#dcf8c6] border-[#25D366] text-[#14532d] shadow-xs'
                    : 'bg-white border-[#dce9ff] text-[#45464d] hover:border-[#25D366]'
                }`}
              >
                <Share2 className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp Message</span>
              </button>

              <button
                type="button"
                onClick={() => setComposeChannel('sms')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all cursor-pointer ${
                  composeChannel === 'sms'
                    ? 'bg-[#eff4ff] border-[#0058be] text-[#004395] shadow-xs'
                    : 'bg-white border-[#dce9ff] text-[#45464d] hover:border-[#0058be]'
                }`}
              >
                <Smartphone className="w-4 h-4 text-[#0058be]" />
                <span>SMS Text Message</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-[#0b1c30]">Recipient Phone Number</label>
            <Input
              placeholder="+1 8302692120 or +91 9413973399"
              value={composePhone}
              onChange={(e) => setComposePhone(e.target.value)}
              startIcon={<Smartphone className="w-4 h-4 text-[#76777d]" />}
              size="sm"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#0b1c30]">Quick Message Templates</label>
              <span className="text-[10px] text-[#76777d]">Click to insert</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {STARTER_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setComposeMessage(tpl.content)}
                  className="p-2 rounded-lg bg-[#f8f9ff] hover:bg-[#eff4ff] text-left border border-[#dce9ff] text-[11px] text-[#0b1c30] font-medium transition-colors truncate cursor-pointer"
                  title={tpl.content}
                >
                  <span className="truncate block font-semibold text-[#0058be]">{tpl.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#0b1c30]">Message Content</label>
              <span className="text-[11px] text-[#76777d]">{composeMessage.length} characters</span>
            </div>
            <textarea
              rows={4}
              value={composeMessage}
              onChange={(e) => setComposeMessage(e.target.value)}
              placeholder={`Type your ${composeChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'} message...`}
              className="w-full bg-[#f8f9ff] text-[#0b1c30] p-3 rounded-xl border border-[#dce9ff] focus:outline-none focus:border-[#0058be]"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e5eeff]">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setComposeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              size="sm"
              type="submit"
              disabled={!composePhone.trim() || !composeMessage.trim() || composeSending}
              leftIcon={composeSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              className={composeChannel === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#20bd5a] text-white' : ''}
            >
              {composeSending
                ? 'Dispatching...'
                : composeChannel === 'whatsapp'
                ? 'Send WhatsApp'
                : 'Send SMS'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
