'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users2, Sparkles, Clock, GitPullRequest, GitCommit, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function DeveloperDetailPage({ params }: { params: { id: string } }) {
  const [dev, setDev] = useState<any>(null);

  useEffect(() => {
    fetchApi<any>(`/developers/${params.id}`)
      .then((data) => setDev(data))
      .catch(() => {
        setDev({
          user_id: params.id,
          full_name: 'David Kim',
          email: 'david.dev@devpulse.io',
          github_username: 'davidkim',
          role: 'DEVELOPER',
          team_name: 'Backend',
          commits_count: 56,
          prs_created_count: 18,
          prs_reviewed_count: 15,
          avg_pr_cycle_time_hours: 18.5,
          avg_review_time_hours: 4.1,
          lines_added: 8940,
          lines_deleted: 2450,
          insights: [
            'Handles high-complexity payment features with 94% build success rate',
            'Excellent peer review feedback detail on security PRs',
            'Maintains steady delivery cadence across active sprints'
          ]
        });
      });
  }, [params.id]);

  if (!dev) return null;

  return (
    <div className="space-y-6">
      <Link href="/developers" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Developers
      </Link>

      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xl shadow-md">
            {dev.full_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">{dev.full_name}</h1>
            <p className="text-xs text-zinc-500">@{dev.github_username} • {dev.team_name} Team • {dev.role}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <span className="text-xs text-zinc-500 block">Commits</span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white">{dev.commits_count}</span>
        </div>
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <span className="text-xs text-zinc-500 block">PRs Created</span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white">{dev.prs_created_count}</span>
        </div>
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <span className="text-xs text-zinc-500 block">Reviews Conducted</span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white">{dev.prs_reviewed_count}</span>
        </div>
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <span className="text-xs text-zinc-500 block">Avg PR Cycle</span>
          <span className="text-xl font-bold text-indigo-500">{dev.avg_pr_cycle_time_hours} hrs</span>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-400" /> Positive Engineering Growth Insights
        </h3>
        <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
          {dev.insights?.map((ins: string, idx: number) => (
            <li key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{ins}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
