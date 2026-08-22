import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  Send,
  Smartphone,
  Globe,
  MessageSquare,
  Paperclip,
  CheckCheck,
  Building2,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button, Input, Card, Badge } from '../components/ui';
import { supabase } from '../lib/supabaseClient';

export default function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [inputMessage, setInputMessage] = useState('');
  const [mobileChatView, setMobileChatView] = useState(false);

  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [conversationsError, setConversationsError] = useState(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const chatEndRef = useRef(null);

  // Fetch all conversations from Supabase
  const fetchConversations = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setIsLoadingConversations(true);
    }
    setConversationsError(null);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map((conv) => ({
        id: conv.id,
        name: conv.customer_name || 'Customer',
        customer_name: conv.customer_name,
        customer_contact: conv.customer_contact,
        company: conv.company || conv.customer_contact || 'Direct Inquiry',
        status: conv.status || 'Open',
        channel: conv.channel || 'Direct Web',
        channelType: conv.channel_type || 'web',
        updated_at: conv.updated_at,
        created_at: conv.created_at,
        unreadCount: 0,
        avatar: conv.customer_name ? conv.customer_name.slice(0, 2).toUpperCase() : 'CU',
      }));

      setConversations(formatted);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setConversationsError('Failed to load conversations');
    } finally {
      if (isInitial) {
        setIsLoadingConversations(false);
      }
    }
  }, []);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations(true);
  }, [fetchConversations]);

  const activeConversation =
    conversations.find((c) => c.id === selectedId) || null;

  // Scroll chat to bottom when messages update
  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load messages helper
  const loadMessages = useCallback(async (convId, showSpinner = false) => {
    if (!convId) {
      setMessages([]);
      return [];
    }

    if (showSpinner) {
      setIsLoadingMessages(true);
    }
    setMessagesError(null);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      return data || [];
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessagesError('Failed to load messages');
      return [];
    } finally {
      if (showSpinner) {
        setIsLoadingMessages(false);
      }
    }
  }, []);

  // Fetch messages and subscribe to realtime updates when selectedId changes
  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    loadMessages(selectedId, true);

    // Subscribe to realtime postgres_changes for this conversation's messages
    const channelName = `messages:conv:${selectedId}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedId}`,
        },
        (payload) => {
          if (payload.new && isMounted) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === payload.new.id)) {
                return prev;
              }
              return [...prev, payload.new];
            });
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [selectedId, loadMessages]);

  const handleSelectConversation = (id) => {
    setSelectedId(id);
    setMobileChatView(true);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const textToSend = inputMessage.trim();
    if (!textToSend || !selectedId || isSending) return;

    setIsSending(true);
    setMessagesError(null);
    setInputMessage('');

    try {
      // Step a: Invoke deployed Supabase Edge Function 'ai-agent'
      const { error: fnError } = await supabase.functions.invoke('ai-agent', {
        body: {
          conversation_id: selectedId,
          customer_message: textToSend,
        },
      });

      if (fnError) {
        throw fnError;
      }

      // Step b: Refetch messages so both the customer message and AI business reply appear
      await loadMessages(selectedId, false);

      // Update conversations list timestamps
      await fetchConversations(false);
    } catch (err) {
      console.error('Error sending message:', err);
      setMessagesError(err.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customer_contact?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'booked') return matchesSearch && c.status?.toLowerCase() === 'booked';
    if (filterStatus === 'qualified') return matchesSearch && c.status?.toLowerCase() === 'qualified';
    return matchesSearch;
  });

  const getChannelIcon = (type) => {
    switch (type) {
      case 'whatsapp':
        return <Smartphone className="w-3.5 h-3.5 text-black" />;
      case 'web':
        return <Globe className="w-3.5 h-3.5 text-black" />;
      case 'sms':
        return <MessageSquare className="w-3.5 h-3.5 text-neutral-600" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-black" />;
    }
  };

  return (
    <div className="h-[calc(100vh-9rem)] md:h-[calc(100vh-8.5rem)] min-h-[520px] flex flex-col gap-4 animate-fadeIn bg-white text-black">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-black tracking-tight flex items-center gap-2">
            <span>Conversations</span>
            <Badge variant="primary" size="sm">
              {conversations.length} Threads
            </Badge>
          </h1>
          <p className="text-xs text-neutral-600">
            Live omnichannel chats managed autonomously by PRAVAAH AI.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Badge variant="secondary" dot pulse size="sm">
            AI Monitoring Ready
          </Badge>
        </div>
      </div>

      {/* Main Two-Panel Card Container */}
      <Card
        variant="default"
        className="flex-1 min-h-0 border-neutral-200 overflow-hidden flex flex-col md:flex-row shadow-sm bg-white"
      >
        {/* ================= LEFT PANEL: CONVERSATIONS LIST ================= */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-neutral-200 flex flex-col bg-white shrink-0 ${
            mobileChatView ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search and Filters */}
          <div className="p-3.5 border-b border-neutral-200 flex flex-col gap-2.5 bg-neutral-50">
            <Input
              placeholder="Search leads, contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="sm"
              startIcon={<Search className="w-4 h-4 text-neutral-400" />}
              className="bg-white"
            />

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-black text-white font-semibold'
                    : 'bg-white text-neutral-700 hover:text-black border border-neutral-200'
                }`}
              >
                All ({conversations.length})
              </button>
              <button
                onClick={() => setFilterStatus('booked')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filterStatus === 'booked'
                    ? 'bg-black text-white font-semibold'
                    : 'bg-white text-neutral-700 hover:text-black border border-neutral-200'
                }`}
              >
                Booked
              </button>
              <button
                onClick={() => setFilterStatus('qualified')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filterStatus === 'qualified'
                    ? 'bg-black text-white font-semibold'
                    : 'bg-white text-neutral-700 hover:text-black border border-neutral-200'
                }`}
              >
                Qualified
              </button>
            </div>
          </div>

          {/* Inline Error Notice */}
          {conversationsError && (
            <div className="p-2.5 bg-red-50 border-b border-red-200 flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{conversationsError}</span>
            </div>
          )}

          {/* Scrollable Conversation List / Empty State / Loading State */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 flex flex-col">
            {isLoadingConversations ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                <span className="text-xs text-neutral-500">Loading conversations...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-black">No conversations yet</span>
                <p className="text-[11px] text-neutral-500 max-w-[200px]">
                  Incoming chats from WhatsApp, Web, and SMS will appear here in real time.
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedId;
                const formattedTime = conv.updated_at
                  ? new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'Recent';

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`p-3.5 transition-all cursor-pointer flex items-start gap-3 relative group ${
                      isSelected
                        ? 'bg-neutral-100 border-l-2 border-black'
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-xs text-black shrink-0 group-hover:border-black transition-colors">
                      {conv.avatar || 'CU'}
                    </div>

                    {/* Content preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className={`font-semibold text-xs truncate ${
                            isSelected ? 'text-black font-bold' : 'text-black'
                          }`}
                        >
                          {conv.name}
                        </span>
                        <span className="text-[10px] text-neutral-500 shrink-0">
                          {formattedTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-1">
                        <span className="truncate">{conv.company || 'Direct Inquiry'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {getChannelIcon(conv.channelType)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {conv.status && (
                          <Badge variant="secondary" size="sm">
                            {conv.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= RIGHT PANEL: CHAT THREAD & INPUT ================= */}
        <div
          className={`flex-1 flex flex-col bg-white min-w-0 ${
            !mobileChatView ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="h-16 px-4 sm:px-6 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Back button for mobile */}
                  <button
                    onClick={() => setMobileChatView(false)}
                    className="md:hidden p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:text-black cursor-pointer"
                    aria-label="Back to conversations list"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    {activeConversation.avatar || 'CU'}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading font-semibold text-sm text-black truncate">
                        {activeConversation.name}
                      </h2>
                      {activeConversation.status && (
                        <Badge variant="secondary" size="sm">
                          {activeConversation.status}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 truncate">
                      {activeConversation.company && (
                        <>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                            {activeConversation.company}
                          </span>
                          <span>•</span>
                        </>
                      )}
                      <span className="flex items-center gap-1">
                        {getChannelIcon(activeConversation.channelType)}
                        {activeConversation.channel || 'Chat'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* TODO: re-enable when building this feature
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={toggleAutopilot}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      activeConversation.autopilotEnabled
                        ? 'bg-black border-black text-white'
                        : 'bg-white border-neutral-300 text-neutral-700 hover:text-black'
                    }`}
                    title="Toggle AI Autopilot"
                  >
                    <Zap
                      className={`w-3.5 h-3.5 ${
                        activeConversation.autopilotEnabled
                          ? 'text-white animate-pulse'
                          : 'text-neutral-400'
                      }`}
                    />
                    <span className="hidden sm:inline">
                      {activeConversation.autopilotEnabled
                        ? 'AI Autopilot: ON'
                        : 'Manual Mode'}
                    </span>
                  </button>
                </div>
                */}
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 bg-white">
                <div className="text-center my-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] text-neutral-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-black" />
                    Verified Inbound Lead via {activeConversation.channel || 'Direct'}
                  </span>
                </div>

                {/* Inline Error Notice for Messages */}
                {messagesError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{messagesError}</span>
                  </div>
                )}

                {isLoadingMessages ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                    <span className="text-xs text-neutral-500">Loading messages...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-2">
                    <span className="text-xs text-neutral-400">No messages in this conversation yet.</span>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isCustomer = msg.sender_type === 'customer';
                    const timeString = msg.created_at
                      ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Now';

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
                          isCustomer ? 'self-start' : 'self-end items-end'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-neutral-500">
                          {isCustomer ? (
                            <span className="font-semibold text-black">
                              {activeConversation.name}
                            </span>
                          ) : (
                            <span className="text-black font-semibold">
                              PRAVAAH
                            </span>
                          )}
                          <span>•</span>
                          <span>{timeString}</span>
                        </div>

                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isCustomer
                              ? 'bg-neutral-100 text-black border border-neutral-200 rounded-tl-sm shadow-xs'
                              : 'bg-black text-white font-medium rounded-tr-sm shadow-md'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>

                        {!isCustomer && (
                          <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-neutral-500">
                            <CheckCheck className="w-3 h-3 text-black" />
                            <span>Delivered</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* TODO: re-enable when building this feature
              <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200 flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-semibold uppercase text-black shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-black" /> Quick AI Reply:
                </span>
                <button
                  onClick={() =>
                    handleSendQuickReply(
                      'Here is the link to our self-serve calendar: https://pravaah.ai/book/demo'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-300 text-[11px] text-neutral-800 hover:text-black transition-colors whitespace-nowrap cursor-pointer"
                >
                  📅 Propose Calendar Link
                </button>
                <button
                  onClick={() =>
                    handleSendQuickReply(
                      'I have attached our complete pricing tier breakdown for review.'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-300 text-[11px] text-neutral-800 hover:text-black transition-colors whitespace-nowrap cursor-pointer"
                >
                  📄 Send Pricing Sheet
                </button>
              </div>
              */}

              {/* Message Input Box Footer */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 bg-neutral-50 border-t border-neutral-200 flex items-center gap-2 shrink-0"
              >
                <button
                  type="button"
                  className="p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-neutral-200"
                  title="Attach File"
                  aria-label="Attach File"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={`Reply to ${activeConversation.name}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isSending}
                  className="flex-1 bg-white text-black placeholder:text-neutral-400 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-black focus:outline-none transition-colors disabled:opacity-60"
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!inputMessage.trim() || isSending}
                  className="px-4 py-2 shrink-0"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </>
          ) : (
            /* Empty Right Panel: Nothing selected */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3 bg-neutral-50/50">
              <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-black">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-heading font-semibold text-sm text-black">
                  No conversation selected
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                  Select a conversation from the left panel or wait for incoming messages to view the live chat thread.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

