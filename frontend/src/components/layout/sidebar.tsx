import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  FolderGit2,
  GitPullRequest,
  Users2,
  Users,
  KanbanSquare,
  Rocket,
  AlertTriangle,
  FileSpreadsheet,
  Bot,
  BellRing,
  Plug,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getRealNotifications } from '@/lib/github-live';

export const navItems = [
  { label: 'Overview', href: '/overview', icon: LayoutDashboard },
  { label: 'Engineering Health', href: '/health', icon: Activity },
  { label: 'Repositories', href: '/repositories', icon: FolderGit2 },
  { label: 'Pull Requests', href: '/pull-requests', icon: GitPullRequest, badge: 'AI Risk' },
  { label: 'Developers', href: '/developers', icon: Users2 },
  { label: 'Teams', href: '/teams', icon: Users },
  { label: 'Sprints', href: '/sprints', icon: KanbanSquare },
  { label: 'Deployments', href: '/deployments', icon: Rocket },
  { label: 'Incidents', href: '/incidents', icon: AlertTriangle },
  { label: 'Reports', href: '/reports', icon: FileSpreadsheet },
  { label: 'AI Assistant', href: '/ai-assistant', icon: Bot, isAi: true },
  { label: 'Alerts', href: '/alerts', icon: BellRing, isAlerts: true },
  { label: 'Integrations', href: '/integrations', icon: Plug },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { org } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const { unreadCount: count } = getRealNotifications();
    setUnreadCount(count);
  }, [pathname]);

  return (
    <aside
      className={`hidden md:flex relative flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-300 z-30 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/overview" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20 shrink-0">
            <Zap className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-zinc-900 dark:text-white text-base">DevPulse</span>
              <span className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase">Intelligence</span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`h-4 w-4 shrink-0 ${item.isAi ? 'text-indigo-400 animate-pulse' : ''}`} />
              {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!isCollapsed && item.badge && (
                <span className="rounded bg-indigo-100 dark:bg-indigo-950 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {item.badge}
                </span>
              )}
              {!isCollapsed && item.isAlerts && unreadCount > 0 && (
                <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Organization Badge footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 p-2 border border-zinc-200/80 dark:border-zinc-800/80">
            <div className="h-7 w-7 rounded bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-xs">
              DP
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {org?.name || 'DevPulse Org'}
              </span>
              <span className="text-[10px] text-zinc-500">Enterprise Edition</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
