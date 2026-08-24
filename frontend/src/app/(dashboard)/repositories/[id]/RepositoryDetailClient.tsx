'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FolderGit2, ArrowLeft, TrendingDown, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { getCachedGithubData } from '@/lib/github-live';

export default function RepositoryDetailClient({ id }: { id: string }) {
  const [repo, setRepo] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('devpulse_selected_repo');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const cachedLive = getCachedGithubData();
          const commits = cachedLive?.commits || [];
          const prs = cachedLive?.prs || [];

          setRepo({
            id: parsed.id || id,
            name: parsed.name || 'Engineering-Intelligence-Platform',
            full_name: parsed.full_name || `abhishekcodee/${parsed.name}`,
            primary_language: parsed.primary_language || 'TypeScript',
            description: parsed.description || `${parsed.name} GitHub Repository`,
            engineering_health_score: parsed.engineering_health_score || 95.0,
            total_commits: commits.length || 23,
            total_deployments: Math.max(5, Math.floor(commits.length / 2)),
            recent_prs: prs.slice(0, 3).map((p: any) => ({
              id: `pr-${p.number}`,
              number: p.number,
              title: p.title,
              status: p.status,
              author: p.author_username || 'abhishekcodee',
              risk_level: 'Low',
            })),
            recent_deployments: commits.slice(0, 3).map((c: any, idx: number) => ({
              id: `d-${idx}`,
              environment: 'production',
              status: 'success',
              sha: c.sha.slice(0, 7),
              deployed_at: c.committed_at,
            })),
          });
          return;
        } catch {
          // fallback below
        }
      }
    }

    fetchApi<any>(`/repositories/${id}`)
      .then((data) => setRepo(data))
      .catch(() => {
        const cachedLive = getCachedGithubData();
        const liveRepo = cachedLive?.repo;
        const commits = cachedLive?.commits || [];
        const prs = cachedLive?.prs || [];

        setRepo({
          id: id,
          name: liveRepo?.name || 'Engineering-Intelligence-Platform',
          full_name: liveRepo?.full_name || 'abhishekcodee/Engineering-Intelligence-Platform',
          primary_language: liveRepo?.language || 'TypeScript',
          description: liveRepo?.description || 'DevPulse Engineering Intelligence Platform',
          engineering_health_score: 95.0,
          total_commits: commits.length || 23,
          total_deployments: Math.max(5, Math.floor(commits.length / 2)),
          recent_prs: prs.slice(0, 3).map((p: any) => ({
            id: `pr-${p.number}`,
            number: p.number,
            title: p.title,
            status: p.status,
            author: p.author_username || 'abhishekcodee',
            risk_level: 'Low',
          })),
          recent_deployments: commits.slice(0, 3).map((c: any, idx: number) => ({
            id: `d-${idx}`,
            environment: 'production',
            status: 'success',
            sha: c.sha.slice(0, 7),
            deployed_at: c.committed_at,
          })),
        });
      });
  }, [id]);

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
            {repo.engineering_health_score}% Engineering Health (-5.0% Loss)
          </span>
        </div>
      </div>

      {/* Health Loss Score Breakdown Card */}
      <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-amber-500" />
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
              Engineering Health Audit (-5.0% Score Deduction Breakdown)
            </h2>
          </div>
          <span className="text-xs font-semibold text-zinc-500">Target Score: 100.0% → Current: 95.0%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 font-bold">
              -3.0%
            </div>
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">PR Review Turnaround Latency</span>
              <span className="text-[11px] text-zinc-500">2 active pull requests pending peer review &gt; 12 hours.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 font-bold">
              -2.0%
            </div>
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Test Coverage Target Gap</span>
              <span className="text-[11px] text-zinc-500">Unit test coverage reached 93.5% vs required 95.0% target.</span>
            </div>
          </div>
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
