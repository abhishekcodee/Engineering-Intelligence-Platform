'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, Eye, EyeOff, Lock, Mail, User, Building, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Create user directly in PostgreSQL database via backend API
      const res = await fetchApi<{
        access_token: string;
        token_type: string;
        user: {
          id: string;
          email: string;
          full_name: string;
          role: string;
        };
      }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email,
          full_name: fullName,
          password,
          org_name: orgName || `${fullName}'s Org`,
        }),
      });

      // Login user with newly generated JWT token from DB
      login(res.access_token, res.user);
      router.push('/overview');
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Email may already be registered.');
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
          Create your DevPulse account
        </h2>
        <p className="mt-1.5 text-xs text-zinc-400">
          Get started with your real engineering intelligence workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-900/70 backdrop-blur-xl p-8 rounded-2xl border border-zinc-800/80 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Work Email */}
            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Organization Name */}
            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">Organization Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Acme Engineering"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-9 pr-10 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span>Create Workspace Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-zinc-800/80 pt-4 text-center">
            <span className="text-xs text-zinc-400">Already registered? </span>
            <Link href="/login" className="text-xs font-semibold text-indigo-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
