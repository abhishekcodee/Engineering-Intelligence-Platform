import Link from 'next/link';
import { ShieldCheck, Activity, Rocket, Code2, GitPullRequest, AlertCircle } from 'lucide-react';

interface EngineeringHealthProps {
  overallScore: number;
  sprintHealth: number;
  deploymentHealth: number;
  codeQuality: number;
  prHealth: number;
  incidentHealth: number;
}

export function EngineeringHealthCard({
  overallScore,
  sprintHealth,
  deploymentHealth,
  codeQuality,
  prHealth,
  incidentHealth,
}: EngineeringHealthProps) {
  const getBadgeColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  const healthDimensions = [
    { label: 'Sprint Health', score: sprintHealth, icon: Activity, href: '/sprints' },
    { label: 'Deployment Health', score: deploymentHealth, icon: Rocket, href: '/deployments' },
    { label: 'Code Quality', score: codeQuality, icon: Code2, href: '/repositories' },
    { label: 'PR Health', score: prHealth, icon: GitPullRequest, href: '/pull-requests' },
    { label: 'Incident Health', score: incidentHealth, icon: AlertCircle, href: '/incidents' },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-6 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-sm">
      {/* Overall Score Badge */}
      <Link
        href="/health"
        className="flex flex-col items-center justify-center p-6 rounded-xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200/60 dark:border-zinc-800/60 min-w-[200px] hover:border-indigo-500/50 transition-all group cursor-pointer"
      >
        <div className="relative flex items-center justify-center">
          <div className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white group-hover:text-indigo-500 transition-colors">
            {overallScore}%
          </div>
        </div>
        <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Engineering Health
        </div>
        <span className={`mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeColor(overallScore)}`}>
          <ShieldCheck className="h-3.5 w-3.5" />
          {overallScore >= 85 ? 'Healthy Organization' : 'Requires Attention'}
        </span>
      </Link>

      {/* Health Dimension Indicators */}
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-3">
        {healthDimensions.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col justify-between p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-indigo-500/50 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-all group"
            >
              <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-500 transition-colors">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{item.score}%</span>
              </div>
              <div className="mt-3">
                <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 block truncate group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{item.label}</span>
                <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.score >= 85 ? 'bg-emerald-500' : item.score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
