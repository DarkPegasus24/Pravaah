import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Phone,
  Mail,
  Loader2,
  ArrowRight,
  Search,
  RefreshCw,
  PhoneCall,
  DollarSign,
} from 'lucide-react';
import {
  Badge,
  Button,
} from '../components/ui';
import LeadsShowcase from '../components/leads/LeadsShowcase';
import { supabase } from '../lib/supabaseClient';

export default function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('all'); // 'all' | 'voice' | 'email'

  // Helper for relative timestamps
  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Just now';
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

  // Fetch all leads from Supabase
  const fetchLeads = async (showRefreshSpinner = false) => {
    try {
      if (showRefreshSpinner) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorMessage(null);

      // Fetch leads ordered by updated_at or fallback
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.warn('Initial leads fetch error, attempting fallback:', error);
        const fallbackRes = await supabase.from('leads').select('*');
        if (fallbackRes.error) throw fallbackRes.error;
        setLeads(fallbackRes.data || []);
      } else if (data) {
        setLeads(data);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      setErrorMessage(err.message || 'Failed to load leads from Supabase.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filtered leads based on search & channel
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const name = (lead.customer_name || lead.name || '').toLowerCase();
      const contact = (lead.contact || lead.customer_contact || lead.phone || lead.email || '').toLowerCase();
      const req = (lead.requirement || lead.requirements || lead.summary || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch = !query || name.includes(query) || contact.includes(query) || req.includes(query);
      const matchesChannel =
        channelFilter === 'all' || (lead.channel || '').toLowerCase() === channelFilter.toLowerCase();

      return matchesSearch && matchesChannel;
    });
  }, [leads, searchQuery, channelFilter]);

  // Lead KPI Statistics
  const stats = useMemo(() => {
    const total = leads.length;
    const voiceCount = leads.filter((l) => (l.channel || '').toLowerCase() === 'voice').length;
    const emailCount = leads.filter((l) => (l.channel || '').toLowerCase() === 'email').length;
    
    // Count leads with defined budget
    const budgetedLeads = leads.filter(
      (l) => l.budget && l.budget !== 'Not mentioned' && l.budget !== 'null'
    ).length;

    return { total, voiceCount, emailCount, budgetedLeads };
  }, [leads]);

  const handleRowClick = () => {
    navigate('/dashboard/conversations');
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-fadeIn font-sans selection:bg-[#0058be] selection:text-white pb-16">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#e2e8f0]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
              Leads
            </h1>
            <Badge variant="secondary" size="sm" className="font-medium text-xs">
              AI CRM Intelligence
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#64748b]">
            Automatically extracted from your AI conversations across Voice and Email.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchLeads(true)}
            disabled={isRefreshing || isLoading}
            className="text-xs font-medium bg-white shadow-xs hover:bg-slate-50"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            {isRefreshing ? 'Syncing...' : 'Sync Leads'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dashboard/calling')}
            className="text-xs font-medium shadow-xs"
            leftIcon={<PhoneCall className="w-3.5 h-3.5" />}
          >
            Test Voice Agent
          </Button>
        </div>
      </div>

      {/* 2. Top Stats / KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Captured Leads */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Total Leads
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0058be] border border-blue-100 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight font-heading">
              {stats.total}
            </span>
            <p className="text-[11px] text-[#64748b] mt-0.5">
              Extracted across all active channels
            </p>
          </div>
        </div>

        {/* Card 2: Voice Calls */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Voice Leads
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight font-heading">
              {stats.voiceCount}
            </span>
            <p className="text-[11px] text-[#64748b] mt-0.5">
              From inbound phone interactions
            </p>
          </div>
        </div>

        {/* Card 3: Email Inbound */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Email Leads
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight font-heading">
              {stats.emailCount}
            </span>
            <p className="text-[11px] text-[#64748b] mt-0.5">
              From inbound customer emails
            </p>
          </div>
        </div>

        {/* Card 4: Budget Qualified */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Budget Specified
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight font-heading">
              {stats.budgetedLeads}
            </span>
            <p className="text-[11px] text-[#64748b] mt-0.5">
              Qualified with budget estimates
            </p>
          </div>
        </div>
      </div>

      {/* AI Lead Generation Preview / Showcase */}
      <LeadsShowcase />

      {/* 3. Main Data Card with Filter Bar & Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden flex flex-col">
        {/* Table Controls & Filter Toolbar */}
        <div className="p-4 sm:px-5 sm:py-3.5 bg-[#f8fafc] border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads by name, contact, or req..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] text-[#0b1c30] placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Channel Filters */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setChannelFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                channelFilter === 'all'
                  ? 'bg-[#0058be] text-white shadow-xs'
                  : 'bg-white border border-[#cbd5e1] text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Channels ({leads.length})
            </button>
            <button
              type="button"
              onClick={() => setChannelFilter('voice')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                channelFilter === 'voice'
                  ? 'bg-[#0058be] text-white shadow-xs'
                  : 'bg-white border border-[#cbd5e1] text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Phone className="w-3 h-3" />
              <span>Voice</span>
            </button>
            <button
              type="button"
              onClick={() => setChannelFilter('email')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                channelFilter === 'email'
                  ? 'bg-[#0058be] text-white shadow-xs'
                  : 'bg-white border border-[#cbd5e1] text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div>
          {isLoading ? (
            <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-[#0058be]" />
              <p className="text-xs font-medium text-[#64748b]">Loading leads from database...</p>
            </div>
          ) : errorMessage ? (
            <div className="p-12 text-center text-xs text-red-600">
              {errorMessage}
            </div>
          ) : leads.length === 0 ? (
            /* Comprehensive, High-Craft Empty State */
            <div className="py-14 sm:py-16 px-6 sm:px-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-[#0058be] flex items-center justify-center mb-4 shadow-xs">
                <Target className="w-7 h-7 text-[#0058be]" />
              </div>

              <h3 className="font-heading font-bold text-base sm:text-lg text-[#0b1c30]">
                No leads captured yet
              </h3>
              <p className="text-xs sm:text-sm text-[#64748b] max-w-md mt-2 mb-2 leading-relaxed">
                Leads are automatically extracted and summarized as your autonomous AI agent talks with callers and emailers.
              </p>

              {/* Interactive 3-Step Process Flow Guide */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl mt-8 mb-10 text-left">
                <div className="p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col gap-3 shadow-xs">
                  <div className="w-7 h-7 rounded-lg bg-blue-100/80 text-[#0058be] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-xs text-[#0b1c30]">Customer Inbound</h4>
                  <p className="text-[11px] text-[#64748b] leading-relaxed">
                    Customer calls your business phone <span className="font-mono font-semibold text-[#0b1c30]">+91 9413973399</span> or sends an email to <span className="font-mono font-semibold text-[#0b1c30]">hello@fuudr.com</span>.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col gap-3 shadow-xs">
                  <div className="w-7 h-7 rounded-lg bg-purple-100/80 text-purple-700 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-xs text-[#0b1c30]">AI Information Extraction</h4>
                  <p className="text-[11px] text-[#64748b] leading-relaxed">
                    Pravaah AI detects customer intent, requirements, budgets, and contact preferences directly from conversational context.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col gap-3 shadow-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-xs text-[#0b1c30]">Instant CRM Pipeline</h4>
                  <p className="text-[11px] text-[#64748b] leading-relaxed">
                    Structured lead records appear right here with full transcripts and instant deep-links to full conversation threads.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3.5 flex-wrap justify-center pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/dashboard/calling')}
                  leftIcon={<PhoneCall className="w-3.5 h-3.5" />}
                  className="text-xs font-semibold shadow-xs"
                >
                  Simulate Inbound Voice Call
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/dashboard/email')}
                  leftIcon={<Mail className="w-3.5 h-3.5 text-slate-600" />}
                  className="text-xs font-semibold shadow-xs"
                >
                  View Email Gateway
                </Button>
              </div>
            </div>
          ) : filteredLeads.length === 0 ? (
            /* Search / Filter Zero Results */
            <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
              <Search className="w-6 h-6 text-slate-400" />
              <h4 className="font-heading font-bold text-sm text-[#0b1c30]">No matching leads</h4>
              <p className="text-xs text-[#64748b]">
                No leads matched your search query "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setChannelFilter('all');
                }}
                className="mt-2 text-xs font-semibold text-[#0058be] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            /* Leads Table (Desktop) / Cards (Mobile) */
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]/80 text-[#64748b] font-semibold text-[11px] uppercase tracking-wider">
                      <th className="py-3.5 px-5">Customer Name</th>
                      <th className="py-3.5 px-5">Contact</th>
                      <th className="py-3.5 px-5">Requirement</th>
                      <th className="py-3.5 px-5">Budget</th>
                      <th className="py-3.5 px-5">Channel</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5 text-right">Last Updated</th>
                      <th className="py-3.5 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {filteredLeads.map((lead) => {
                      const customerName = lead.customer_name || lead.name || 'Unknown';
                      const contact = lead.contact || lead.customer_contact || lead.phone || lead.email || '—';
                      const requirement = lead.requirement || lead.requirements || lead.summary || 'Not mentioned';
                      const budget = lead.budget !== null && lead.budget !== undefined && lead.budget !== '' ? lead.budget : 'Not mentioned';
                      const channel = (lead.channel || 'voice').toLowerCase();
                      const isVoice = channel === 'voice';
                      const isEmail = channel === 'email';
                      const status = lead.status || 'new';

                      return (
                        <tr
                          key={lead.id}
                          onClick={handleRowClick}
                          className="hover:bg-[#f8fafc] transition-colors cursor-pointer group"
                        >
                          {/* Customer Name */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 group-hover:border-[#0058be] transition-colors">
                                {customerName.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-[#0b1c30] group-hover:text-[#0058be] transition-colors">
                                {customerName}
                              </span>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="py-4 px-5 font-mono text-slate-600">
                            {contact}
                          </td>

                          {/* Requirement */}
                          <td className="py-4 px-5 text-slate-700 max-w-xs truncate" title={requirement}>
                            {requirement}
                          </td>

                          {/* Budget */}
                          <td className="py-4 px-5">
                            <span className={`font-mono text-[11px] px-2 py-0.5 rounded-md ${
                              budget !== 'Not mentioned'
                                ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                                : 'text-slate-400'
                            }`}>
                              {budget}
                            </span>
                          </td>

                          {/* Channel Badge */}
                          <td className="py-4 px-5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                              isVoice
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : isEmail
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}>
                              {isVoice ? <Phone className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                              <span className="capitalize">{channel}</span>
                            </span>
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-5">
                            <Badge variant="info" size="sm" className="font-semibold capitalize text-[10px]">
                              {status}
                            </Badge>
                          </td>

                          {/* Last Updated */}
                          <td className="py-4 px-5 text-right font-mono text-slate-500 text-[11px]">
                            {getRelativeTime(lead.updated_at || lead.created_at)}
                          </td>

                          {/* Action Button */}
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0058be] opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>Thread</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="md:hidden divide-y divide-[#e2e8f0]">
                {filteredLeads.map((lead) => {
                  const customerName = lead.customer_name || lead.name || 'Unknown';
                  const contact = lead.contact || lead.customer_contact || lead.phone || lead.email || '—';
                  const requirement = lead.requirement || lead.requirements || lead.summary || 'Not mentioned';
                  const budget = lead.budget !== null && lead.budget !== undefined && lead.budget !== '' ? lead.budget : 'Not mentioned';
                  const channel = (lead.channel || 'voice').toLowerCase();
                  const isVoice = channel === 'voice';
                  const status = lead.status || 'new';

                  return (
                    <div
                      key={lead.id}
                      onClick={handleRowClick}
                      className="p-4 hover:bg-[#f8fafc] transition-colors cursor-pointer flex flex-col gap-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                            {customerName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-xs text-[#0b1c30]">
                            {customerName}
                          </span>
                        </div>

                        <Badge variant="info" size="sm" className="font-semibold capitalize text-[10px]">
                          {status}
                        </Badge>
                      </div>

                      <div className="text-xs text-slate-600 font-mono">
                        {contact}
                      </div>

                      <p className="text-xs text-slate-700 line-clamp-2">
                        <strong className="text-slate-500 font-normal">Requirement: </strong>
                        {requirement}
                      </p>

                      <div className="flex items-center justify-between text-[11px] pt-2 text-slate-500 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                            isVoice ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                          }`}>
                            {isVoice ? <Phone className="w-2.5 h-2.5" /> : <Mail className="w-2.5 h-2.5" />}
                            <span className="capitalize">{channel}</span>
                          </span>

                          <span>Budget: <strong className="text-slate-700 font-mono">{budget}</strong></span>
                        </div>

                        <span className="font-mono">
                          {getRelativeTime(lead.updated_at || lead.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Table Footer Summary */}
              <div className="px-5 py-3 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between text-xs text-[#64748b]">
                <span>Showing {filteredLeads.length} of {leads.length} leads</span>
                <span className="font-medium">Click any row to view conversation thread</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
