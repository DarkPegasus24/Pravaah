import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Copy,
  Check,
  Loader2,
  Clock,
  ArrowRight,
  Inbox,
} from 'lucide-react';
import {
  Badge,
  Button,
} from '../components/ui';
import { supabase } from '../lib/supabaseClient';

export default function Email() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const businessEmail = 'hello@fuudr.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(businessEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Helper for relative timestamps
  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Fetch recent email conversations from Supabase
  useEffect(() => {
    let isMounted = true;

    async function fetchEmailConversations() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const { data, error } = await supabase
          .from('conversations')
          .select('*, messages(content, created_at, sender_type)')
          .eq('channel', 'email')
          .order('updated_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        if (isMounted && data) {
          setConversations(data);
        }
      } catch (err) {
        console.error('Error fetching email conversations:', err);
        if (isMounted) {
          setErrorMessage(err.message || 'Failed to load email conversations.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchEmailConversations();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to extract preview text (truncated to ~100 chars)
  const getMessagePreview = (conv) => {
    if (conv.messages && conv.messages.length > 0) {
      // Get the latest message content
      const sorted = [...conv.messages].sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
      const text = sorted[0]?.content || '';
      return text.length > 100 ? `${text.slice(0, 100)}...` : text;
    }

    if (conv.call_summary) {
      return conv.call_summary.length > 100
        ? `${conv.call_summary.slice(0, 100)}...`
        : conv.call_summary;
    }

    return 'Inbound email received and processed.';
  };

  const handleRowClick = (_convId) => {
    // Clicking navigates to /dashboard/conversations (deep-linking to a specific conversation could be added later)
    navigate('/dashboard/conversations');
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto animate-fadeIn font-sans selection:bg-[#0058be] selection:text-white pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#e2e8f0]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
              Email
            </h1>
            <Badge variant="secondary" size="sm" className="font-medium text-xs">
              Autonomous Email Agent
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#64748b]">
            Your AI agent automatically replies to every email sent to your business address.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#e2e8f0] text-xs font-medium text-[#334155] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Inbound Gateway Ready</span>
          </div>
        </div>
      </div>

      {/* 2. Prominent Business Email Card */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden p-6 sm:p-7 flex flex-col gap-4 transition-all">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-[#0b1c30] flex items-center justify-center shrink-0 shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider block">
                Assigned Business Inbound Email
              </span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-[#0b1c30] tracking-tight">
                {businessEmail}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="success" dot pulse size="sm" className="font-semibold shadow-xs">
              AI Auto-Reply Active
            </Badge>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyEmail}
              className="text-xs font-medium rounded-lg shadow-xs"
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            >
              {copied ? 'Copied' : 'Copy Email'}
            </Button>
          </div>
        </div>

        <div className="pt-3 border-t border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#64748b]">
          <p>
            Customer inquiries arriving at <strong className="text-[#0b1c30] font-mono">{businessEmail}</strong> are autonomously processed and replied to using your Unified Knowledge Base.
          </p>
          <span className="shrink-0 text-[11px] font-medium text-slate-500">
            Average Response: &lt; 30s
          </span>
        </div>
      </div>

      {/* 3. Recent Email Conversations */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden flex flex-col">
        {/* Section Header */}
        <div className="px-5 py-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#e2e8f0] text-[#334155] flex items-center justify-center shrink-0 shadow-xs">
              <Inbox className="w-4 h-4 text-[#0b1c30]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0b1c30]">
                Recent Email Conversations
              </h2>
              <p className="text-[11px] text-[#64748b]">
                Inbound customer emails and autonomous AI replies
              </p>
            </div>
          </div>

          {conversations.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600 border border-slate-200">
              {conversations.length} {conversations.length === 1 ? 'thread' : 'threads'}
            </span>
          )}
        </div>

        {/* Section Body */}
        <div className="p-0">
          {isLoading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#0058be]" />
              <p className="text-xs text-[#64748b]">Loading email threads...</p>
            </div>
          ) : errorMessage ? (
            <div className="p-8 text-center text-xs text-red-600">
              {errorMessage}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shadow-xs">
                <Inbox className="w-6 h-6 text-slate-400" />
              </div>
              <div className="max-w-md">
                <h3 className="font-heading font-bold text-sm text-[#0b1c30]">
                  No emails received yet
                </h3>
                <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                  Once someone emails <strong className="text-[#0b1c30] font-mono">{businessEmail}</strong>, conversations will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#e2e8f0]">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleRowClick(conv.id)}
                  className="p-4 sm:p-5 hover:bg-[#f8fafc] transition-colors cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-[#0b1c30] flex items-center justify-center shrink-0 group-hover:border-[#0058be] transition-colors">
                      <Mail className="w-4 h-4 text-slate-700" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-heading font-bold text-xs sm:text-sm text-[#0b1c30] truncate">
                          {conv.customer_contact || conv.customer_name || 'Inbound Email Sender'}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#64748b] shrink-0 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{getRelativeTime(conv.updated_at || conv.created_at)}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#64748b] line-clamp-1 leading-relaxed font-sans">
                        {getMessagePreview(conv)}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-slate-400 group-hover:text-[#0058be] group-hover:translate-x-0.5 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
