import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  Bell,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Zap,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Badge, Button } from '../components/ui';

export default function DashboardLayout() {
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
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
  ];

  const [notificationsList] = useState([]);

  const handleMarkAllRead = () => {
    setUnreadNotifications(0);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col md:flex-row antialiased selection:bg-black selection:text-white">
      {/* 1. Desktop / Tablet Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-neutral-200 bg-white transition-all duration-300 z-30 sticky top-0 h-screen ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header: Logo & Brand */}
        <div className="h-18 px-4 flex items-center justify-between border-b border-neutral-200">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 overflow-hidden group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col animate-fadeIn overflow-hidden whitespace-nowrap">
                <span className="font-heading font-bold text-lg text-black tracking-tight flex items-center gap-1.5">
                  PRAVAAH
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-black text-white">
                    AI
                  </span>
                </span>
                <span className="text-[10px] text-neutral-500 truncate -mt-0.5">
                  Conversations Engine
                </span>
              </div>
            )}
          </Link>

          {/* Desktop collapse toggle button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Links (Only Overview & Conversations) */}
        <div className="flex-1 py-5 px-3 flex flex-col gap-1.5 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Navigation
            </div>
          )}

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-black text-white font-semibold shadow-sm'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-100 border border-transparent'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
              title={isCollapsed ? item.name : undefined}
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`transition-colors shrink-0 ${
                      isActive ? 'text-white' : 'text-neutral-500 group-hover:text-black'
                    }`}
                  >
                    {item.icon}
                  </div>

                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between overflow-hidden">
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white text-black'
                              : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Sidebar Footer: AI Status Card */}
        <div className="p-3 border-t border-neutral-200">
          {!isCollapsed ? (
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-black">
                  <Zap className="w-3.5 h-3.5 text-black" />
                  <span>Autopilot Mode</span>
                </div>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-black" />
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-tight">
                AI actively listening to conversations.
              </p>
            </div>
          ) : (
            <div className="flex justify-center" title="Autopilot Active">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-black" />
              </span>
            </div>
          )}
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
                <Link to="/dashboard" className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-heading font-bold text-lg text-black tracking-tight">
                    PRAVAAH
                  </span>
                </Link>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-black bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Items */}
              <nav className="py-4 flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-black text-white font-semibold'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Bottom Status in Drawer */}
            <div className="pt-4 border-t border-neutral-200 flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-xs text-neutral-600">
                <Building2 className="w-4 h-4 text-black" />
                <span>Demo Business</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={handleLogout}
                className="justify-start gap-2 text-neutral-700 hover:text-black hover:bg-neutral-100"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Application Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-0 bg-white">
        {/* Topbar (Compact & Rounded) */}
        <header className="h-14 sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-neutral-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile menu toggle + Business Name */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-1.5 rounded-full bg-neutral-50 border border-neutral-200 text-black hover:bg-neutral-100"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Business Selector Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 hover:border-black transition-colors cursor-pointer select-none">
              <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                <Building2 className="w-3 h-3 text-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-semibold text-xs text-black">
                  Demo Business
                </span>
                <Badge variant="primary" size="sm" className="hidden sm:inline-flex text-[9px] px-1.5 py-0 rounded-full">
                  Live
                </Badge>
              </div>
            </div>
          </div>

          {/* Right: Actions, Notifications & Profile Avatar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Live Autopilot Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-50 border border-neutral-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span className="text-neutral-500 text-[10px]">AI Autopilot:</span>
              <span className="text-black font-semibold text-[10px]">Live & Listening</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className="relative p-1.5 rounded-full bg-neutral-50 border border-neutral-200 text-neutral-700 hover:text-black hover:border-neutral-400 transition-colors focus:outline-none cursor-pointer"
                aria-label="View Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notifications Menu */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2.5rem)] sm:w-96 max-w-sm rounded-2xl bg-white border border-neutral-200 shadow-xl overflow-hidden z-50 animate-fadeIn font-sans">
                  <div className="px-4 py-3.5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-semibold text-sm text-black">
                        Notifications
                      </span>
                      {unreadNotifications > 0 && (
                        <Badge variant="primary" size="sm">
                          {unreadNotifications} new
                        </Badge>
                      )}
                    </div>
                    {unreadNotifications > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-neutral-600 hover:text-black font-medium transition-colors cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto">
                    {notificationsList.length === 0 ? (
                      <div className="p-8 text-center text-xs text-neutral-500">
                        No new notifications.
                      </div>
                    ) : (
                      notificationsList.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-3.5 hover:bg-neutral-50 transition-colors flex items-start gap-3 cursor-pointer"
                        >
                          <div className="w-2 h-2 rounded-full bg-black mt-1.5 shrink-0" />
                          <div className="flex-1">
                            <span className="font-semibold text-xs text-black block">
                              {notif.title}
                            </span>
                            <p className="text-[11px] text-neutral-600 mt-0.5 leading-snug">
                              {notif.desc}
                            </p>
                            <span className="text-[10px] text-neutral-400 mt-1 block">
                              {notif.time}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-4 py-2.5 border-t border-neutral-200 bg-neutral-50 text-center">
                    <Link
                      to="/dashboard/conversations"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs text-black hover:underline font-medium"
                    >
                      View all conversations →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-full bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition-colors focus:outline-none cursor-pointer"
                aria-label="User profile menu"
              >
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                  SJ
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-black leading-none">
                    Sarah Jenkins
                  </span>
                  <span className="text-[10px] text-neutral-500 leading-none mt-0.5">
                    Owner
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 hidden sm:inline mr-1" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-neutral-200 shadow-xl overflow-hidden z-50 animate-fadeIn font-sans">
                  <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
                    <div className="font-semibold text-xs text-black">
                      Sarah Jenkins
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate">
                      sarah@demobusiness.com
                    </div>
                  </div>

                  <div className="py-1.5">
                    <Link
                      to="/dashboard/conversations"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:text-black hover:bg-neutral-100 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-neutral-500" />
                      <span>Conversations</span>
                    </Link>
                  </div>

                  <div className="border-t border-neutral-200 py-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:text-black hover:bg-neutral-100 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-200 px-4 py-1.5 flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-4 rounded-lg text-[11px] font-medium transition-colors relative ${
                isActive
                  ? 'text-black font-semibold'
                  : 'text-neutral-400 hover:text-neutral-700'
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
                  <span className="w-1 h-1 rounded-full bg-black mt-0.5" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
