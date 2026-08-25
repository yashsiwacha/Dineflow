'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '../../../lib/api';
import { useCart, CartItem } from '../../../lib/hooks/useCart';
import { useToast } from '../../../components/Toast';
import { Flame, ArrowLeft, Plus, Minus, ShoppingCart, Loader, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import MagneticButton from '../../../components/MagneticButton';

interface MenuItem {
  id: string;
  menuCategoryId: string;
  name: string;
  description: string;
  price: number;
  isVegetarian: boolean;
  spiceLevel: number;
  allergens: string[];
  isAvailable: boolean;
  imageUrl: string;
}

export default function DishDetails() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const id = params?.['id'] as string;

  const [dish, setDish] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (!id) return;

    async function fetchDish() {
      try {
        setLoading(true);
        const data = await apiRequest<MenuItem>(`/menu/items/${id}`);
        setDish(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dish details.');
      } finally {
        setLoading(false);
      }
    }
    fetchDish();
  }, [id]);

  const handleAddToCart = () => {
    if (!dish) return;

    const cartPayload: Omit<CartItem, 'quantity'> = {
      menuItemId: dish.id,
      name: dish.name,
      price: dish.price,
      isVegetarian: dish.isVegetarian,
      imageUrl: dish.imageUrl
    };
    if (instructions) {
      cartPayload.specialInstructions = instructions;
    }

    // Add multiple quantities
    for (let i = 0; i < qty; i++) {
      addToCart(cartPayload);
    }

    showToast(`${qty}x ${dish.name} added to cart`, 'cart');
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0B08] flex flex-col justify-center items-center text-brand-gold space-y-4">
        <Loader className="w-10 h-10 animate-spin text-brand-terracotta" />
        <span className="text-xs tracking-[0.25em] uppercase font-light">Sourcing ingredients...</span>
      </div>
    );
  }

  if (error || !dish) {
    return (
      <div className="min-h-screen bg-[#0D0B08] text-white flex flex-col justify-center items-center px-4 py-24 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-200 font-light text-base mb-8 max-w-sm">{error || 'Dish not found.'}</p>
        <Link href="/menu" className="inline-flex items-center space-x-2 text-brand-gold border border-brand-gold/30 hover:border-brand-gold px-6 py-3 rounded-sm transition-all text-xs uppercase tracking-wider font-semibold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0B08] text-white min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Background design lattices */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full text-brand-gold" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dish-jali" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="0.6" fill="currentColor" />
            <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="0.15" fill="none" />
          </pattern>
          <rect width="100" height="100" fill="url(#dish-jali)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
        
        {/* Back Link */}
        <Link href="/menu" className="inline-flex items-center gap-2 text-white/50 hover:text-brand-gold mb-10 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">Back to Menu</span>
        </Link>

        {/* Details Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-brand-charcoal border border-white/8 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-48 h-48 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[340px] sm:h-[420px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-black"
          >
            <img 
              src={dish.imageUrl} 
              alt={dish.name} 
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 ease-out" 
            />
            {/* Indicators */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[9px] uppercase tracking-[0.18em] font-bold bg-black/60 backdrop-blur-sm border ${
                dish.isVegetarian ? 'border-green-500/40 text-green-400' : 'border-red-400/40 text-red-400'
              }`}>
                {dish.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            </div>
            {!dish.isAvailable && (
              <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
                <span className="bg-white text-brand-charcoal text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-sm">
                  Sold Out
                </span>
              </div>
            )}
          </motion.div>

          {/* Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="border-b border-white/5 pb-5"
            >
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
                {dish.name}
              </h1>
              <span className="text-2xl font-bold text-brand-gold mt-3 block">
                ₹{Math.round(dish.price)}
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/50 text-sm font-light leading-relaxed"
            >
              {dish.description}
            </motion.p>

            {/* Spec details */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4 pt-2"
            >
              {dish.spiceLevel > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Spice Level:</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(s => (
                      <Flame key={s} className={`w-4 h-4 ${s <= dish.spiceLevel ? 'text-brand-terracotta fill-brand-terracotta' : 'text-white/10'}`} />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3 text-xs">
                <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold mt-0.5">Allergens:</span>
                <span className="text-white/70 font-light">
                  {dish.allergens && dish.allergens.length > 0 ? dish.allergens.join(', ') : 'Allergen free'}
                </span>
              </div>
            </motion.div>

            {/* Kitchen note */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-2"
            >
              <label className="block text-[10px] uppercase tracking-wider text-white/40 font-semibold">
                Special Instructions
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                className="w-full bg-[#0D0B08] border border-white/8 px-4 py-3 rounded-xl text-xs text-white/85 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 transition-all placeholder:text-white/15"
                placeholder="E.g., No onion/garlic, extra chili, milk allergy..."
              />
            </motion.div>

            {/* Actions section */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="pt-6 border-t border-white/5 flex items-center gap-5"
            >
              {/* Quantity Picker */}
              <div className="flex items-center border border-white/8 rounded-xl bg-[#0D0B08] p-1.5">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2 text-white/40 hover:text-brand-gold transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-white text-sm w-8 text-center">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="p-2 text-white/40 hover:text-brand-gold transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add Button */}
              {dish.isAvailable ? (
                <MagneticButton className="flex-grow">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-brand-terracotta hover:bg-brand-terracotta-dark text-white uppercase text-xs tracking-widest font-bold py-4 rounded-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-terracotta/25"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Order</span>
                  </button>
                </MagneticButton>
              ) : (
                <span className="flex-grow text-center text-red-400 font-bold uppercase tracking-widest py-4 border border-dashed border-red-500/20 rounded-xl bg-red-500/5 text-xs">
                  Sold Out
                </span>
              )}
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
