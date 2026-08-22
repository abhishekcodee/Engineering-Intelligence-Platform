'use client';

import React, { useState, useEffect } from 'react';
import { Plug, CheckCircle2, RefreshCw, AlertCircle, ExternalLink, Sparkles, X, GitBranch } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [repoSlug, setRepoSlug] = useState('abhishekcodee/Engineering-Intelligence-Platform');
  const [accessToken, setAccessToken] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      const data = await fetchApi<any[]>('/integrations');
      setIntegrations(data);
    } catch {
      setIntegrations([
        { id: '1', provider: 'github', status: 'connected', sync_status: 'synced', last_synced_at: new Date().toISOString(), config: { description: 'GitHub OAuth & Webhook API Ingestion' } },
        { id: '2', provider: 'jira', status: 'not_connected', sync_status: 'idle', config: { description: 'Jira Software Sprint & Issue Tracking' } },
        { id: '3', provider: 'slack', status: 'not_connected', sync_status: 'idle', config: { description: 'Slack Alert Notifications & Daily Digest' } },
        { id: '4', provider: 'linear', status: 'not_connected', sync_status: 'idle', config: { description: 'Linear Issue & Project Management' } },
        { id: '5', provider: 'gitlab', status: 'not_connected', sync_status: 'idle', config: { description: 'GitLab Merge Requests & CI/CD Pipelines' } },
        { id: '6', provider: 'jenkins', status: 'not_connected', sync_status: 'idle', config: { description: 'Jenkins CI Build & Deployment Integration' } },
      ]);
    }
  };

  const handleLiveSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setErrorMsg('');
    setSyncResult(null);

    try {
      const res = await fetchApi<any>('/integrations/github/sync', {
        method: 'POST',
        body: JSON.stringify({
          repo_slug: repoSlug,
          access_token: accessToken || undefined,
        }),
      });
      setSyncResult(res);
      await loadIntegrations();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sync with GitHub API');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Integrations Hub
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Connect software development tools to ingest real-time engineering activity automatically.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-all shadow-md"
        >
          <Sparkles className="h-4 w-4" />
          Sync Real GitHub Repository
        </button>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const isConnected = item.status === 'connected';
          const isGitHub = item.provider === 'github';

          return (
            <div
              key={item.provider}
              className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold flex items-center justify-center text-sm uppercase">
                      {item.provider.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-zinc-900 dark:text-white capitalize">
                        {item.provider}
                      </h3>
                      <span className="text-[10px] text-zinc-500">Official Provider Integration</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      isConnected
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {isConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>

                <p className="text-xs text-zinc-500 mt-3 leading-relaxed">
                  {item.config?.description || `Integrate ${item.provider} data into DevPulse.`}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs">
                {isGitHub ? (
                  <>
                    <span className="text-[10px] text-zinc-400">Live API Sync Active</span>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-1.5 font-semibold text-indigo-500 hover:text-indigo-400"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Sync Real Data
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => alert(`Connecting ${item.provider}...`)}
                    className="w-full text-center py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold text-zinc-700 dark:text-zinc-300 transition-all"
                  >
                    Configure Integration
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Real Live GitHub API Sync Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-500">
                <GitBranch className="h-5 w-5" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Real GitHub API Live Ingestion
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                {errorMsg}
              </div>
            )}

            {syncResult && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Live Sync Complete!
                </div>
                <p className="text-zinc-300">{syncResult.message}</p>
                <div className="flex items-center gap-4 pt-2 font-mono text-[11px] text-zinc-400">
                  <span>Repos: {syncResult.repos_synced}</span>
                  <span>PRs Ingested: {syncResult.prs_synced}</span>
                  <span>Commits: {syncResult.commits_synced}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleLiveSync} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Target GitHub Repository (owner/repo)
                </label>
                <input
                  type="text"
                  required
                  value={repoSlug}
                  onChange={(e) => setRepoSlug(e.target.value)}
                  placeholder="e.g. abhishekcodee/Engineering-Intelligence-Platform or facebook/react"
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Enter any public GitHub repository or your own organization repository slug.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  GitHub Access Token / Personal Access Token (Optional)
                </label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (Optional for private repos or rate limits)"
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Ingesting Live Data...' : 'Sync Real Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
