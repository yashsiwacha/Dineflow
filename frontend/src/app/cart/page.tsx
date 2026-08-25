'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../../lib/hooks/useCart';
import { useToast } from '../../components/Toast';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from '../../components/MagneticButton';

export default function Cart() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    tax, 
    deliveryCharge, 
    total, 
    orderType, 
    setOrderType 
  } = useCart();
  const { showToast } = useToast();

  const handleRemove = (itemId: string, itemName: string) => {
    removeFromCart(itemId);
    showToast(`${itemName} removed from order`, 'cart');
  };

  const handleQtyChange = (itemId: string, newQty: number, itemName: string) => {
    if (newQty < 1) return;
    updateQuantity(itemId, newQty);
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#0D0B08] min-h-screen text-white flex items-center justify-center px-4 py-24 relative overflow-hidden">
        {/* Background design lattices */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full text-brand-gold" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <pattern id="cart-empty-jali" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="0.8" fill="currentColor" />
            </pattern>
            <rect width="100" height="100" fill="url(#cart-empty-jali)" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md w-full bg-brand-charcoal border border-white/8 p-12 rounded-3xl text-center space-y-6 shadow-2xl"
        >
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-brand-gold border border-white/5">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-white">Your Cart is Empty</h2>
          <p className="text-xs text-white/40 leading-relaxed font-light">
            You haven&apos;t added any signature creations to your order yet. Explore our modern Indian selection.
          </p>
          <MagneticButton>
            <Link 
              href="/menu" 
              className="inline-block bg-brand-terracotta hover:bg-brand-terracotta-dark text-white px-8 py-4 rounded-sm tracking-widest uppercase text-xs font-bold transition-all w-full shadow-lg shadow-brand-terracotta/25"
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
          <pattern id="cart-jali" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="0.6" fill="currentColor" />
          </pattern>
          <rect width="100" height="100" fill="url(#cart-jali)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-12">
          Your Order Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <motion.div 
                  key={item.menuItemId} 
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-brand-charcoal border border-white/8 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-5 shadow-2xl relative"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/2 rounded-full blur-2xl pointer-events-none" />

                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/5 bg-black">
                    <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                  </div>

                  {/* Details */}
                  <div className="flex-grow text-center sm:text-left space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <h3 className="font-serif text-xl font-bold text-white leading-tight">
                        {item.name}
                      </h3>
                      <span className="font-bold text-brand-gold text-base">
                        ₹{Math.round(item.price * item.quantity)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start">
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        item.isVegetarian ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'border-red-400/20 text-red-400 bg-red-500/10'
                      }`}>
                        {item.isVegetarian ? 'VEG' : 'NON-VEG'}
                      </span>
                      {item.specialInstructions && (
                        <span className="text-[10px] text-white/35 italic">
                          Note: {item.specialInstructions}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-3">
                    {/* Quantity picker */}
                    <div className="flex items-center border border-white/8 rounded-xl bg-[#0D0B08] p-1">
                      <button 
                        onClick={() => handleQtyChange(item.menuItemId, item.quantity - 1, item.name)}
                        className="p-1.5 text-white/40 hover:text-brand-gold transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-bold text-white text-xs w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleQtyChange(item.menuItemId, item.quantity + 1, item.name)}
                        className="p-1.5 text-white/40 hover:text-brand-gold transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Remove button */}
                    <button 
                      onClick={() => handleRemove(item.menuItemId, item.name)}
                      className="p-2 text-white/30 hover:text-red-400 hover:border-red-400/30 transition-colors border border-white/8 rounded-xl hover:bg-red-500/5"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>

            <Link href="/menu" className="inline-flex items-center gap-2 text-white/40 hover:text-brand-gold transition-colors uppercase tracking-[0.2em] text-[10px] font-bold pt-4 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Add More Items</span>
            </Link>
          </div>

          {/* Cart Summary */}
          <div className="bg-brand-charcoal border border-white/8 p-8 rounded-3xl shadow-2xl space-y-6 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/2 rounded-full blur-3xl pointer-events-none" />

            <h2 className="font-serif text-2xl font-bold text-white pb-3 border-b border-white/5">
              Order Summary
            </h2>

            {/* Order Type Toggle */}
            <div className="space-y-3">
              <label className="block text-[10px] uppercase tracking-wider text-white/40 font-semibold">
                Order Type
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['DINE_IN', 'TAKEAWAY', 'DELIVERY'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`py-2 px-1 rounded-lg text-[10px] uppercase tracking-wider font-semibold transition-all ${
                      orderType === type 
                        ? 'bg-brand-terracotta text-white' 
                        : 'bg-[#0D0B08] border border-white/8 text-white/60 hover:border-white/20'
                    }`}
                  >
                    {type.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 pt-4 border-t border-white/5 text-xs text-white/50 font-light">
              <div className="flex justify-between">
                <span>Subtotal</span>
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
                <span>Total Amount</span>
                <span>₹{Math.round(total)}</span>
              </div>
            </div>

            {/* Submit Action */}
            <MagneticButton>
              <Link 
                href="/checkout"
                className="w-full bg-brand-terracotta hover:bg-brand-terracotta-dark text-white uppercase text-xs tracking-widest font-bold py-4.5 rounded-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-terracotta/20"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </MagneticButton>
          </div>

        </div>

      </div>
    </div>
  );
}
