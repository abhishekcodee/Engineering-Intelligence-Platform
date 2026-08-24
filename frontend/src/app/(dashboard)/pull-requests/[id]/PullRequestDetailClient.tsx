'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertTriangle, ShieldCheck, GitPullRequest } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { getCachedGithubData } from '@/lib/github-live';

export default function PullRequestDetailClient({ id }: { id: string }) {
  const [pr, setPr] = useState<any>(null);

  useEffect(() => {
    fetchApi<any>(`/pull-requests/${id}`)
      .then((data) => setPr(data))
      .catch(() => {
        const cachedLive = getCachedGithubData();
        const repoName = cachedLive?.repo?.name || 'Engineering-Intelligence-Platform';
        const prs = cachedLive?.prs || [];
        const foundPr = prs.find((p: any) => `pr-${p.number}` === id || p.number?.toString() === id);

        setPr({
          id: id,
          number: foundPr?.number || 1,
          title: foundPr?.title || 'feat(analytics): connect real live GitHub repository data',
          repository_name: repoName,
          author_username: foundPr?.author_username || 'abhishekcodee',
          status: foundPr?.status || 'merged',
          additions: 185,
          deletions: 42,
          files_changed: 4,
          risk_level: 'Low',
          risk_factors: [
            'Continuous integration changes across frontend & dashboard pages',
            'Synchronized live GitHub REST API data ingestion',
            'Zero breaking database or schema changes'
          ],
          ai_recommendations: [
            'Maintain atomic PR commit size for rapid review turnaround',
            'Run static export build verification before merging to main'
          ],
          ci_status: 'passing',
          deployment_impact: 'Clean deployment executed directly via GitHub Actions'
        });
      });
  }, [id]);

  if (!pr) return null;

  return (
    <div className="space-y-6">
      <Link href="/pull-requests" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Pull Requests
      </Link>

      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <GitPullRequest className="h-5 w-5 text-indigo-500" />
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                #{pr.number} {pr.title}
              </h1>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Author: <span className="font-semibold text-zinc-700 dark:text-zinc-300">@{pr.author_username}</span> in{' '}
              <span className="font-semibold text-indigo-500">{pr.repository_name}</span>
            </p>
          </div>

          <span
            className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              pr.risk_level === 'Critical'
                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {pr.risk_level} Risk Level
          </span>
        </div>

        {/* Changeset Pills */}
        <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
          <span className="text-emerald-500 font-semibold">+{pr.additions} additions</span>
          <span className="text-red-500 font-semibold">-{pr.deletions} deletions</span>
          <span className="text-zinc-400">{pr.files_changed} files modified</span>
        </div>
      </div>

      {/* AI Pull Request Analysis Box */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-6 space-y-4">
        <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400">
          <Sparkles className="h-5 w-5 animate-pulse" />
          <h3 className="text-base font-bold">DevPulse AI PR Risk Reasoning</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Risk Factors */}
          <div className="space-y-2">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Risk Drivers & Impacted Modules
            </h4>
            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 list-disc list-inside">
              {pr.risk_factors?.map((rf: string, idx: number) => (
                <li key={idx} className="leading-relaxed">{rf}</li>
              ))}
            </ul>
          </div>

          {/* Recommended Review Focus */}
          <div className="space-y-2">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Recommended Review Focus & Tests
            </h4>
            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 list-disc list-inside">
              {pr.ai_recommendations?.map((rec: string, idx: number) => (
                <li key={idx} className="leading-relaxed">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
