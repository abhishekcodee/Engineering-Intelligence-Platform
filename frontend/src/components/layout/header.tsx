'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sun,
  Moon,
  Search,
  Bell,
  User,
  LogOut,
  Building2,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { navItems } from './sidebar';
import { getRealNotifications } from '@/lib/github-live';

export function Header() {
  const pathname = usePathname();
  const { user, org, theme, toggleTheme, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    const { unreadCount: count } = getRealNotifications();
    setUnreadCount(count);
  }, [pathname]);

  const getPageTitle = () => {
    const item = navItems.find(
      (n) => n.href === pathname || (n.href !== '/overview' && pathname.startsWith(n.href))
    );
    return item ? item.label : 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 md:px-6">
      {/* Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {getPageTitle()}
          </span>
          <span className="hidden sm:inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Live Sync
          </span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center w-64 lg:w-80">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search PRs, repos, developers..."
            className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 pl-9 pr-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-zinc-700" />}
        </button>

        {/* Notifications Dropdown */}
        <Link
          href="/alerts"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          title="Engineering Notifications & Alerts"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-zinc-950">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 p-1 pr-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <span className="hidden sm:inline-block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              {user?.full_name?.split(' ')[0] || 'User'}
            </span>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-lg z-50">
              <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-semibold text-zinc-900 dark:text-white">{user?.full_name}</p>
                <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                <span className="mt-1 inline-block text-[10px] font-semibold text-indigo-500 uppercase">
                  {user?.role || 'OWNER'}
                </span>
              </div>
              <Link
                href="/settings"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
              >
                <User className="h-3.5 w-3.5" />
                Account Settings
              </Link>
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer Portal */}
      {isMobileMenuOpen && isMounted && createPortal(
        <>
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] md:hidden transition-opacity"
          />

          {/* Full Height Slide-out Mobile Drawer */}
          <div className="fixed inset-y-0 left-0 z-[10000] w-72 max-w-[85vw] bg-zinc-950 text-white border-r border-zinc-800 flex flex-col p-4 shadow-2xl md:hidden overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-3 shrink-0">
              <Link
                href="/overview"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold tracking-tight text-white text-base">DevPulse</span>
                  <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">Intelligence</span>
                </div>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="h-9 w-9 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Search Bar */}
            <div className="relative mb-4 shrink-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search PRs, repos, developers..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${item.isAi ? 'text-indigo-400 animate-pulse' : ''}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="rounded bg-indigo-950 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-800">
                        {item.badge}
                      </span>
                    )}
                    {item.isAlerts && unreadCount > 0 && (
                      <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Org Badge Footer */}
            <div className="pt-3 border-t border-zinc-800 mt-auto shrink-0">
              <div className="flex items-center gap-3 rounded-lg bg-zinc-900 p-2.5 border border-zinc-800">
                <div className="h-7 w-7 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  DP
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-semibold text-white truncate">
                    {org?.name || 'DevPulse Org'}
                  </span>
                  <span className="text-[10px] text-zinc-400">Enterprise Edition</span>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </header>
  );
}
