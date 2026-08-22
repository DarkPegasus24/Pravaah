import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '../components/ui';

export default function Dashboard() {
  const navigate = useNavigate();

  // Core 1-2 stat cards for Conversations feature (real default empty values)
  const [stats] = useState([
    {
      title: 'Total Conversations',
      value: '0',
      change: '0',
      period: 'this month',
      icon: <MessageSquare className="w-4 h-4 text-black" />,
    },
    {
      title: 'New Inquiries Today',
      value: '0',
      change: '0',
      period: 'today',
      icon: <Sparkles className="w-4 h-4 text-black" />,
    },
  ]);

  /*
  // TODO: re-enable when building this feature
  const extraStats = [
    { title: 'Qualified Leads', value: '0' },
    { title: 'Meetings Booked', value: '0' },
    { title: 'Conversion Rate', value: '0%' },
    { title: 'Pending Follow-ups', value: '0' },
  ];
  */

  // Recent conversations list (real default empty state)
  const [recentConversations] = useState([]);

  /*
  // TODO: re-enable when building this feature
  const aiActions = [];
  */

  return (
    <div className="flex flex-col gap-6 animate-fadeIn bg-white text-black">
      {/* Top Banner / Welcome Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-black tracking-tight">
              Dashboard Overview
            </h1>
            <Badge variant="primary" dot pulse size="sm">
              Live
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600">
            Real-time conversations activity for{' '}
            <span className="text-black font-medium">Demo Business</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dashboard/conversations')}
            leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Open Conversations
          </Button>
        </div>
      </div>

      {/* 1. Stat Cards Grid (Core 2 Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {stats.map((stat, idx) => (
          <Card
            key={idx}
            variant="default"
            className="p-5 border-neutral-200 hover:border-black transition-all flex flex-col justify-between shadow-sm bg-white"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-neutral-500 truncate">
                  {stat.title}
                </span>
                <div className="p-2 rounded-lg bg-neutral-100 border border-neutral-200">
                  {stat.icon}
                </div>
              </div>

              <div className="font-heading text-3xl font-bold text-black tracking-tight">
                {stat.value}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
              <span className="text-black font-semibold">{stat.change}</span>
              <span className="text-neutral-500 truncate ml-1">{stat.period}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* 2. Recent Conversations Card */}
      <div className="w-full">
        <Card variant="default" className="border-neutral-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3 bg-neutral-50">
            <div>
              <CardTitle className="text-base font-semibold text-black">
                Recent Conversations
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500">
                Active customer threads across connected channels
              </CardDescription>
            </div>
            <Link
              to="/dashboard/conversations"
              className="text-xs text-neutral-700 hover:text-black font-medium flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-neutral-100">
            {recentConversations.length === 0 ? (
              <div className="py-12 px-4 text-center flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 mb-1">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-black">No conversations yet</span>
                <p className="text-xs text-neutral-500 max-w-sm">
                  When customers message you via WhatsApp, Web, or SMS, their live threads will appear here.
                </p>
                <Link to="/dashboard/conversations" className="mt-2">
                  <Button variant="secondary" size="sm">
                    Go to Conversations
                  </Button>
                </Link>
              </div>
            ) : (
              recentConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => navigate('/dashboard/conversations')}
                  className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-xs text-black group-hover:border-black transition-colors shrink-0">
                      {conv.avatar}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-black group-hover:underline transition-colors">
                          {conv.name}
                        </span>
                        <span className="text-[11px] text-neutral-500 truncate">
                          • {conv.company}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-600 mt-1 truncate leading-relaxed">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] text-neutral-500 whitespace-nowrap">
                      {conv.time}
                    </span>
                    <Badge variant={conv.statusVariant} size="sm">
                      {conv.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/*
      // TODO: re-enable when building this feature
      // AI actions feed and channel breakdown widgets will be added here
      */}
    </div>
  );
}
