'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GitPullRequest, Sparkles, Filter, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function PullRequestsPage() {
  const [prs, setPrs] = useState<any[]>([]);
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchApi<any[]>('/pull-requests')
      .then((data) => setPrs(data))
      .catch(() => {
        setPrs([
          { id: 'pr-1', number: 105, title: 'feat: integrate Stripe Webhook idempotency keys for checkout', repository_name: 'payments-api', author_username: 'davidkim', status: 'open', review_time_hours: 4.2, cycle_time_hours: 18.5, additions: 780, deletions: 210, files_changed: 9, risk_level: 'Critical', reviewer_username: 'sarahchen' },
          { id: 'pr-2', number: 102, title: 'feat: add multi-factor authentication SMS fallback endpoint', repository_name: 'auth-service', author_username: 'elenarostova', status: 'open', review_time_hours: 3.5, cycle_time_hours: 22.0, additions: 540, deletions: 80, files_changed: 7, risk_level: 'High', reviewer_username: 'sarahchen' },
          { id: 'pr-3', number: 101, title: 'refactor: optimize database connection pooling & retry logic', repository_name: 'payments-api', author_username: 'davidkim', status: 'open', review_time_hours: 2.8, cycle_time_hours: 12.4, additions: 320, deletions: 140, files_changed: 5, risk_level: 'Medium', reviewer_username: 'alexmercer' },
          { id: 'pr-4', number: 103, title: 'fix: resolve memory leak in web analytics dashboard charts', repository_name: 'web-platform', author_username: 'marcusv', status: 'merged', review_time_hours: 1.5, cycle_time_hours: 8.2, additions: 85, deletions: 42, files_changed: 3, risk_level: 'Low', reviewer_username: 'sarahchen' },
        ]);
      });
  }, []);

  const filteredPrs = prs.filter((p) => {
    if (riskFilter !== 'all' && p.risk_level.toLowerCase() !== riskFilter.toLowerCase()) return false;
    if (statusFilter !== 'all' && p.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Pull Request Intelligence
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Automated AI risk assessment, review bottlenecks, and cycle time metrics.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-300">
            <Filter className="h-3.5 w-3.5" />
            <span>Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-transparent text-zinc-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Risks</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-300">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-zinc-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="merged">Merged</option>
            </select>
          </div>
        </div>
      </div>

      {/* PR Intelligence Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400">
                <th className="pb-3 font-medium">Pull Request</th>
                <th className="pb-3 font-medium">Repository</th>
                <th className="pb-3 font-medium">Author</th>
                <th className="pb-3 font-medium">Changeset</th>
                <th className="pb-3 font-medium">Review Time</th>
                <th className="pb-3 font-medium">Cycle Time</th>
                <th className="pb-3 font-medium">AI Risk Assessment</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
              {filteredPrs.map((pr) => (
                <tr key={pr.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 font-semibold text-zinc-900 dark:text-zinc-100 max-w-xs truncate">
                    #{pr.number} {pr.title}
                  </td>
                  <td className="py-3 text-zinc-500 font-medium">{pr.repository_name}</td>
                  <td className="py-3 text-zinc-400">@{pr.author_username}</td>
                  <td className="py-3 font-mono text-[11px]">
                    <span className="text-emerald-500">+{pr.additions}</span>{' '}
                    <span className="text-red-500">-{pr.deletions}</span>
                  </td>
                  <td className="py-3 text-zinc-400">{pr.review_time_hours} hrs</td>
                  <td className="py-3 text-zinc-400">{pr.cycle_time_hours} hrs</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        pr.risk_level === 'Critical'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : pr.risk_level === 'High'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}
                    >
                      <Sparkles className="h-3 w-3" />
                      {pr.risk_level} Risk
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/pull-requests/${pr.id}`}
                      className="text-xs font-semibold text-indigo-500 hover:text-indigo-400"
                    >
                      Inspect AI
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
