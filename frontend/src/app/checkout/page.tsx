'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../lib/hooks/useCart';
import { useAuth } from '../../lib/hooks/useAuth';
import { apiRequest } from '../../lib/api';
import { useToast } from '../../components/Toast';
import { CreditCard, Wallet, Smartphone, ShieldCheck, Loader, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import MagneticButton from '../../components/MagneticButton';

export default function Checkout() {
  const router = useRouter();
  const { cartItems, subtotal, tax, deliveryCharge, total, orderType, tableNumber, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [payMethod, setPayMethod] = useState<'UPI' | 'CARD' | 'CASH'>('UPI');
  
  const [loading, setLoading] = useState(false);
  const [payStep, setPayStep] = useState<'DETAILS' | 'PROCESSING' | 'SUCCESS'>('DETAILS');
  const [error, setError] = useState('');

  // Pre-fill user profile info if logged in
  useEffect(() => {
    if (user) {
      setName(user.fullName);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      setError('Please fill in all contact information.');
      return;
    }
    if (orderType === 'DELIVERY' && !address) {
      setError('Please provide a delivery address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Submit Order to Backend
      const orderPayload = {
        tableNumber: orderType === 'DINE_IN' ? (tableNumber || 1) : null,
        orderType,
        notes,
        contactPhone: phone,
        contactName: name,
        address: orderType === 'DELIVERY' ? address : null,
        items: cartItems.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: item.price,
          specialInstructions: item.specialInstructions || null
        }))
      };

      const createdOrder = await apiRequest<any>('/orders', 'POST', orderPayload);

      // 2. Open Secure Payment Simulator
      setPayStep('PROCESSING');
      
      // Simulate Razorpay secure gateway loading (1500ms)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. Post Payment to Backend
      await apiRequest<any>('/payments', 'POST', {
        orderId: createdOrder.id,
        amount: total,
        method: payMethod === 'CARD' ? 'CARD' : (payMethod === 'CASH' ? 'CASH' : 'UPI')
      });

      // 4. Finalize Checkout
      setPayStep('SUCCESS');
      clearCart();
      showToast('Order placed successfully!', 'success');

      // Redirect to Order tracking screen with orderId
      setTimeout(() => {
        router.push(`/orders?orderId=${createdOrder.id}`);
      }, 1200);

    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
      setPayStep('DETAILS');
      setLoading(false);
      showToast('Order creation failed', 'error');
    }
  };

  if (cartItems.length === 0 && payStep !== 'SUCCESS') {
    return (
      <div className="bg-[#0D0B08] min-h-screen text-white flex items-center justify-center px-4 py-24 relative overflow-hidden">
        {/* Background design lattices */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full text-brand-gold" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <pattern id="check-empty-jali" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="0.8" fill="currentColor" />
            </pattern>
            <rect width="100" height="100" fill="url(#check-empty-jali)" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md w-full bg-brand-charcoal border border-white/8 p-12 rounded-3xl text-center space-y-6 shadow-2xl"
        >
          <h2 className="font-serif text-3xl font-bold text-white">No Items to Checkout</h2>
          <p className="text-xs text-white/40 leading-relaxed font-light">
            You don&apos;t have any signature culinary selections in your cart to finalize.
          </p>
          <MagneticButton>
            <Link 
              href="/menu" 
              className="inline-block bg-brand-terracotta hover:bg-brand-terracotta-dark text-white px-8 py-4 rounded-sm tracking-widest uppercase text-xs font-bold transition-all w-full"
            >
              Browse Menu
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0B08] text-white min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Background design lattices */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full text-brand-gold" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="checkout-jali" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="0.6" fill="currentColor" />
          </pattern>
          <rect width="100" height="100" fill="url(#checkout-jali)" />
        </svg>
      </div>

      {/* Payment simulated modals */}
      <AnimatePresence>
        {payStep === 'PROCESSING' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="bg-brand-charcoal border border-white/8 max-w-sm w-full p-8 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none" />
              <Loader className="w-12 h-12 text-brand-gold animate-spin mx-auto stroke-[1.5]" />
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-white">Processing Payment</h3>
                <p className="text-xs text-white/40 leading-relaxed font-light">UPI / Card transaction routing through Razorpay secure gateway...</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-green-400 bg-green-500/10 py-2.5 rounded-xl border border-green-500/15">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-semibold uppercase tracking-wider text-[9px]">PCI-DSS Secured SSL</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {payStep === 'SUCCESS' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[9998] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-brand-charcoal border border-white/8 max-w-sm w-full p-8 rounded-3xl text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-400 border border-green-500/20">
                <ShieldCheck className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-3xl font-bold text-white">Payment Success</h3>
                <p className="text-xs text-white/45 leading-relaxed font-light">Redirecting to live order status screen...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        
        {/* Back Link */}
        <Link href="/cart" className="inline-flex items-center gap-2 text-white/50 hover:text-brand-gold mb-10 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">Back to Cart</span>
        </Link>

        <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-12">
          Secure Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Checkout Details Form */}
          <div className="lg:col-span-2 bg-brand-charcoal border border-white/8 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6 relative">
            <div className="absolute top-0 left-0 w-32 h-32 bg-brand-gold/2 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="font-serif text-2xl font-bold text-white pb-3 border-b border-white/5 mb-6">
              Contact & Delivery
            </h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/15 p-4 flex items-center space-x-3 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-xs text-red-200">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-2 font-semibold">
                  Full Name
                </label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0D0B08] border border-white/8 px-4 py-3.5 rounded-xl text-xs text-white/80 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 transition-all"
                  placeholder="Rahul Sharma"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-2 font-semibold">
                  Phone Number
                </label>
                <input 
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0D0B08] border border-white/8 px-4 py-3.5 rounded-xl text-xs text-white/80 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 transition-all"
                  placeholder="+91 98100 12345"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-2 font-semibold">
                Email Address
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0D0B08] border border-white/8 px-4 py-3.5 rounded-xl text-xs text-white/80 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 transition-all"
                placeholder="rahul@gmail.com"
              />
            </div>

            {orderType === 'DELIVERY' ? (
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-2 font-semibold">
                  Delivery Address (Gurgaon Only)
                </label>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0D0B08] border border-white/8 px-4 py-3.5 rounded-xl text-xs text-white/80 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 transition-all placeholder:text-white/10"
                  placeholder="Flat number, Building, Phase, Sector, Landmark..."
                />
              </div>
            ) : orderType === 'DINE_IN' ? (
              <div className="bg-[#0D0B08] border border-white/8 p-5 rounded-2xl">
                <span className="text-[10px] uppercase tracking-wider text-white/40 block font-semibold">Guest Dining Location</span>
                <span className="font-serif text-3xl font-bold text-brand-gold mt-1.5 block">
                  Table {tableNumber || '1 (Default)'}
                </span>
                <p className="text-[10px] text-white/30 mt-1 font-light leading-relaxed">This order is tagged directly to table {tableNumber || 1} for waiter service.</p>
              </div>
            ) : null}

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-2 font-semibold">
                Special Requests / Delivery Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-[#0D0B08] border border-white/8 px-4 py-3.5 rounded-xl text-xs text-white/80 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 transition-all placeholder:text-white/10"
                placeholder="E.g., Ring bell, make main course mild spicy..."
              />
            </div>

          </div>

          {/* Payment & Breakdown summary */}
          <div className="space-y-6">
            
            {/* Pay selection */}
            <div className="bg-brand-charcoal border border-white/8 p-8 rounded-3xl shadow-2xl space-y-4 relative">
              <h3 className="font-serif text-2xl font-bold text-white pb-3 border-b border-white/5">
                Payment Option
              </h3>
              
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setPayMethod('UPI')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-xs uppercase tracking-wider font-bold ${
                    payMethod === 'UPI' 
                      ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' 
                      : 'border-white/8 text-white/50 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5" />
                    <span>Instant UPI</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod('CARD')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-xs uppercase tracking-wider font-bold ${
                    payMethod === 'CARD' 
                      ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' 
                      : 'border-white/8 text-white/50 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5" />
                    <span>Credit / Debit Card</span>
                  </span>
                </button>

                {orderType !== 'DELIVERY' && (
                  <button
                    type="button"
                    onClick={() => setPayMethod('CASH')}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-xs uppercase tracking-wider font-bold ${
                      payMethod === 'CASH' 
                        ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' 
                        : 'border-white/8 text-white/50 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center space-x-3">
                      <Wallet className="w-5 h-5" />
                      <span>Cash at Counter</span>
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Final checkout panel */}
            <div className="bg-brand-charcoal border border-white/8 p-8 rounded-3xl shadow-2xl space-y-6">
              <h3 className="font-serif text-2xl font-bold text-white pb-3 border-b border-white/5">
                Summary
              </h3>
              
              <div className="space-y-3 text-xs text-white/50 font-light">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="text-white/80">₹{Math.round(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Tax (5%)</span>
                  <span className="text-white/80">₹{Math.round(tax)}</span>
                </div>
                {orderType === 'DELIVERY' && (
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="text-white/80">₹{Math.round(deliveryCharge)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-brand-gold text-base pt-3 border-t border-white/5">
                  <span>Total Due</span>
                  <span>₹{Math.round(total)}</span>
                </div>
              </div>

              <MagneticButton>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-terracotta hover:bg-brand-terracotta-dark text-white uppercase text-xs tracking-widest font-bold py-4.5 rounded-sm transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg shadow-brand-terracotta/25"
                >
                  <span>{loading ? 'Processing...' : 'Place Order & Pay'}</span>
                </button>
              </MagneticButton>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
