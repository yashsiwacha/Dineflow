'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/hooks/useAuth';
import { useToast } from '../../components/Toast';
import { LogIn, Key, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import MagneticButton from '../../components/MagneticButton';

export default function Login() {
  const { user, login } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect based on role
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') router.push('/admin');
      else if (user.role === 'KITCHEN') router.push('/kitchen');
      else router.push('/profile');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const loggedUser = await login(email, password);
      showToast(`Welcome back, ${loggedUser.fullName.split(' ')[0]}!`, 'success');
      if (loggedUser.role === 'ADMIN') {
        router.push('/admin');
      } else if (loggedUser.role === 'KITCHEN') {
        router.push('/kitchen');
      } else {
        router.push('/profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
      showToast('Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0D0B08] min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden text-white">
      {/* Background design lattices */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full text-brand-gold" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="login-jali" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.8" fill="currentColor" />
          </pattern>
          <rect width="100" height="100" fill="url(#login-jali)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md w-full space-y-8 bg-brand-charcoal border border-white/8 p-8 sm:p-12 rounded-3xl shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none" />
        
        {/* Title */}
        <div className="text-center">
          <h2 className="font-serif text-4xl font-bold text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-xs text-white/40 font-light leading-relaxed">
            Sign in to access your orders and reservations
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/15 p-4 flex items-center space-x-3 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-xs text-red-200">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1.5 font-semibold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-white/20" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0D0B08] border border-white/8 pl-11 pr-4 py-3.5 rounded-xl text-xs text-white/80 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 transition-all"
                  placeholder="name@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1.5 font-semibold">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-white/20" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0D0B08] border border-white/8 pl-11 pr-4 py-3.5 rounded-xl text-xs text-white/80 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <MagneticButton>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-terracotta text-white uppercase text-xs tracking-widest font-bold py-4.5 rounded-sm hover:bg-brand-terracotta-dark transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 mt-6 shadow-lg shadow-brand-terracotta/25"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </MagneticButton>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-white/40 font-light">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand-gold hover:underline font-bold">
              Register Here
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
}
