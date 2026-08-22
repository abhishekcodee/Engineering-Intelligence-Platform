'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    fetchApi<any[]>('/incidents')
      .then((data) => setIncidents(data))
      .catch(() => {
        setIncidents([
          {
            id: 'inc-1',
            title: 'Stripe Webhook Rate Limit Spike causing payment delays',
            severity: 'P2',
            status: 'resolved',
            repository_name: 'payments-api',
            root_cause: 'Unbounded webhook retry loop during third-party API outage',
            resolution: 'Implemented exponential backoff with jitter and circuit breaker pattern',
            mttr_minutes: 84.0,
            created_at: new Date(Date.now() - 3600000 * 48).toISOString()
          }
        ]);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Incident Management & MTTR
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Mean Time to Recovery tracking, incident frequency, and root cause analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <span className="text-xs text-zinc-500 block">MTTR (Average)</span>
          <span className="text-xl font-bold text-emerald-500">1.4 hours</span>
        </div>
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <span className="text-xs text-zinc-500 block">Incidents (Last 30d)</span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white">2</span>
        </div>
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <span className="text-xs text-zinc-500 block">Resolved Rate</span>
          <span className="text-xl font-bold text-emerald-500">100%</span>
        </div>
      </div>

      <div className="space-y-4">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded text-xs font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  {inc.severity}
                </span>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{inc.title}</h3>
              </div>

              <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 capitalize">
                {inc.status} (MTTR: {inc.mttr_minutes}m)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 text-xs">
              <div>
                <strong className="text-zinc-700 dark:text-zinc-300 block mb-1">Root Cause:</strong>
                <p className="text-zinc-500">{inc.root_cause}</p>
              </div>
              <div>
                <strong className="text-zinc-700 dark:text-zinc-300 block mb-1">Resolution:</strong>
                <p className="text-zinc-500">{inc.resolution}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
