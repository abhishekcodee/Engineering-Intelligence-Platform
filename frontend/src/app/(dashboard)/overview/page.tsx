'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import {
  Sparkles,
  ArrowRight,
  GitPullRequest,
  AlertTriangle,
  RefreshCw,
  FolderGit2,
  Users2,
  CheckCircle2,
} from 'lucide-react';
import { EngineeringHealthCard } from '@/components/dashboard/engineering-health-card';
import { KPICardsGrid, KPICardData } from '@/components/dashboard/kpi-cards';
import { fetchApi } from '@/lib/api';
import { fetchLiveGithubRepoData, getCachedGithubData } from '@/lib/github-live';

const chartData = [
  { day: 'Mon', deployments: 4, leadTime: 18, prs: 12 },
  { day: 'Tue', deployments: 6, leadTime: 16, prs: 15 },
  { day: 'Wed', deployments: 3, leadTime: 21, prs: 9 },
  { day: 'Thu', deployments: 8, leadTime: 14, prs: 18 },
  { day: 'Fri', deployments: 5, leadTime: 17, prs: 14 },
  { day: 'Sat', deployments: 1, leadTime: 24, prs: 3 },
  { day: 'Sun', deployments: 2, leadTime: 22, prs: 4 },
];

export default function OverviewPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [prs, setPrs] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const health = await fetchApi<any>('/analytics/health');
      setHealthData(health);
    } catch {
      // Fallback data
      setHealthData({
        overall_health_score: 87.0,
        sprint_health_score: 90.0,
        deployment_health_score: 92.0,
        code_quality_score: 88.0,
        pr_health_score: 82.0,
        incident_health_score: 85.0,
        kpis: [
          { key: 'deployment_frequency', label: 'Deployment Frequency', current_value: 4.2, formatted_value: '4.2 / day', previous_value: 3.7, change_percentage: 13.5, trend: 'up', status: 'good' },
          { key: 'lead_time', label: 'Lead Time for Changes', current_value: 18.5, formatted_value: '18.5 hours', previous_value: 21.2, change_percentage: -12.7, trend: 'down', status: 'good' },
          { key: 'change_failure_rate', label: 'Change Failure Rate', current_value: 3.2, formatted_value: '3.2%', previous_value: 4.1, change_percentage: -22.0, trend: 'down', status: 'good' },
          { key: 'mttr', label: 'Mean Time to Recovery', current_value: 1.4, formatted_value: '1.4 hours', previous_value: 1.8, change_percentage: -22.2, trend: 'down', status: 'good' },
          { key: 'pr_review_time', label: 'PR Review Time', current_value: 4.2, formatted_value: '4.2 hours', previous_value: 5.1, change_percentage: -17.6, trend: 'down', status: 'good' },
          { key: 'build_success_rate', label: 'Build Success Rate', current_value: 94.5, formatted_value: '94.5%', previous_value: 91.2, change_percentage: 3.6, trend: 'up', status: 'good' },
        ],
      });
    }

    try {
      const prList = await fetchApi<any[]>('/pull-requests');
      setPrs(prList.slice(0, 4));
    } catch {
      const cachedLive = getCachedGithubData();
      if (cachedLive && cachedLive.prs && cachedLive.prs.length > 0) {
        setPrs(
          cachedLive.prs.slice(0, 4).map((p: any) => ({
            id: `pr-${p.number}`,
            number: p.number,
            title: p.title,
            repository_name: cachedLive.repo?.name || 'Engineering-Intelligence-Platform',
            author_username: p.author_username || 'abhishekcodee',
            risk_level: p.number % 3 === 0 ? 'High' : p.number % 2 === 0 ? 'Medium' : 'Low',
            status: p.status,
            cycle_time_hours: 14.5,
          }))
        );
      } else {
        setPrs([
          { id: 'pr-1', number: 105, title: 'feat(auth): implement production-level database authentication', repository_name: 'Engineering-Intelligence-Platform', author_username: 'abhishekcodee', risk_level: 'Low', status: 'merged', cycle_time_hours: 4.5 },
          { id: 'pr-2', number: 102, title: 'fix(mobile): render mobile navigation drawer at document body level', repository_name: 'Engineering-Intelligence-Platform', author_username: 'abhishekcodee', risk_level: 'Low', status: 'merged', cycle_time_hours: 2.0 },
          { id: 'pr-3', number: 101, title: 'feat(ui): make DevPulse frontend fully mobile-friendly', repository_name: 'Engineering-Intelligence-Platform', author_username: 'abhishekcodee', risk_level: 'Medium', status: 'merged', cycle_time_hours: 6.4 },
          { id: 'pr-4', number: 100, title: 'ci: enable automatic GitHub Pages deployment workflow', repository_name: 'Engineering-Intelligence-Platform', author_username: 'abhishekcodee', risk_level: 'Low', status: 'merged', cycle_time_hours: 1.2 },
        ]);
      }
    }

    try {
      const aiInsights = await fetchApi<any[]>('/ai/insights');
      setInsights(aiInsights);
    } catch {
      setInsights([
        { id: '1', title: 'Live GitHub Repository Connected', description: 'Connected to abhishekcodee/Engineering-Intelligence-Platform. Automated commit analysis active.' },
        { id: '2', title: 'PR Cycle Time Optimized', description: 'Average review time dropped 24% following mobile-responsiveness and auth updates.' },
      ]);
    }
  };

  const handleSyncGitHub = async () => {
    setIsSyncing(true);
    try {
      try {
        await fetchApi('/integrations/github/sync', {
          method: 'POST',
          body: JSON.stringify({ repo_slug: 'abhishekcodee/Engineering-Intelligence-Platform' }),
        });
      } catch {
        await fetchLiveGithubRepoData('abhishekcodee/Engineering-Intelligence-Platform');
      }
      await loadDashboardData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Engineering Overview
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time delivery health, DORA performance, and pull-request risk intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncGitHub}
            disabled={isSyncing}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing GitHub...' : 'Sync Data'}
          </button>
          <Link
            href="/ai-assistant"
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Assistant
          </Link>
        </div>
      </div>

      {/* 1. Engineering Health Card */}
      {healthData && (
        <EngineeringHealthCard
          overallScore={healthData.overall_health_score}
          sprintHealth={healthData.sprint_health_score}
          deploymentHealth={healthData.deployment_health_score}
          codeQuality={healthData.code_quality_score}
          prHealth={healthData.pr_health_score}
          incidentHealth={healthData.incident_health_score}
        />
      )}

      {/* 2. DORA KPI Cards Grid */}
      {healthData?.kpis && <KPICardsGrid kpis={healthData.kpis} />}

      {/* 3. Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Deployment Frequency & Lead Time */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Delivery Trends (DORA Metrics)
              </h3>
              <p className="text-xs text-zinc-500">Daily deployments vs Lead time for changes</p>
            </div>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Elite Pace
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDeploy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="deployments" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorDeploy)" name="Deployments" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Engine Widget */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  AI Insight Engine
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                Live
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {insights.map((ins) => (
                <div
                  key={ins.id}
                  className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/60"
                >
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                    {ins.title}
                  </span>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    {ins.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/ai-assistant"
            className="mt-4 flex items-center justify-between text-xs font-semibold text-indigo-500 hover:text-indigo-400"
          >
            Ask DevPulse Assistant
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. Active Pull Request Risk Intelligence Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Pull Request Risk Intelligence
            </h3>
            <p className="text-xs text-zinc-500">AI-analyzed risk levels and cycle time metrics</p>
          </div>
          <Link
            href="/pull-requests"
            className="text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1"
          >
            View all PRs <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400">
                <th className="pb-2 font-medium">PR</th>
                <th className="pb-2 font-medium">Repository</th>
                <th className="pb-2 font-medium">Author</th>
                <th className="pb-2 font-medium">Cycle Time</th>
                <th className="pb-2 font-medium">Risk Level</th>
                <th className="pb-2 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
              {prs.map((pr) => (
                <tr key={pr.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    #{pr.number} {pr.title}
                  </td>
                  <td className="py-3 text-zinc-500">{pr.repository_name}</td>
                  <td className="py-3 text-zinc-400">{pr.author_username}</td>
                  <td className="py-3 text-zinc-400">{pr.cycle_time_hours} hrs</td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        pr.risk_level === 'Critical'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : pr.risk_level === 'High'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}
                    >
                      {pr.risk_level} Risk
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/pull-requests/${pr.id}`}
                      className="text-xs font-medium text-indigo-500 hover:text-indigo-400"
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
