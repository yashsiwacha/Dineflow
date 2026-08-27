'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '../../lib/api';
import { useCart } from '../../lib/hooks/useCart';
import { useToast } from '../../components/Toast';
import { Search, Flame, ShoppingCart, Leaf, AlertCircle, X, SlidersHorizontal } from 'lucide-react';

interface Category { id: string; name: string; }
interface MenuItem {
  id: string; menuCategoryId: string; name: string;
  description: string; price: number; isVegetarian: boolean;
  spiceLevel: number; allergens: string[]; isAvailable: boolean; imageUrl: string;
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-brand-cream-dark rounded-2xl overflow-hidden">
      <div className="skeleton h-56 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-3.5 w-full" />
        <div className="skeleton h-3.5 w-3/5" />
        <div className="flex justify-between items-center pt-1">
          <div className="skeleton h-5 w-16" />
          <div className="skeleton h-9 w-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ── Card ── */
function DishCard({ item, onAdd }: { item: MenuItem; onAdd: () => void }) {
  const [adding, setAdding] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    el.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(4px)`;
    el.style.transition = 'transform 0.1s ease';
  }, []);

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(700px) rotateY(0) rotateX(0) translateZ(0)';
    ref.current.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
  }, []);

  const handleAdd = async () => {
    if (!item.isAvailable || adding) return;
    setAdding(true);
    onAdd();
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className="h-full will-change-transform">
      <article className="group h-full bg-white border border-brand-cream-dark rounded-2xl overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-black/8 transition-shadow duration-300">
        {/* Image */}
        <Link href={`/dish/${item.id}`} className="relative h-52 block overflow-hidden shrink-0" tabIndex={-1} aria-hidden="true">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          {/* Veg dot */}
          <div
            aria-label={item.isVegetarian ? 'Vegetarian' : 'Non-vegetarian'}
            className={`absolute top-3 right-3 w-5 h-5 rounded-sm border-2 bg-white flex items-center justify-center ${item.isVegetarian ? 'border-green-500' : 'border-red-400'}`}
          >
            <span className={`w-2 h-2 rounded-full ${item.isVegetarian ? 'bg-green-600' : 'bg-red-500'}`} />
          </div>

          {/* Price */}
          <span className="absolute bottom-3 left-3 font-bold text-white text-lg drop-shadow-lg">₹{Math.round(item.price)}</span>

          {/* Sold out overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
              <span className="bg-white/90 text-brand-charcoal text-[10px] uppercase tracking-[0.18em] font-bold px-3 py-1.5 rounded-sm">
                Sold Out
              </span>
            </div>
          )}
        </Link>

        {/* Body */}
        <div className="p-5 flex flex-col flex-1">
          <Link href={`/dish/${item.id}`} className="group/title">
            <h3 className="font-serif text-xl font-bold text-brand-charcoal group-hover/title:text-brand-terracotta transition-colors duration-200 leading-tight mb-1.5">
              {item.name}
            </h3>
          </Link>
          <p className="text-brand-charcoal/70 text-xs font-normal leading-relaxed line-clamp-2 flex-1 mb-3">
            {item.description}
          </p>

          {/* Spice */}
          {item.spiceLevel > 0 && (
            <div className="flex items-center gap-1 mb-3" aria-label={`Spice level ${item.spiceLevel}`}>
              {[1,2,3].map(s => (
                <Flame key={s} className={`w-3.5 h-3.5 ${s <= item.spiceLevel ? 'text-brand-terracotta fill-brand-terracotta' : 'text-brand-charcoal/10'}`} />
              ))}
              <span className="text-[10px] text-brand-charcoal/60 ml-1 uppercase tracking-wide font-medium">
                {item.spiceLevel === 1 ? 'Mild' : item.spiceLevel === 2 ? 'Medium' : 'Spicy'}
              </span>
            </div>
          )}

          {/* Bottom */}
          <div className="pt-3 border-t border-brand-cream-dark flex items-center justify-between">
            <span className="text-[10px] text-brand-charcoal/60 font-medium truncate max-w-[60%]">
              {item.allergens?.length > 0
                ? `Contains: ${item.allergens.slice(0,2).join(', ')}${item.allergens.length > 2 ? '…' : ''}`
                : 'Allergen free'}
            </span>

            {item.isAvailable ? (
              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.88 }}
                aria-label={`Add ${item.name} to cart`}
                className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 overflow-hidden shrink-0 ${
                  adding
                    ? 'bg-green-600 text-white scale-110'
                    : 'bg-brand-charcoal hover:bg-brand-terracotta text-white hover:scale-105 hover:shadow-md hover:shadow-brand-terracotta/25'
                }`}
              >
                <AnimatePresence mode="wait">
                  {adding ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      className="text-sm font-bold"
                    >✓</motion.span>
                  ) : (
                    <motion.div key="cart" initial={{ scale: 1 }} exit={{ scale: 0 }}>
                      <ShoppingCart className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ) : (
              <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wider shrink-0">Unavailable</span>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

/* ── Page ── */
export default function Menu() {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems]   = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegOnly, setVegOnly]   = useState<boolean>(false);
  const [loading, setLoading]   = useState<boolean>(true);
  const [error, setError]       = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        const [catData, itemData] = await Promise.all([
          apiRequest<Category[]>('/menu/categories'),
          apiRequest<MenuItem[]>('/menu/items'),
        ]);
        setCategories(catData);
        setMenuItems(itemData);
      } catch {
        setError('Could not connect to the kitchen. The backend may be starting — please refresh.');
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchCat   = selectedCategory === 'ALL' || item.menuCategoryId === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchVeg   = !vegOnly || item.isVegetarian;
    return matchCat && matchSearch && matchVeg;
  });

  const handleAdd = (item: MenuItem) => {
    addToCart({ menuItemId: item.id, name: item.name, price: item.price, isVegetarian: item.isVegetarian, imageUrl: item.imageUrl });
    showToast(`${item.name} added to cart`, 'cart');
  };

  const clearSearch = () => setSearchQuery('');

  return (
    <div className="min-h-screen bg-brand-cream-light">

      {/* ── Page Header ── */}
      <div className="pt-32 pb-12 px-5 sm:px-8 lg:px-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-5 bg-brand-terracotta" />
            <span className="text-brand-terracotta text-[10px] uppercase tracking-[0.28em] font-semibold">DineFlow Kitchen</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-6xl md:text-7xl font-bold text-brand-charcoal leading-none">
                The Menu
              </h1>
              <p className="text-brand-charcoal/45 font-light mt-3 max-w-md text-sm leading-relaxed">
                Hand-crafted with stone-ground spices, slow woodfire charcoal, and modern presentation.
              </p>
            </div>
            {/* Search */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal/30" />
                <input
                  type="text"
                  role="searchbox"
                  aria-label="Search menu"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-brand-cream-dark pl-10 pr-9 py-3 rounded-xl text-sm placeholder:text-brand-charcoal/30 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 transition-all"
                  placeholder="Search dishes..."
                />
                {searchQuery && (
                  <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-charcoal/30 hover:text-brand-charcoal/60" aria-label="Clear search">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(v => !v)}
                className={`p-3 rounded-xl border transition-all duration-200 ${showFilters ? 'bg-brand-charcoal text-white border-brand-charcoal' : 'bg-white border-brand-cream-dark text-brand-charcoal/60 hover:border-brand-charcoal/30'}`}
                aria-label="Toggle filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Filter drawer ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden px-5 sm:px-8 lg:px-10"
          >
            <div className="max-w-7xl mx-auto pb-6">
              <div className="bg-white border border-brand-cream-dark rounded-2xl p-5 flex flex-wrap items-center gap-3">
                <span className="text-xs text-brand-charcoal/40 uppercase tracking-[0.15em] font-semibold w-full md:w-auto">Filters:</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVegOnly(!vegOnly)}
                  role="switch"
                  aria-checked={vegOnly}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-semibold border transition-all duration-200 ${
                    vegOnly ? 'bg-green-600 text-white border-green-600 shadow-sm' : 'bg-brand-cream border-brand-cream-dark text-brand-charcoal/60 hover:border-green-400'
                  }`}
                >
                  <Leaf className="w-3.5 h-3.5" />
                  Vegetarian Only
                </motion.button>
                {(vegOnly || searchQuery || selectedCategory !== 'ALL') && (
                  <button
                    onClick={() => { setVegOnly(false); setSearchQuery(''); setSelectedCategory('ALL'); }}
                    className="text-xs text-brand-charcoal/40 hover:text-brand-terracotta transition-colors underline underline-offset-2"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sticky category bar ── */}
      <div className="sticky top-20 z-30 glass border-b border-brand-cream-dark/50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {['ALL', ...categories.map(c => c.id)].map((id) => {
            const label = id === 'ALL' ? 'All' : (categories.find(c => c.id === id)?.name ?? id);
            const active = selectedCategory === id;
            return (
              <motion.button
                key={id}
                onClick={() => setSelectedCategory(id)}
                whileTap={{ scale: 0.95 }}
                className={`relative shrink-0 px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-semibold border transition-colors duration-200 ${
                  active
                    ? 'bg-brand-charcoal text-white border-brand-charcoal'
                    : 'bg-white border-brand-cream-dark text-brand-charcoal/55 hover:border-brand-charcoal/30 hover:text-brand-charcoal'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="active-cat"
                    className="absolute inset-0 bg-brand-charcoal rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Count bar ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-7 pb-2">
        <AnimatePresence mode="wait">
          {!loading && !error && (
            <motion.p
              key={filteredItems.length}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-brand-charcoal/35 text-xs tracking-wide"
            >
              {filteredItems.length} dish{filteredItems.length !== 1 ? 'es' : ''}
              {searchQuery && <span className="text-brand-terracotta/70"> matching &ldquo;{searchQuery}&rdquo;</span>}
              {vegOnly && <span className="text-green-600/70"> · vegetarian</span>}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pb-28 pt-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <motion.div
            role="alert"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <motion.div
              className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-5"
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <AlertCircle className="w-7 h-7 text-red-400 stroke-[1.5]" />
            </motion.div>
            <h3 className="font-serif text-2xl font-bold text-brand-charcoal mb-2">Kitchen Offline</h3>
            <p className="text-brand-charcoal/40 text-sm font-light max-w-xs leading-relaxed mb-7">{error}</p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => window.location.reload()}
              className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-terracotta border border-brand-terracotta/30 hover:border-brand-terracotta hover:bg-brand-terracotta/5 px-7 py-3 rounded-sm transition-all"
            >
              Retry
            </motion.button>
          </motion.div>
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-16 h-16 bg-brand-cream rounded-2xl flex items-center justify-center mb-5 border border-brand-cream-dark">
              <Search className="w-6 h-6 text-brand-charcoal/25 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-brand-charcoal mb-2">No dishes found</h3>
            <p className="text-brand-charcoal/35 text-sm font-light mb-6">Try adjusting your search or category filter.</p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); setVegOnly(false); }}
              className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-charcoal/50 hover:text-brand-charcoal transition-colors"
            >
              Clear filters
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -8 }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.24), ease: [0.16, 1, 0.3, 1] }}
                >
                  <DishCard item={item} onAdd={() => handleAdd(item)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
