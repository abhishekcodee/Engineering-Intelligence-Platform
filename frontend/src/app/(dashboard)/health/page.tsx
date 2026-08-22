'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Rocket, ShieldCheck, GitPullRequest, Code2, Filter } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function EngineeringHealthPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState('all');

  useEffect(() => {
    fetchApi('/analytics/detailed')
      .then((res) => setHealthData(res))
      .catch(() => {
        setHealthData({
          delivery: { deployment_frequency: '4.2/day', lead_time: '18.5 hours', release_frequency: 'Every 4.8 hours', score: 92.0 },
          reliability: { change_failure_rate: '3.2%', rollback_rate: '0.4%', incident_frequency: '2 / month', mttr: '1.4 hours', score: 94.0 },
          collaboration: { pr_review_time: '4.2 hours', review_participation: '91.5%', pr_cycle_time: '22.0 hours', comment_activity: '3.8 comments / PR', score: 84.0 },
          code_activity: { commit_frequency: '48 commits / week', lines_changed: '14,820 / week', repository_activity: '4 active repos', branch_activity: '12 active branches', score: 88.0 }
        });
      });
  }, []);

  if (!healthData) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Engineering Health Analytics
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Deep-dive metrics across Delivery, Reliability, Collaboration, and Code Activity.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-300">
            <Filter className="h-3.5 w-3.5" />
            <span>Team:</span>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="bg-transparent text-zinc-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Teams</option>
              <option value="platform">Platform</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 Health Dimension Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Delivery */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Delivery Performance</h3>
                <span className="text-xs text-zinc-500">Speed and cadence of feature shipping</span>
              </div>
            </div>
            <span className="text-lg font-bold text-emerald-500">{healthData.delivery.score}%</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/40">
              <span className="text-zinc-500">Deployment Frequency</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{healthData.delivery.deployment_frequency}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/40">
              <span className="text-zinc-500">Lead Time for Changes</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{healthData.delivery.lead_time}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">Release Cadence</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{healthData.delivery.release_frequency}</span>
            </div>
          </div>
        </div>

        {/* 2. Reliability */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Reliability & Stability</h3>
                <span className="text-xs text-zinc-500">Production stability and recovery speed</span>
              </div>
            </div>
            <span className="text-lg font-bold text-emerald-500">{healthData.reliability.score}%</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/40">
              <span className="text-zinc-500">Change Failure Rate</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{healthData.reliability.change_failure_rate}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/40">
              <span className="text-zinc-500">Mean Time to Recovery (MTTR)</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{healthData.reliability.mttr}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">Rollback Rate</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{healthData.reliability.rollback_rate}</span>
            </div>
          </div>
        </div>

        {/* 3. Collaboration */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <GitPullRequest className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Collaboration Health</h3>
                <span className="text-xs text-zinc-500">Peer review turn-around & participation</span>
              </div>
            </div>
            <span className="text-lg font-bold text-amber-500">{healthData.collaboration.score}%</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/40">
              <span className="text-zinc-500">PR Review Turnaround Time</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{healthData.collaboration.pr_review_time}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/40">
              <span className="text-zinc-500">Review Participation Rate</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{healthData.collaboration.review_participation}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">Average PR Cycle Time</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{healthData.collaboration.pr_cycle_time}</span>
            </div>
          </div>
        </div>

        {/* 4. Code Activity */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Code Activity</h3>
                <span className="text-xs text-zinc-500">Commit volume, churn & active branches</span>
              </div>
            </div>
            <span className="text-lg font-bold text-emerald-500">{healthData.code_activity.score}%</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/40">
              <span className="text-zinc-500">Weekly Commit Frequency</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{healthData.code_activity.commit_frequency}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/40">
              <span className="text-zinc-500">Lines Changed Churn</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{healthData.code_activity.lines_changed}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">Active Repositories</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{healthData.code_activity.repository_activity}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
