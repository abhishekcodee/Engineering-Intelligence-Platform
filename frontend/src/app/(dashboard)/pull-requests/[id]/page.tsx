'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, Clock, GitPullRequest, Code2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function PullRequestDetailPage({ params }: { params: { id: string } }) {
  const [pr, setPr] = useState<any>(null);

  useEffect(() => {
    fetchApi<any>(`/pull-requests/${params.id}`)
      .then((data) => setPr(data))
      .catch(() => {
        setPr({
          id: params.id,
          number: 105,
          title: 'feat: integrate Stripe Webhook idempotency keys for checkout',
          repository_name: 'payments-api',
          author_username: 'davidkim',
          status: 'open',
          additions: 780,
          deletions: 210,
          files_changed: 9,
          risk_level: 'Critical',
          risk_factors: [
            'Large changeset (+780 / -210 lines) across 9 production files',
            'Modifies Stripe checkout domain logic and database transactions',
            'Multiple payment processing modules affected simultaneously'
          ],
          ai_recommendations: [
            'Validate edge cases for webhook retry idempotency keys under concurrent stress',
            'Add transactional rollback unit tests for Stripe payment failures',
            'Verify database migration locks do not block active API workers'
          ],
          ci_status: 'passing',
          deployment_impact: 'Requires migration lock during low-traffic deployment window'
        });
      });
  }, [params.id]);

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
