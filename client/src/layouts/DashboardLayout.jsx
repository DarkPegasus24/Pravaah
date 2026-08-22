import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Phone,
  Bell,
  Menu,
  X,
  Zap,
  Building2,
  ArrowLeft,
} from 'lucide-react';
import { Badge, Button } from '../components/ui';
import { PravaahLogo } from '../components/common/PravaahLogo';

export default function DashboardLayout() {
  const navigate = useNavigate();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const notificationsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      end: true,
    },
    {
      name: 'Conversations',
      path: '/dashboard/conversations',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      name: 'Calling',
      path: '/dashboard/calling',
      icon: <Phone className="w-5 h-5" />,
    },
  ];

  const [notificationsList] = useState([]);

  const handleMarkAllRead = () => {
    setUnreadNotifications(0);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col md:flex-row antialiased selection:bg-[#0058be] selection:text-white">
      {/* 1. Desktop Sidebar (Fixed & Permanently Expanded) */}
      <aside className="hidden md:flex flex-col border-r border-[#e5eeff] bg-white z-30 sticky top-0 h-screen shadow-xs w-64">
        {/* Sidebar Header: Logo & Brand */}
        <div className="h-18 px-4 flex items-center border-b border-[#e5eeff]">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 overflow-hidden group focus:outline-none"
          >
            <PravaahLogo size="sm" showTagline={true} />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-5 px-3 flex flex-col gap-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#76777d]">
            Navigation
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-[#0b1c30] text-white font-semibold shadow-xs'
                    : 'text-[#45464d] hover:text-[#0058be] hover:bg-[#eff4ff] border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`transition-colors shrink-0 ${
                      isActive ? 'text-white' : 'text-[#76777d] group-hover:text-[#0058be]'
                    }`}
                  >
                    {item.icon}
                  </div>

                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white text-[#0b1c30]'
                            : 'bg-[#eff4ff] text-[#004395] border border-[#d8e2ff]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Sidebar Footer: AI Status Card */}
        <div className="p-3 border-t border-[#e5eeff]">
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#004395]">
                <Zap className="w-3.5 h-3.5 text-[#0058be]" />
                <span>Autopilot Mode</span>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0c9488] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0c9488]" />
              </span>
            </div>
            <p className="text-[11px] text-[#45464d] leading-tight">
              AI actively listening to conversations.
            </p>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Drawer / Slide-Over */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-white border-r border-neutral-200 h-full flex flex-col justify-between p-4 z-10 shadow-2xl animate-fadeIn">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <Link to="/dashboard" className="flex items-center">
                  <PravaahLogo size="sm" showTagline={false} />
                </Link>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100"
                  aria-label="Close Navigation Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links in Drawer */}
              <div className="py-4 flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                        isActive
                          ? 'bg-[#0058be] text-white'
                          : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0058be]'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Bottom Status in Drawer */}
            <div className="pt-4 border-t border-neutral-200 flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-xs text-neutral-600">
                <Building2 className="w-4 h-4 text-black" />
                <span>Demo Business</span>
              </div>
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  className="justify-start gap-2 text-neutral-700 hover:text-black hover:bg-neutral-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Application Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-0 bg-[#f8f9ff]">
        {/* Topbar (Compact & Rounded) */}
        <header className="h-16 sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-[#e5eeff] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile menu toggle + Business Name */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-1.5 rounded-xl bg-[#eff4ff] border border-[#d8e2ff] text-[#0b1c30] hover:bg-[#dce9ff]"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-[#0058be]" />
            </button>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="text-xs font-semibold text-[#0058be] hover:underline flex items-center gap-1"
                title="Back to Landing Page"
              >
                Pravaah Platform
              </Link>
              <span className="text-neutral-400 text-xs hidden sm:inline">/</span>
              <span className="text-xs font-bold text-[#0b1c30] hidden sm:inline">
                Command Center
              </span>
            </div>
          </div>

          {/* Right Topbar Actions */}
          <div className="flex items-center gap-3">
            {/* Live Autopilot Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e6fcf8] border border-[#89f5e7]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0c9488] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0c9488]" />
              </span>
              <span className="text-[#005049] font-bold text-[11px]">Autopilot Active</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl bg-white border border-[#dce9ff] text-[#45464d] hover:text-[#0058be] hover:border-[#0058be] transition-colors focus:outline-none cursor-pointer shadow-xs"
                aria-label="View Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0058be] text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notifications Menu */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2.5rem)] sm:w-96 max-w-sm rounded-2xl bg-white border border-[#e5eeff] shadow-xl overflow-hidden z-50 animate-fadeIn font-sans">
                  <div className="px-4 py-3.5 border-b border-[#e5eeff] flex items-center justify-between bg-[#f8f9ff]">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-[#0b1c30]">
                        Flow Telemetry Alerts
                      </span>
                      {unreadNotifications > 0 && (
                        <Badge variant="accent" size="sm">
                          {unreadNotifications} new
                        </Badge>
                      )}
                    </div>
                    {unreadNotifications > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-[#0058be] hover:underline font-medium transition-colors cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-[#e5eeff] max-h-80 overflow-y-auto">
                    {notificationsList.length === 0 ? (
                      <div className="p-8 text-center text-xs text-[#76777d]">
                        No pending alerts. All workflows running smoothly.
                      </div>
                    ) : (
                      notificationsList.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-3.5 hover:bg-[#f8f9ff] transition-colors flex items-start gap-3 cursor-pointer"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#0058be] mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-xs text-[#0b1c30] block truncate">
                              {notif.title}
                            </span>
                            <span className="text-[11px] text-[#45464d] block mt-0.5 leading-snug">
                              {notif.desc}
                            </span>
                            <span className="text-[10px] text-[#76777d] mt-1 block font-mono">
                              {notif.time}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Nested Content Route Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* 4. Mobile Bottom Navigation Bar (< md screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#e5eeff] px-4 py-1.5 flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-4 rounded-lg text-[11px] font-medium transition-colors relative ${
                isActive
                  ? 'text-[#0058be] font-bold'
                  : 'text-[#76777d] hover:text-[#0b1c30]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  {item.icon}
                </div>
                <span className="mt-1">{item.name}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-[#0058be] mt-0.5" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
