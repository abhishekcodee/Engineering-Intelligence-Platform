'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FolderGit2, Star, GitPullRequest, AlertCircle, Rocket, ShieldCheck, Search } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApi<any[]>('/repositories')
      .then((data) => setRepos(data))
      .catch(() => {
        setRepos([
          { id: 'repo-1', name: 'payments-api', full_name: 'devpulse-org/payments-api', primary_language: 'Python', stars_count: 142, open_issues_count: 3, open_prs_count: 4, build_health: 'passing', engineering_health_score: 82.5, description: 'High-throughput Payment Gateway & Stripe Integration API' },
          { id: 'repo-2', name: 'web-platform', full_name: 'devpulse-org/web-platform', primary_language: 'TypeScript', stars_count: 189, open_issues_count: 5, open_prs_count: 6, build_health: 'passing', engineering_health_score: 91.0, description: 'Next.js Main Customer Portal & Analytics Web App' },
          { id: 'repo-3', name: 'mobile-app', full_name: 'devpulse-org/mobile-app', primary_language: 'React Native', stars_count: 98, open_issues_count: 2, open_prs_count: 2, build_health: 'passing', engineering_health_score: 88.5, description: 'Cross-platform mobile application for iOS & Android' },
          { id: 'repo-4', name: 'auth-service', full_name: 'devpulse-org/auth-service', primary_language: 'Go', stars_count: 112, open_issues_count: 1, open_prs_count: 1, build_health: 'passing', engineering_health_score: 94.0, description: 'OAuth2 / OIDC Single Sign-On Authentication microservice' },
        ]);
      });
  }, []);

  const filteredRepos = repos.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.primary_language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Repositories
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Monitored repositories, build health, and engineering health scores.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 pl-9 pr-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRepos.map((repo) => (
          <Link
            key={repo.id}
            href={`/repositories/${repo.id}`}
            className="flex flex-col justify-between p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm group"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="h-4 w-4 text-indigo-500" />
                  <span className="font-semibold text-sm text-zinc-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                    {repo.name}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {repo.engineering_health_score}% Health
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{repo.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 font-medium text-zinc-700 dark:text-zinc-300">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block" />
                  {repo.primary_language}
                </span>
                <span className="flex items-center gap-1">
                  <GitPullRequest className="h-3.5 w-3.5" />
                  {repo.open_prs_count} PRs
                </span>
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {repo.open_issues_count} issues
                </span>
              </div>
              <span className="text-[10px] uppercase font-semibold text-emerald-500">Passing</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
