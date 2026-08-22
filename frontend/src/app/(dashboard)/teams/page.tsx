'use client';

import React, { useState, useEffect } from 'react';
import { Users, Activity, GitPullRequest, Rocket, Clock, ShieldCheck } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    fetchApi<any[]>('/teams')
      .then((data) => setTeams(data))
      .catch(() => {
        setTeams([
          { id: 't1', name: 'Platform', description: 'Core infrastructure, CI/CD, and auth microservices', members_count: 5, health_score: 92.0, pr_throughput: 28, deployment_frequency: '4.8/day', avg_review_time: '2.8 hrs' },
          { id: 't2', name: 'Backend', description: 'High-throughput APIs, Stripe integration, and payment processing', members_count: 6, health_score: 84.5, pr_throughput: 34, deployment_frequency: '3.2/day', avg_review_time: '4.1 hrs' },
          { id: 't3', name: 'Frontend', description: 'Next.js web portal, design system, and data dashboard components', members_count: 4, health_score: 89.0, pr_throughput: 22, deployment_frequency: '5.1/day', avg_review_time: '3.1 hrs' },
          { id: 't4', name: 'Product', description: 'Feature expansion, user onboarding, and enterprise workspace tools', members_count: 5, health_score: 86.0, pr_throughput: 18, deployment_frequency: '2.9/day', avg_review_time: '3.8 hrs' },
        ]);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Team Analytics
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Team performance, PR throughput, delivery cadence, and review efficiency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-white">{team.name} Team</h3>
                    <span className="text-xs text-zinc-500">{team.members_count} engineers</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {team.health_score}% Health
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-3 leading-relaxed">{team.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 text-center text-xs">
              <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950/60">
                <span className="text-[10px] text-zinc-500 block">PR Throughput</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{team.pr_throughput} merged</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950/60">
                <span className="text-[10px] text-zinc-500 block">Deploy Freq</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{team.deployment_frequency}</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950/60">
                <span className="text-[10px] text-zinc-500 block">Avg Review</span>
                <span className="font-bold text-indigo-500">{team.avg_review_time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
