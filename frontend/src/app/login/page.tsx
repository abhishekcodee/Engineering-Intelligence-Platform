'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Real database authentication via backend API
      const res = await fetchApi<{
        access_token: string;
        token_type: string;
        user: {
          id: string;
          email: string;
          full_name: string;
          role: string;
          avatar_url?: string;
          github_username?: string;
        };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Successful DB verification -> Establish authenticated session
      login(res.access_token, res.user, rememberMe);
      router.push('/overview');
    } catch (err: any) {
      // Strictly handle authentication failures with single source of truth
      const errorMsg = err?.message || 'Invalid email or password.';
      if (errorMsg.includes('401') || errorMsg.includes('Incorrect') || errorMsg.includes('Invalid')) {
        setError('Invalid email or password.');
      } else if (errorMsg.includes('Failed to fetch') || errorMsg.includes('Network')) {
        setError('Unable to connect to authentication server. Please try again.');
      } else {
        setError('Invalid email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 px-6 sm:px-8 lg:px-10">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 font-bold shadow-lg shadow-indigo-500/30">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold tracking-tight text-2xl text-white">DevPulse</span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
        <p className="mt-1.5 text-xs text-zinc-400">
          Enter your credentials to access your engineering database dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-900/70 backdrop-blur-xl p-8 rounded-2xl border border-zinc-800/80 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email Address */}
            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Password with Show/Hide Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-zinc-300">Password</label>
                <Link href="/forgot-password" className="text-indigo-400 hover:underline text-[11px] font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-9 pr-10 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-950 cursor-pointer"
                />
                <span className="text-xs text-zinc-400">Remember me</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up / Create Account Option */}
          <div className="relative border-t border-zinc-800/80 pt-4 text-center">
            <span className="text-xs text-zinc-400">Don't have an account? </span>
            <Link href="/register" className="text-xs font-semibold text-indigo-400 hover:underline">
              Create Account / Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
