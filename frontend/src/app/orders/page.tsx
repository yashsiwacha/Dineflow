'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../lib/hooks/useAuth';
import { useSse } from '../../lib/hooks/useSse';
import { useToast } from '../../components/Toast';
import { Clock, CheckCircle2, AlertCircle, ShoppingBag, Eye, ArrowRight, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from '../../components/MagneticButton';

interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  price: number;
  specialInstructions: string;
}

interface Order {
  id: string;
  tableNumber: number | null;
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  status: 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'OUT_FOR_DELIVERY' | 'CANCELLED';
  notes: string;
  totalAmount: number;
  taxAmount: number;
  deliveryCharge: number;
  finalAmount: number;
  paymentStatus: string;
  address: string | null;
  contactPhone: string;
  contactName: string;
  items: OrderItem[];
  createdAt: string;
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const orderId = searchParams?.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch specific order details if orderId is in URL, else fetch user history
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError('');
        if (orderId) {
          const data = await apiRequest<Order>(`/orders/${orderId}`);
          setOrder(data);
        } else {
          // If no orderId in query, load my-orders history (requires login)
          if (user) {
            const data = await apiRequest<Order[]>('/orders/my-orders');
            setHistoryOrders(data);
          } else {
            setError('Please sign in to view your order history.');
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load order data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [orderId, user]);

  // Bind real-time Server-Sent Events updates
  useSse({
    onStatusUpdate: (updatedOrder: Order) => {
      if (order && updatedOrder.id === order.id) {
        setOrder(updatedOrder);
        showToast(`Order status updated to ${updatedOrder.status.replace(/_/g, ' ')}`, 'success');
      }
    }
  });

  const getTimelineSteps = (type: string) => {
    if (type === 'DELIVERY') {
      return ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED'];
    }
    return ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];
  };

