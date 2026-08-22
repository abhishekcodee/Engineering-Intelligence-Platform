'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, CheckCircle2, ArrowRight, Plug } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 px-6 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 font-bold shadow-lg shadow-indigo-500/20">
          <Zap className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to DevPulse</h1>
        <p className="text-xs text-zinc-400">Let’s connect your development tools and initialize your engineering dashboard.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-zinc-900/60 p-8 rounded-2xl border border-zinc-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 text-xs font-semibold text-zinc-400">
            <span className={step >= 1 ? 'text-indigo-400' : ''}>1. Connect GitHub</span>
            <span className={step >= 2 ? 'text-indigo-400' : ''}>2. Select Repos</span>
            <span className={step >= 3 ? 'text-indigo-400' : ''}>3. Launch Dashboard</span>
          </div>

          {step === 1 && (
            <div className="space-y-4 text-center">
              <Plug className="h-10 w-10 text-indigo-400 mx-auto" />
              <h3 className="font-bold text-base">Authorize GitHub Integration</h3>
              <p className="text-xs text-zinc-400">Grant DevPulse read access to sync repositories, commits, PRs, and workflow runs.</p>
              <button
                onClick={() => setStep(2)}
                className="w-full py-2.5 rounded-lg bg-indigo-600 font-semibold hover:bg-indigo-500 flex items-center justify-center gap-2 text-xs"
              >
                Connect GitHub Account <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-base text-center">Select Repositories to Monitor</h3>
              <div className="space-y-2">
                {['payments-api', 'web-platform', 'mobile-app', 'auth-service'].map((repo) => (
                  <label key={repo} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer">
                    <span className="font-semibold text-white">{repo}</span>
                    <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-0" />
                  </label>
                ))}
              </div>
              <button
                onClick={() => router.push('/overview')}
                className="w-full py-2.5 rounded-lg bg-indigo-600 font-semibold hover:bg-indigo-500 text-xs flex items-center justify-center gap-2"
              >
                Start Ingesting & Launch <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
