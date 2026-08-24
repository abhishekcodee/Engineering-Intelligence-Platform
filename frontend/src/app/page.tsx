'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ArrowRight, ShieldCheck, Sparkles, GitPullRequest, Rocket, Activity, CheckCircle2, Lock, Bot, Unlock, Gift } from 'lucide-react';

export default function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold shadow-md shadow-indigo-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-lg text-white">DevPulse</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            100% Free
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/overview"
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
          >
            Launch Demo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 lg:px-12 text-center max-w-5xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
          <Unlock className="h-3.5 w-3.5" />
          <span>100% Free & Open-Source Engineering Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
          Engineering intelligence for <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">modern teams</span>.
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Connect your software development workflow, measure real DORA performance, prevent pull request bottlenecks, and turn dev activity into actionable AI insights. All features are completely free forever.
        </p>

        <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 pt-4 w-full">
          <Link
            href="/register"
            className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-indigo-600 text-xs sm:text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
          >
            Get Started <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
          <Link
            href="/overview"
            className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl border border-zinc-800 bg-zinc-900/80 text-xs sm:text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
          >
            Live Demo <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>

        {/* Free Banner Guarantee */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Zero Subscription Fees</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Unlimited Developers & Repos</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Self-Host Anywhere</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto border-t border-zinc-800/60">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl font-bold text-white">Comprehensive Engineering Analytics</h2>
          <p className="text-xs text-zinc-400">Everything software organizations need to deliver with high velocity & reliability.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-3">
            <Activity className="h-6 w-6 text-indigo-400" />
            <h3 className="text-base font-bold text-white">DORA & Health Metrics</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Calculate Deployment Frequency, Lead Time for Changes, Change Failure Rate, and MTTR automatically from real Git activity.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-3">
            <GitPullRequest className="h-6 w-6 text-amber-400" />
            <h3 className="text-base font-bold text-white">AI PR Risk Intelligence</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Scan pull requests for changeset risk, domain complexity, payment logic impact, and recommended review focus.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-3">
            <Bot className="h-6 w-6 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Context-Aware AI Assistant</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Ask natural language questions about your sprints, blocked PRs, and deployment health answered directly from internal DB metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t border-zinc-800/60 text-xs text-zinc-500">
        DevPulse Platform — 100% Free & Open-Source Community Edition © 2026. Built for high-performance software teams.
      </footer>
    </div>
  );
}