  const getStepIndex = (status: string, steps: string[]) => {
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0B08] flex flex-col justify-center items-center text-brand-gold space-y-4">
        <Loader className="w-10 h-10 animate-spin text-brand-terracotta" />
        <span className="text-xs tracking-[0.25em] uppercase font-light">Retrieving Order Logs...</span>
      </div>
    );
  }

  // --- RENDERING SPECIFIC ORDER TRACKING ---
  if (orderId && order) {
    const steps = getTimelineSteps(order.orderType);
    const activeIndex = getStepIndex(order.status, steps);

    return (
      <div className="bg-[#0D0B08] text-white min-h-screen pt-32 pb-24 relative overflow-hidden">
        {/* Background design lattices */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full text-brand-gold" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <pattern id="orders-jali" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="0.6" fill="currentColor" />
            </pattern>
            <rect width="100" height="100" fill="url(#orders-jali)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">
          
          <div className="bg-brand-charcoal border border-white/8 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-10 relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/2 rounded-full blur-3xl pointer-events-none" />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-white/5 pb-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold block">Order Reference</span>
                <h1 className="text-xs sm:text-sm font-mono font-bold text-white/80">{order.id}</h1>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold block">Order Type</span>
                <span className="font-serif text-2xl font-bold text-brand-gold">{order.orderType.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Timeline */}
            {order.status === 'CANCELLED' ? (
              <div className="bg-red-500/5 border border-red-500/15 p-6 rounded-2xl text-center flex flex-col items-center space-y-2">
                <AlertCircle className="w-10 h-10 text-red-400 stroke-[1.5]" />
                <h3 className="font-serif text-2xl font-bold text-red-400">Order Cancelled</h3>
                <p className="text-sm text-red-200/60 font-light">{order.notes}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-bold text-white mb-4">Track Progress</h3>
                
                {/* Horizontal steps */}
                <div className="relative flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0 pt-4">
                  {/* Background line */}
                  <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-white/5 hidden sm:block -translate-y-1/2 z-0" />
                  
                  {steps.map((step, idx) => {
                    const isCompleted = idx <= activeIndex;
                    const isCurrent = idx === activeIndex;

                    return (
                      <div key={step} className="flex flex-row sm:flex-col items-center gap-4 sm:gap-2.5 z-10 w-full sm:w-auto relative">
                        <motion.div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold text-xs shadow-md transition-all duration-300 ${
                            isCurrent 
                              ? 'bg-brand-terracotta border-brand-terracotta text-white ring-4 ring-brand-terracotta/20 scale-110' 
                              : (isCompleted ? 'bg-green-600 border-green-600 text-white' : 'bg-[#0D0B08] border-white/8 text-white/30')
                          }`}
                          animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </motion.div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${isCurrent ? 'text-brand-terracotta' : (isCompleted ? 'text-green-400' : 'text-white/30')}`}>
                          {step.replace(/_/g, ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
              {/* Order Info */}
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-white">Delivery Details</h3>
                <div className="text-xs text-white/50 leading-relaxed font-light space-y-1.5">
                  <p><span className="text-white/30 uppercase tracking-wider text-[10px] block mb-0.5">Contact Name</span> <strong className="font-semibold text-white/80">{order.contactName}</strong></p>
                  <p><span className="text-white/30 uppercase tracking-wider text-[10px] block mb-0.5">Contact Phone</span> {order.contactPhone}</p>
                  {order.address && <p><span className="text-white/30 uppercase tracking-wider text-[10px] block mb-0.5">Address</span> {order.address}</p>}
                  {order.tableNumber && <p><span className="text-white/30 uppercase tracking-wider text-[10px] block mb-0.5">Dining Location</span> Table {order.tableNumber}</p>}
                </div>
                {order.notes && (
                  <p className="text-xs text-white/40 italic bg-[#0D0B08] p-4 rounded-xl border border-white/5">
                    Kitchen note: {order.notes}
                  </p>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-4 bg-[#0D0B08] p-6 border border-white/5 rounded-2xl">
                <h3 className="font-serif text-xl font-bold text-white">Bill Summary</h3>
                <div className="space-y-3 text-xs text-white/50 font-light">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{Math.round(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span>₹{Math.round(order.taxAmount)}</span>
                  </div>
                  {order.deliveryCharge > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Charge</span>
                      <span>₹{Math.round(order.deliveryCharge)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-brand-gold text-sm border-t border-white/5 pt-3 mt-2">
                    <span>Amount Paid</span>
                    <span>₹{Math.round(order.finalAmount)}</span>
                  </div>
                </div>
                <div className="text-center pt-4 border-t border-white/5 mt-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold bg-green-500/10 text-green-400 border border-green-500/15">
                    Payment Secured: {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERING HISTORICAL ORDERS LIST ---
  return (
    <div className="bg-[#0D0B08] text-white min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Background design lattices */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full text-brand-gold" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="history-jali" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="0.6" fill="currentColor" />
          </pattern>
          <rect width="100" height="100" fill="url(#history-jali)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">
        
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-10">
          Your Order History
        </h1>

        {error ? (
          <div className="text-center bg-brand-charcoal border border-white/8 p-12 rounded-3xl shadow-2xl">
            <AlertCircle className="w-12 h-12 text-brand-gold mx-auto mb-4 stroke-[1.5]" />
            <p className="text-white/70 font-semibold mb-6">{error}</p>
            <MagneticButton>
              <Link href="/login" className="inline-flex bg-brand-terracotta text-white px-8 py-3.5 rounded-sm uppercase text-xs tracking-wider font-semibold">
                Go to Login
              </Link>
            </MagneticButton>
          </div>
        ) : historyOrders.length === 0 ? (
          <div className="text-center bg-brand-charcoal border border-white/8 p-12 rounded-3xl shadow-2xl space-y-6">
            <ShoppingBag className="w-12 h-12 text-white/20 mx-auto stroke-[1.5]" />
            <h3 className="font-serif text-2xl font-bold text-white">No Orders Found</h3>
            <p className="text-xs text-white/35 max-w-sm mx-auto">Explore our menu to place your first takeaway or delivery order.</p>
            <MagneticButton>
              <Link href="/menu" className="inline-flex bg-brand-terracotta text-white px-8 py-3.5 rounded-sm uppercase text-xs tracking-wider font-semibold">
                Browse Menu
              </Link>
            </MagneticButton>
          </div>
        ) : (
          <div className="space-y-4">
            {historyOrders.map((ord) => (
              <div 
                key={ord.id} 
                className="bg-brand-charcoal border border-white/8 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xl hover:border-brand-gold/30 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-wider text-white/30 font-bold">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      ord.status === 'COMPLETED' 
                        ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                        : (ord.status === 'CANCELLED' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400')
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mt-1 truncate max-w-xs sm:max-w-md">
                    Order ID: {ord.id.substring(0, 8)}...
                  </h3>
                  <p className="text-[11px] text-white/40 font-light mt-1">
                    {ord.orderType} • {ord.items ? ord.items.reduce((sum, i) => sum + i.quantity, 0) : 0} items • Total: ₹{Math.round(ord.finalAmount)}
                  </p>
                </div>
                
                <MagneticButton>
                  <Link 
                    href={`/orders?orderId=${ord.id}`}
                    className="bg-[#0D0B08] border border-white/8 hover:border-brand-gold/50 text-white/70 hover:text-white px-5 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
                  >
                    <Eye className="w-4 h-4 text-brand-gold" />
                    <span>Track Status</span>
                  </Link>
                </MagneticButton>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default function Orders() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0D0B08] flex flex-col justify-center items-center text-brand-gold space-y-4">
        <Loader className="w-10 h-10 animate-spin text-brand-terracotta" />
        <span className="text-xs tracking-[0.25em] uppercase font-light">Initializing Orders View...</span>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
