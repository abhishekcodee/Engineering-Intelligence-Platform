'use client';

import React, { useState, useEffect } from 'react';
import { Rocket, CheckCircle2, AlertTriangle, RefreshCw, Clock, ArrowRight } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<any[]>([]);

  useEffect(() => {
    fetchApi<any[]>('/deployments')
      .then((data) => setDeployments(data))
      .catch(() => {
        setDeployments([
          { id: 'd-1', repository_name: 'payments-api', environment: 'production', status: 'success', sha: 'c7f08a9', commit_message: 'Deploy Stripe Webhook idempotency release v1.4.0', deployed_by: 'GitHub Actions', duration_seconds: 180, deployed_at: new Date().toISOString(), events: [{ event_type: 'build', status: 'passed' }, { event_type: 'test', status: 'passed' }, { event_type: 'deploy', status: 'passed' }] },
          { id: 'd-2', repository_name: 'web-platform', environment: 'staging', status: 'failure', sha: 'd1a9b2c', commit_message: 'Deploy Next.js 14 performance patch', deployed_by: 'Alex Mercer', duration_seconds: 240, failure_reason: 'Integration test timeout on database migration step', deployed_at: new Date(Date.now() - 3600000 * 5).toISOString(), events: [{ event_type: 'build', status: 'passed' }, { event_type: 'test', status: 'failed' }] },
          { id: 'd-3', repository_name: 'auth-service', environment: 'production', status: 'success', sha: 'e4b2c1d', commit_message: 'Deploy SMS MFA endpoint v2.1.0', deployed_by: 'GitHub Actions', duration_seconds: 140, deployed_at: new Date(Date.now() - 3600000 * 24).toISOString(), events: [{ event_type: 'build', status: 'passed' }, { event_type: 'test', status: 'passed' }, { event_type: 'deploy', status: 'passed' }] },
        ]);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Deployment Analytics
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          CI/CD release health, pipeline execution timelines, and failure recovery.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <span className="text-xs text-zinc-500 block">Total Deployments (30d)</span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white">126</span>
        </div>
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <span className="text-xs text-zinc-500 block">Success Rate</span>
          <span className="text-xl font-bold text-emerald-500">96.8%</span>
        </div>
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <span className="text-xs text-zinc-500 block">Rollbacks</span>
          <span className="text-xl font-bold text-amber-500">1</span>
        </div>
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <span className="text-xs text-zinc-500 block">Avg Duration</span>
          <span className="text-xl font-bold text-indigo-500">2.8 mins</span>
        </div>
      </div>

      {/* Deployments List with Pipeline Stage Timeline */}
      <div className="space-y-4">
        {deployments.map((dep) => (
          <div
            key={dep.id}
            className="p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-indigo-500" />
                  <span className="font-bold text-sm text-zinc-900 dark:text-white">{dep.repository_name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {dep.environment}
                  </span>
                </div>
                <p className="text-zinc-500 mt-1 font-mono text-[11px]">{dep.commit_message} ({dep.sha})</p>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${dep.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {dep.status}
              </span>
            </div>

            {/* Pipeline Stage Visualizer Timeline */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {['Build', 'Test', 'Verify', 'Production'].map((stage, sIdx) => {
                  const isFailed = dep.status === 'failure' && sIdx === 1;
                  return (
                    <React.Fragment key={stage}>
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium text-[11px] ${isFailed ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {isFailed ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                        {stage}
                      </div>
                      {sIdx < 3 && <ArrowRight className="h-3 w-3 text-zinc-400" />}
                    </React.Fragment>
                  );
                })}
              </div>

              <span className="text-[10px] text-zinc-500">{dep.duration_seconds}s duration</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
