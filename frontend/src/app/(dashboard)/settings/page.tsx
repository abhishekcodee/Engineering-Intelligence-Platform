'use client';

import React, { useState } from 'react';
import { Settings, Shield, Users, Bell, Building2, Lock, History } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const { user, org } = useAuth();
  const [activeTab, setActiveTab] = useState<'organization' | 'team' | 'security' | 'audit' | 'plan'>('organization');

  const auditLogs = [
    { id: '1', action: 'USER_LOGIN', user: 'Alex Mercer', ip: '192.168.1.1', timestamp: new Date().toLocaleString() },
    { id: '2', action: 'GITHUB_SYNC_TRIGGERED', user: 'Sarah Chen', ip: '192.168.1.4', timestamp: new Date(Date.now() - 3600000).toLocaleString() },
    { id: '3', action: 'ALERT_ACKNOWLEDGED', user: 'Alex Mercer', ip: '192.168.1.1', timestamp: new Date(Date.now() - 7200000).toLocaleString() },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Settings & Audit Controls
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Manage workspace settings, security, team roles, and organization audit logs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-4 text-xs font-semibold text-zinc-500">
        {[
          { id: 'organization', label: 'Organization', icon: Building2 },
          { id: 'team', label: 'Team Members', icon: Users },
          { id: 'security', label: 'Security & OAuth', icon: Lock },
          { id: 'audit', label: 'Audit Logs', icon: History },
          { id: 'plan', label: 'Plan & License (100% Free)', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-zinc-900 dark:text-white'
                  : 'border-transparent hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm">
        {activeTab === 'organization' && (
          <div className="space-y-4 max-w-md text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Organization Name</label>
              <input
                type="text"
                defaultValue={org?.name || 'DevPulse Engineering'}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Organization Slug</label>
              <input
                type="text"
                disabled
                defaultValue={org?.slug || 'devpulse-engineering'}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-3 py-2 text-zinc-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Timezone</label>
              <select className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-white focus:outline-none">
                <option>America/New_York (UTC-5)</option>
                <option>UTC (Coordinated Universal Time)</option>
                <option>Europe/London (UTC+0)</option>
              </select>
            </div>
            <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all">
              Save Changes
            </button>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Workspace Members</h3>
              <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500">
                Invite Member
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400">
                    <th className="pb-2">User</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
                  <tr>
                    <td className="py-2.5 font-bold">Alex Mercer</td>
                    <td className="py-2.5 text-zinc-500">alex.owner@devpulse.io</td>
                    <td className="py-2.5 font-bold text-indigo-500">OWNER</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Sarah Chen</td>
                    <td className="py-2.5 text-zinc-500">sarah.manager@devpulse.io</td>
                    <td className="py-2.5 font-bold text-indigo-400">ENGINEERING_MANAGER</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">David Kim</td>
                    <td className="py-2.5 text-zinc-500">david.dev@devpulse.io</td>
                    <td className="py-2.5 text-zinc-500">DEVELOPER</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4 max-w-md text-xs">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Security & Password</h3>
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Current Password</label>
              <input type="password" className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">New Password</label>
              <input type="password" className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2" />
            </div>
            <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500">
              Update Password
            </button>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Organization Audit Trail</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400">
                    <th className="pb-2">Action</th>
                    <th className="pb-2">User</th>
                    <th className="pb-2">IP Address</th>
                    <th className="pb-2">Timestamp</th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-2.5 font-mono text-[11px] font-bold text-indigo-500">{log.action}</td>
                    <td className="py-2.5 text-zinc-700 dark:text-zinc-300">{log.user}</td>
                    <td className="py-2.5 text-zinc-500">{log.ip}</td>
                    <td className="py-2.5 text-zinc-400">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}

        {activeTab === 'plan' && (
          <div className="space-y-6 text-xs">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-emerald-300">100% Free & Open-Source License</h4>
                <p className="text-xs text-emerald-400/80 mt-0.5">
                  All features, AI analytics, DORA metrics, integrations, and report generators are 100% free with no paid tiers or paywalls.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-zinc-950 font-extrabold text-[11px] uppercase tracking-wider">
                UNLIMITED FREE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-1">
                <span className="text-zinc-400 text-[11px]">Monthly Subscription</span>
                <p className="text-lg font-bold text-emerald-500">$0 / Month</p>
                <p className="text-[10px] text-zinc-500">Free forever for all users</p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-1">
                <span className="text-zinc-400 text-[11px]">Developer Seats</span>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">Unlimited</p>
                <p className="text-[10px] text-zinc-500">No per-user licensing fees</p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-1">
                <span className="text-zinc-400 text-[11px]">Repository Limit</span>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">Unlimited</p>
                <p className="text-[10px] text-zinc-500">Connect unlimited GitHub repos</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
