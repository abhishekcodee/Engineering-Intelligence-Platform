'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FolderGit2, GitPullRequest, Rocket, History, CheckCircle2, ArrowLeft } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function RepositoryDetailPage({ params }: { params: { id: string } }) {
  const [repo, setRepo] = useState<any>(null);

  useEffect(() => {
    fetchApi<any>(`/repositories/${params.id}`)
      .then((data) => setRepo(data))
      .catch(() => {
        setRepo({
          id: params.id,
          name: 'payments-api',
          full_name: 'devpulse-org/payments-api',
          primary_language: 'Python',
          description: 'High-throughput Payment Gateway & Stripe Integration API',
          engineering_health_score: 82.5,
          total_commits: 412,
          total_deployments: 38,
          recent_prs: [
            { id: '1', number: 105, title: 'feat: integrate Stripe Webhook idempotency keys', status: 'open', author: 'davidkim', risk_level: 'Critical' },
            { id: '2', number: 101, title: 'refactor: optimize database connection pooling', status: 'open', author: 'davidkim', risk_level: 'Medium' }
          ],
          recent_deployments: [
            { id: 'd1', environment: 'production', status: 'success', sha: 'c7f08a9', deployed_at: new Date().toISOString() },
            { id: 'd2', environment: 'staging', status: 'failure', sha: 'd1a9b2c', deployed_at: new Date().toISOString() }
          ]
        });
      });
  }, [params.id]);

  if (!repo) return null;

  return (
    <div className="space-y-6">
      <Link href="/repositories" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Repositories
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-indigo-500" />
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">{repo.full_name}</h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1">{repo.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            {repo.engineering_health_score}% Engineering Health
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent PRs */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">Recent Pull Requests</h3>
          <div className="space-y-2">
            {repo.recent_prs?.map((pr: any) => (
              <div key={pr.id} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                    #{pr.number} {pr.title}
                  </span>
                  <span className="text-[10px] text-zinc-500">by {pr.author}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">{pr.risk_level} Risk</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Deployments */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">Deployment History</h3>
          <div className="space-y-2">
            {repo.recent_deployments?.map((dep: any) => (
              <div key={dep.id} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block capitalize">
                    {dep.environment} deployment
                  </span>
                  <span className="text-[10px] text-zinc-500">SHA: {dep.sha}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${dep.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {dep.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
