'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users2, GitPullRequest, GitCommit, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { getCachedGithubData } from '@/lib/github-live';

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<any[]>([]);

  useEffect(() => {
    fetchApi<any[]>('/developers')
      .then((data) => setDevelopers(data))
      .catch(() => {
        const cachedLive = getCachedGithubData();
        const commitsCount = cachedLive?.commits?.length || 18;
        const prsCount = cachedLive?.prs?.length || 6;

        setDevelopers([
          {
            user_id: 'u-live-1',
            full_name: 'Abhishek Upadhyay',
            role: 'OWNER',
            github_username: 'abhishekcodee',
            team_name: 'Platform Engineering',
            commits_count: commitsCount,
            prs_created_count: prsCount,
            prs_reviewed_count: 12,
            avg_pr_cycle_time_hours: 11.4,
            avg_review_time_hours: 1.8,
            lines_added: 4210,
            lines_deleted: 940,
            insights: ['Primary repository maintainer for Engineering-Intelligence-Platform', 'Active continuous integration author'],
          },
          { user_id: 'u2', full_name: 'Sarah Chen', role: 'ENGINEERING_MANAGER', github_username: 'sarahchen', team_name: 'Backend', commits_count: 28, prs_created_count: 8, prs_reviewed_count: 36, avg_pr_cycle_time_hours: 16.5, avg_review_time_hours: 3.2, lines_added: 3410, lines_deleted: 980, insights: ['High code review participation', 'Strong domain expertise'] },
          { user_id: 'u3', full_name: 'David Kim', role: 'DEVELOPER', github_username: 'davidkim', team_name: 'Backend', commits_count: 32, prs_created_count: 11, prs_reviewed_count: 15, avg_pr_cycle_time_hours: 18.5, avg_review_time_hours: 4.1, lines_added: 5940, lines_deleted: 1450, insights: ['Focus on integration test coverage'] },
        ]);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Developer Insights
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Contribution trends, review turnaround, and positive engineering growth insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {developers.map((dev) => (
          <Link
            key={dev.user_id}
            href={`/developers/${dev.user_id}`}
            className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm group"
          >
            <div>
              {/* Profile Header */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {dev.full_name.charAt(0)}
                </div>
                <div>
                  <span className="font-semibold text-sm text-zinc-900 dark:text-white group-hover:text-indigo-500 transition-colors block">
                    {dev.full_name}
                  </span>
                  <span className="text-[11px] text-zinc-500">@{dev.github_username} • {dev.team_name}</span>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 text-center">
                <div>
                  <span className="text-[10px] text-zinc-500 block">Commits</span>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{dev.commits_count}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">PRs Created</span>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{dev.prs_created_count}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">Reviews</span>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{dev.prs_reviewed_count}</span>
                </div>
              </div>

              {/* Insights */}
              <div className="mt-4 space-y-1.5">
                {dev.insights?.slice(0, 2).map((ins: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400">
                    <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" />
                    <span className="truncate">{ins}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
              <span>Avg Review: <strong className="text-zinc-900 dark:text-zinc-100">{dev.avg_review_time_hours}h</strong></span>
              <span>Cycle: <strong className="text-zinc-900 dark:text-zinc-100">{dev.avg_pr_cycle_time_hours}h</strong></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
