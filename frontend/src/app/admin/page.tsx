'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/hooks/useAuth';
import { apiRequest } from '../../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, ShoppingBag, Users, Calendar, Loader, FileText, Settings, UserCheck } from 'lucide-react';

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalReservations: number;
  topDishes: { name: string; quantity: number }[];
  ordersByCategory: { category: string; count: number }[];
  reservationsTrend: { date: string; count: number }[];
}

interface CustomerProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  orderCount: number;
  totalSpend: number;
  status: string;
  lastOrderDate: string;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'METRICS' | 'CRM'>('METRICS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return;

    async function fetchAdminData() {
      try {
        setLoading(true);
        setError('');
        const analyticsData = await apiRequest<Analytics>('/admin/analytics');
        setAnalytics(analyticsData);

        const customerData = await apiRequest<CustomerProfile[]>('/admin/customers');
        setCustomers(customerData);
      } catch (err: any) {
        setError('Failed to fetch admin dashboard logs. Ensure backend is running.');
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, [user]);

  const COLORS = ['#B45309', '#D97706', '#D4AF37', '#1E1E1E', '#78350F'];

  if (authLoading || loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 text-brand-terracotta space-y-3">
        <Loader className="w-10 h-10 animate-spin" />
        <span className="text-sm tracking-wider uppercase">Loading Admin Dashboard...</span>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-red-600 font-medium">{error || 'Access Denied.'}</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream-light min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-cream-dark pb-6">
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-brand-charcoal">
              Manager Panel
            </h1>
            <p className="text-xs text-brand-charcoal/60 mt-1 uppercase tracking-wider">
              Consolidated Operations, CRM & Financial Analytics
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-2 bg-brand-cream p-1 border border-brand-cream-dark rounded-sm">
            <button
              onClick={() => setActiveTab('METRICS')}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${activeTab === 'METRICS' ? 'bg-brand-terracotta text-white shadow-sm' : 'text-brand-charcoal/70 hover:bg-brand-cream-light'}`}
            >
              Business Stats
            </button>
            <button
              onClick={() => setActiveTab('CRM')}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${activeTab === 'CRM' ? 'bg-brand-terracotta text-white shadow-sm' : 'text-brand-charcoal/70 hover:bg-brand-cream-light'}`}
            >
              CRM Customers
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-brand-cream border border-brand-cream-dark p-6 rounded-sm shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-brand-terracotta/10 text-brand-terracotta rounded-sm">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-brand-charcoal/50 uppercase tracking-wider block font-semibold">Total Revenue</span>
              <span className="text-xl sm:text-2xl font-bold text-brand-charcoal">₹{Math.round(analytics.totalRevenue)}</span>
            </div>
          </div>

          <div className="bg-brand-cream border border-brand-cream-dark p-6 rounded-sm shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-brand-terracotta/10 text-brand-terracotta rounded-sm">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-brand-charcoal/50 uppercase tracking-wider block font-semibold">Total Orders</span>
              <span className="text-xl sm:text-2xl font-bold text-brand-charcoal">{analytics.totalOrders}</span>
            </div>
          </div>

          <div className="bg-brand-cream border border-brand-cream-dark p-6 rounded-sm shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-brand-terracotta/10 text-brand-terracotta rounded-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-brand-charcoal/50 uppercase tracking-wider block font-semibold">Avg Ticket</span>
              <span className="text-xl sm:text-2xl font-bold text-brand-charcoal">₹{Math.round(analytics.averageOrderValue)}</span>
            </div>
          </div>

          <div className="bg-brand-cream border border-brand-cream-dark p-6 rounded-sm shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-brand-terracotta/10 text-brand-terracotta rounded-sm">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-brand-charcoal/50 uppercase tracking-wider block font-semibold">Reservations</span>
              <span className="text-xl sm:text-2xl font-bold text-brand-charcoal">{analytics.totalReservations}</span>
            </div>
          </div>
        </div>

        {/* METRICS PANEL */}
        {activeTab === 'METRICS' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 1: Top Dishes */}
            <div className="bg-brand-cream border border-brand-cream-dark p-6 rounded-sm shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-bold text-brand-charcoal">Top Signature Dishes</h3>
              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.topDishes} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" stroke="#11111160" />
                    <YAxis dataKey="name" type="category" stroke="#11111160" />
                    <Tooltip contentStyle={{ background: '#FAF7F2', borderColor: '#B45309' }} />
                    <Bar dataKey="quantity" fill="#B45309" radius={[0, 2, 2, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Category volume */}
            <div className="bg-brand-cream border border-brand-cream-dark p-6 rounded-sm shadow-sm space-y-4 flex flex-col justify-between">
              <h3 className="font-serif text-xl font-bold text-brand-charcoal">Category Breakdown</h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.ordersByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="category"
                    >
                      {analytics.ordersByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#FAF7F2', borderColor: '#B45309' }} />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Custom Legend */}
                <div className="space-y-1.5 text-xs text-brand-charcoal/70 pr-4 shrink-0 font-medium">
                  {analytics.ordersByCategory.map((entry, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                      <span>{entry.category} ({entry.count})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* CRM PANEL */}
        {activeTab === 'CRM' && (
          <div className="bg-brand-cream border border-brand-cream-dark rounded-sm shadow-sm overflow-hidden">
            <div className="p-6 border-b border-brand-cream-dark">
              <h3 className="font-serif text-2xl font-bold text-brand-charcoal">Customer CRM Logs</h3>
              <p className="text-xs text-brand-charcoal/60">CRM records mapping customer orders, registration, and total spending.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-brand-charcoal/80">
                <thead className="bg-brand-cream-light border-b border-brand-cream-dark text-xs uppercase tracking-wider text-brand-charcoal/60 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Customer Name</th>
                    <th className="px-6 py-4">Email / Phone</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Orders Count</th>
                    <th className="px-6 py-4 text-right">Total Spent</th>
                    <th className="px-6 py-4 text-right">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream-dark">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-brand-cream-light/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-brand-charcoal">{c.fullName}</td>
                      <td className="px-6 py-4 text-xs">
                        {c.email}<br />
                        <span className="text-[10px] text-brand-charcoal/50">{c.phone}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-green-700 capitalize">{c.status.toLowerCase()}</td>
                      <td className="px-6 py-4 text-center font-bold">{c.orderCount}</td>
                      <td className="px-6 py-4 text-right font-bold text-brand-terraworld font-serif text-base text-brand-terracotta">₹{Math.round(c.totalSpend)}</td>
                      <td className="px-6 py-4 text-right text-xs text-brand-charcoal/50">{c.lastOrderDate.substring(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
