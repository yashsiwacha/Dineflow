'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '../../../lib/hooks/useCart';
import { apiRequest } from '../../../lib/api';
import { ShoppingBag, ArrowRight, Loader, Check, Flame } from 'lucide-react';
import Link from 'next/link';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isVegetarian: boolean;
  spiceLevel: number;
  imageUrl: string;
}

export default function TableLanding() {
  const params = useParams();
  const router = useRouter();
  const { setTableNumber, setOrderType, addToCart, cartItems } = useCart();
  const tableNum = parseInt(params?.['tableNumber'] as string, 10);

  const [signatures, setSignatures] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isNaN(tableNum)) {
      setTableNumber(tableNum);
      setOrderType('DINE_IN');
    }
  }, [tableNum, setTableNumber, setOrderType]);

  useEffect(() => {
    async function fetchSignatures() {
      try {
        setLoading(true);
        const data = await apiRequest<MenuItem[]>('/menu/items?availableOnly=true');
        // Filter a few signature items
        const selected = data.filter(item => 
          item.name.includes('Dal Makhani') || 
          item.name.includes('Butter Chicken') || 
          item.name.includes('Truffle') ||
          item.name.includes('Rasmalai')
        );
        setSignatures(selected.slice(0, 3));
      } catch (e) {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    fetchSignatures();
  }, []);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-brand-cream-light min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8 text-center">
        
        {/* Splash Info */}
        <div className="bg-brand-cream border border-brand-cream-dark p-8 sm:p-12 rounded-sm shadow-sm space-y-6">
          <div className="w-16 h-16 bg-brand-terracotta/10 rounded-full flex items-center justify-center mx-auto text-brand-terracotta">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-brand-terracotta font-semibold">Welcome to DineFlow</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-charcoal">
              Table {tableNum || 1}
            </h1>
            <div className="h-0.5 w-16 bg-brand-terracotta mx-auto mt-2"></div>
          </div>
          
          <p className="text-sm text-brand-charcoal/70 leading-relaxed font-light max-w-md mx-auto">
            Scan successful. You can now browse our digital menu, order directly from your device, and checkout. Your food will be brought directly to Table {tableNum || 1}.
          </p>

          <Link
            href="/menu"
            className="inline-flex items-center justify-center space-x-2 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white px-8 py-4 rounded-sm uppercase tracking-wider text-xs font-semibold shadow-sm w-full sm:w-auto"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Signature Dishes Recommendations */}
        <div className="text-left space-y-4">
          <h2 className="font-serif text-2xl font-bold text-brand-charcoal px-2">Chef's Suggestions</h2>
          
          {loading ? (
            <div className="flex justify-center py-6 text-brand-terracotta">
              <Loader className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {signatures.map(item => (
                <div 
                  key={item.id} 
                  className="bg-brand-cream border border-brand-cream-dark p-4 rounded-sm flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-sm border border-brand-cream-dark shrink-0" 
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-serif font-bold text-brand-charcoal">{item.name}</h4>
                        <span className={`w-2.5 h-2.5 rounded-full border ${item.isVegetarian ? 'bg-green-500 border-green-700' : 'bg-red-500 border-red-700'}`}></span>
                      </div>
                      <p className="text-[10px] text-brand-charcoal/60 line-clamp-1 mt-0.5">{item.description}</p>
                      <span className="text-xs font-semibold text-brand-terracotta block mt-1">₹{item.price}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart({
                      menuItemId: item.id,
                      name: item.name,
                      price: item.price,
                      isVegetarian: item.isVegetarian,
                      imageUrl: item.imageUrl
                    })}
                    className="bg-brand-charcoal hover:bg-brand-terracotta text-brand-cream px-3 py-2 rounded-sm text-xs font-bold transition-colors shrink-0"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky basket preview */}
        {totalCartCount > 0 && (
          <div className="sticky bottom-6 bg-brand-charcoal text-brand-cream p-4 rounded-sm shadow-xl flex items-center justify-between border border-brand-charcoal-muted animate-in fade-in duration-300">
            <div className="text-left">
              <span className="text-xs text-brand-cream/60">Shopping Basket</span>
              <span className="font-semibold block text-sm">{totalCartCount} items selected</span>
            </div>
            <Link 
              href="/cart"
              className="bg-brand-terracotta hover:bg-brand-terracotta-dark text-white px-5 py-2.5 rounded-sm uppercase text-xs tracking-wider font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
