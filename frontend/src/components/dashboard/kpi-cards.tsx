'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, Clock, AlertTriangle, ShieldCheck, GitPullRequest, CheckCircle2 } from 'lucide-react';

export interface KPICardData {
  key: string;
  label: string;

  current_value: number;
  formatted_value: string;
  previous_value: number;
  change_percentage: number;
  trend: 'up' | 'down' | 'neutral';
  status: 'good' | 'warning' | 'critical';
}

const iconMap: Record<string, any> = {
  deployment_frequency: TrendingUp,
  lead_time: Clock,
  change_failure_rate: AlertTriangle,
  mttr: ShieldCheck,
  pr_review_time: GitPullRequest,
  build_success_rate: CheckCircle2,
};

export function KPICardsGrid({ kpis }: { kpis: KPICardData[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi) => {
        const Icon = iconMap[kpi.key] || TrendingUp;
        const isPositive = kpi.trend === 'up' && kpi.status === 'good';
        const isGoodDown = kpi.trend === 'down' && kpi.status === 'good'; // e.g. Lead time decrease is good!
        
        return (
          <div
            key={kpi.key}
            className="flex flex-col justify-between p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">{kpi.label}</span>
              <div className="h-7 w-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {kpi.formatted_value}
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                {kpi.change_percentage < 0 ? (
                  <span
                    className={`flex items-center font-medium ${
                      isGoodDown ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    {Math.abs(kpi.change_percentage)}%
                  </span>
                ) : kpi.change_percentage > 0 ? (
                  <span
                    className={`flex items-center font-medium ${
                      isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    {kpi.change_percentage}%
                  </span>
                ) : (
                  <span className="flex items-center font-medium text-zinc-400">
                    <Minus className="h-3 w-3 mr-0.5" />
                    0%
                  </span>
                )}
                <span className="text-zinc-400 dark:text-zinc-500">vs prev sprint</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
