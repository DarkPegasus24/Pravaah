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
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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

  // 4. Send Message via deployed "ai-agent" Edge Function
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || !selectedId || isSending) return;

    const textToSend = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    try {
      const { error } = await supabase.functions.invoke('ai-agent', {
        body: {
          conversation_id: selectedId,
          customer_message: textToSend,
        },
      });

      if (error) {
        console.error('Edge Function error:', error);
      }

      // Refetch messages to ensure accurate DB state
      await fetchMessages(selectedId);
      // Refresh conversations list to update updated_at timestamp order
      await fetchConversations();
    } catch (err) {
      console.error('Error invoking ai-agent edge function:', err);
    } finally {
      setIsSending(false);
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

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      c.customer_name?.toLowerCase().includes(query) ||
      c.customer_contact?.toLowerCase().includes(query) ||
      c.status?.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;
    if (filterStatus === 'booked') return c.status?.toLowerCase().includes('book');
    if (filterStatus === 'qualified') return c.status?.toLowerCase().includes('qualif');
    if (filterStatus === 'open') return c.status?.toLowerCase().includes('open');
    return true;
  });

  return (
    <div className="h-[calc(100vh-9rem)] md:h-[calc(100vh-8.5rem)] min-h-[560px] flex flex-col gap-4 animate-fadeIn font-sans bg-[#f8f9ff] text-[#0b1c30]">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#0b1c30] tracking-tight flex items-center gap-2.5">
            <span>Conversations Hub</span>
            <Badge variant="accent" size="sm">
              {conversations.length} Active {conversations.length === 1 ? 'Thread' : 'Threads'}
            </Badge>
          </h1>
          <p className="text-xs text-[#45464d]">
            Real-time customer inquiries connected to Supabase and autonomous AI agent responses.
          </p>
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
          {/* Search and Status Filter Pills */}
          <div className="p-3.5 border-b border-[#e5eeff] flex flex-col gap-2.5 bg-[#f8f9ff]">
            <Input
              placeholder="Search customer, contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="sm"
              startIcon={<Search className="w-4 h-4 text-[#76777d]" />}
              className="bg-white border-[#dce9ff]"
            />

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'open', label: 'Open' },
                { id: 'qualified', label: 'Qualified' },
                { id: 'booked', label: 'Booked' },
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
                  <h3 className="font-heading font-bold text-sm text-[#0b1c30]">No conversations found</h3>
                  <p className="text-xs text-[#76777d] mt-1">
                    {searchQuery ? 'Try matching a different name or contact.' : 'Inbound inquiries will appear here.'}
                  </p>
                </div>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedId;

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`p-4 transition-all cursor-pointer flex items-start gap-3 relative ${
                      isSelected
                        ? 'bg-[#eff4ff] border-l-4 border-[#0058be]'
                        : 'hover:bg-[#f8f9ff]'
                    }`}
                  >
                    {/* User Avatar */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-colors ${
                        isSelected
                          ? 'bg-[#0058be] text-white'
                          : 'bg-[#eff4ff] text-[#004395] border border-[#d8e2ff]'
                      }`}
                    >
                      <User className="w-4.5 h-4.5" />
                    </div>

                    {/* Content Preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-heading font-bold text-xs text-[#0b1c30] truncate">
                          {conv.customer_name || 'Customer Inquiry'}
                        </span>
                        <span className="text-[10px] text-[#76777d] font-mono shrink-0">
                          {formatTime(conv.updated_at || conv.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-[#76777d] mb-1">
                        <span className="truncate">
                          {conv.customer_contact || 'Inbound Web Thread'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {conv.status && (
                          <Badge variant="secondary" size="sm" className="text-[9px] bg-white border-[#d8e2ff] text-[#004395]">
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

        {/* ================= MIDDLE PANEL: CHAT THREAD & INPUT ================= */}
        <div
          className={`flex-1 flex flex-col bg-white min-w-0 ${
            !mobileChatView ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="h-16 px-4 sm:px-6 border-b border-[#e5eeff] bg-[#f8f9ff] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setMobileChatView(false)}
                    className="md:hidden p-1.5 rounded-lg bg-white border border-[#dce9ff] text-[#45464d] hover:text-[#0b1c30]"
                    aria-label="Back to conversation list"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="w-9 h-9 rounded-xl bg-[#0058be] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <User className="w-4.5 h-4.5 text-white" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading font-bold text-sm text-[#0b1c30] truncate">
                        {activeConversation.customer_name || 'Customer Inquiry'}
                      </h2>
                      {activeConversation.status && (
                        <Badge variant="secondary" size="sm" className="text-[10px] bg-white border-[#d8e2ff] text-[#004395]">
                          {activeConversation.status}
                        </Badge>
                      )}
                    </div>
                    {activeConversation.customer_contact && (
                      <p className="text-[11px] text-[#76777d] truncate">
                        {activeConversation.customer_contact}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Message History Feed */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 bg-[#f8f9ff]/40">
                {isLoadingMessages ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#0058be]" />
                    <p className="text-xs text-[#76777d]">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center border border-[#d8e2ff]">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-[#0b1c30]">No messages in this thread yet</h3>
                      <p className="text-xs text-[#76777d] mt-1">
                        Send a message below to test the AI agent response.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isBusiness = msg.sender_type === 'business';

                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                          isBusiness ? 'self-end flex-row-reverse' : 'self-start'
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                            isBusiness
                              ? 'bg-[#0058be] text-white shadow-xs'
                              : 'bg-white border border-[#dce9ff] text-[#0058be]'
                          }`}
                        >
                          {isBusiness ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        </div>

                        {/* Bubble */}
                        <div className="flex flex-col gap-1">
                          <div
                            className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                              isBusiness
                                ? 'bg-[#0058be] text-white rounded-tr-xs shadow-xs'
                                : 'bg-white text-[#0b1c30] border border-[#e5eeff] rounded-tl-xs shadow-xs'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content || msg.text}</p>
                          </div>

                          <span
                            className={`text-[10px] text-[#76777d] font-mono flex items-center gap-1 ${
                              isBusiness ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <Clock className="w-2.5 h-2.5" />
                            {formatTime(msg.created_at)}
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
                  placeholder="Type a customer message to trigger the AI agent..."
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
                  className="font-bold px-4 py-2.5"
                >
                  {isSending ? 'Sending...' : 'Send'}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center border border-[#d8e2ff] mb-3">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-sm text-[#0b1c30]">Select a conversation</h3>
              <p className="text-xs text-[#76777d] mt-1 max-w-xs">
                Choose an inquiry from the left panel to inspect message history and test the AI agent.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
