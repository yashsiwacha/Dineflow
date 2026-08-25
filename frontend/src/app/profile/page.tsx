'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/hooks/useAuth';
import { useToast } from '../../components/Toast';
import { User, Mail, Phone, Shield, LogOut, ArrowRight, LayoutDashboard, ChefHat, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import MagneticButton from '../../components/MagneticButton';

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully', 'success');
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0D0B08] flex flex-col justify-center items-center text-brand-gold space-y-4">
        <Loader className="w-10 h-10 animate-spin text-brand-terracotta" />
        <span className="text-xs tracking-[0.25em] uppercase font-light">Loading account details...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0B08] text-white min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Background design lattices */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full text-brand-gold" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="profile-jali" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="0.6" fill="currentColor" />
          </pattern>
          <rect width="100" height="100" fill="url(#profile-jali)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">
        
        <div className="bg-brand-charcoal border border-white/8 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-10 relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/2 rounded-full blur-3xl pointer-events-none" />
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-brand-terracotta text-white rounded-full flex items-center justify-center font-serif text-3xl font-bold shadow-lg shadow-brand-terracotta/20">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold text-white">{user.fullName}</h1>
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-brand-gold/10 text-brand-gold mt-1 border border-brand-gold/20 uppercase tracking-widest">
                  {user.role} Member
                </span>
              </div>
            </div>
            <MagneticButton>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 border border-white/10 hover:border-red-500/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </MagneticButton>
          </div>

          {/* Details & Dashboards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Account Details */}
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-white">Account Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-9 h-9 bg-[#0D0B08] border border-white/8 rounded-xl flex items-center justify-center text-white/35">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/30 block font-semibold">Email</span>
                    <span className="text-white/80 font-medium text-xs">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-9 h-9 bg-[#0D0B08] border border-white/8 rounded-xl flex items-center justify-center text-white/35">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/30 block font-semibold">Full Name</span>
                    <span className="text-white/80 font-medium text-xs">{user.fullName}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-9 h-9 bg-[#0D0B08] border border-white/8 rounded-xl flex items-center justify-center text-white/35">
                    <Shield className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/30 block font-semibold">Security Role</span>
                    <span className="text-white/80 font-medium text-xs capitalize">{user.role.toLowerCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-6 bg-[#0D0B08] p-6 rounded-2xl border border-white/5">
              <h2 className="font-serif text-2xl font-bold text-white">Control Panels</h2>
              
              <div className="space-y-3">
                <Link
                  href="/orders"
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-brand-charcoal border border-white/8 hover:border-brand-gold/50 text-white/70 hover:text-white font-semibold text-xs transition-all group"
                >
                  <span className="flex items-center space-x-3">
                    <ShoppingBag className="w-4.5 h-4.5 text-brand-gold" />
                    <span className="uppercase tracking-wider">My Order History</span>
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/reservations"
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-brand-charcoal border border-white/8 hover:border-brand-gold/50 text-white/70 hover:text-white font-semibold text-xs transition-all group"
                >
                  <span className="flex items-center space-x-3">
                    <Shield className="w-4.5 h-4.5 text-brand-gold" />
                    <span className="uppercase tracking-wider">My Booked Tables</span>
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-brand-charcoal border border-white/8 hover:border-brand-gold/50 text-white/70 hover:text-white font-semibold text-xs transition-all group"
                  >
                    <span className="flex items-center space-x-3">
                      <LayoutDashboard className="w-4.5 h-4.5 text-brand-gold" />
                      <span className="uppercase tracking-wider">Manager Dashboard</span>
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}

                {(user.role === 'KITCHEN' || user.role === 'ADMIN') && (
                  <Link
                    href="/kitchen"
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-brand-charcoal border border-white/8 hover:border-brand-gold/50 text-white/70 hover:text-white font-semibold text-xs transition-all group"
                  >
                    <span className="flex items-center space-x-3">
                      <ChefHat className="w-4.5 h-4.5 text-brand-gold" />
                      <span className="uppercase tracking-wider">Kitchen Board Stream</span>
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// Simple helper loader component since we use Loader inside Profile logic
function Loader({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
