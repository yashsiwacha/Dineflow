'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/hooks/useAuth';
import { useCart } from '../lib/hooks/useCart';
import { ShoppingBag, User, Menu, X, LogOut, LayoutDashboard, ChefHat } from 'lucide-react';

const links = [
  { name: 'Menu', href: '/menu' },
  { name: 'Reservations', href: '/reservations' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <motion.nav
      aria-label="Main navigation"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-sm shadow-black/5' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex justify-between h-20 items-center">

          {/* Logo */}
          <Link href="/" aria-label="DineFlow home">
            <motion.div className="flex flex-col" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <span className={`font-serif text-[1.7rem] font-bold tracking-[0.05em] leading-none transition-colors duration-200 ${
                scrolled ? 'text-brand-charcoal' : 'text-white'
              }`}>
                DINEFLOW
              </span>
              <span className="text-[9px] tracking-[0.28em] uppercase text-brand-gold font-medium mt-0.5">
                Gurgaon
              </span>
            </motion.div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {links.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors duration-200 py-1 ${
                  scrolled
                    ? pathname === link.href ? 'text-brand-terracotta' : 'text-brand-charcoal/65 hover:text-brand-charcoal'
                    : pathname === link.href ? 'text-brand-gold' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-px left-0 right-0 h-px bg-current"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart */}
            <Link href="/cart" aria-label={`Cart: ${cartCount} items`}>
              <motion.div className="relative p-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ShoppingBag className={`w-5 h-5 stroke-[1.5] transition-colors ${scrolled ? 'text-brand-charcoal/70' : 'text-white/80'}`} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px] font-bold text-white bg-brand-terracotta rounded-full flex items-center justify-center"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'ADMIN' && (
                  <Link href="/admin" title="Admin" className={`p-2 transition-colors ${scrolled ? 'text-brand-charcoal/50 hover:text-brand-terracotta' : 'text-white/60 hover:text-white'}`}>
                    <LayoutDashboard className="w-4.5 h-4.5 stroke-[1.5]" />
                  </Link>
                )}
                {(user.role === 'KITCHEN' || user.role === 'ADMIN') && (
                  <Link href="/kitchen" title="Kitchen" className={`p-2 transition-colors ${scrolled ? 'text-brand-charcoal/50 hover:text-brand-terracotta' : 'text-white/60 hover:text-white'}`}>
                    <ChefHat className="w-4.5 h-4.5 stroke-[1.5]" />
                  </Link>
                )}
                <Link href="/profile" title="Profile" className={`p-2 transition-colors ${scrolled ? 'text-brand-charcoal/50 hover:text-brand-charcoal' : 'text-white/60 hover:text-white'}`}>
                  <User className="w-4.5 h-4.5 stroke-[1.5]" />
                </Link>
                <button onClick={logout} title="Sign out" className="p-2 text-brand-charcoal/30 hover:text-red-500 transition-colors">
                  <LogOut className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/login"
                  className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] font-semibold px-4 py-2.5 rounded-sm border transition-all duration-200 ${
                    scrolled
                      ? 'text-brand-charcoal border-brand-charcoal/25 hover:border-brand-terracotta hover:text-brand-terracotta'
                      : 'text-white border-white/25 hover:border-white/60 hover:bg-white/5'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Login
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/cart" aria-label={`Cart ${cartCount} items`} className="relative p-2">
              <ShoppingBag className={`w-5 h-5 stroke-[1.5] ${scrolled ? 'text-brand-charcoal' : 'text-white'}`} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px] font-bold text-white bg-brand-terracotta rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className={`p-2 ${scrolled ? 'text-brand-charcoal' : 'text-white'}`}
            >
              <AnimatePresence mode="wait">
                {mobileOpen
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X className="w-5 h-5" /></motion.div>
                  : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu className="w-5 h-5" /></motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden md:hidden glass border-t border-brand-cream-dark/40"
          >
            <nav className="px-5 pt-5 pb-8 flex flex-col gap-1" aria-label="Mobile navigation">
              {links.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center text-sm font-medium px-3 py-3 rounded-lg transition-colors ${
                      pathname === link.href
                        ? 'text-brand-terracotta bg-brand-terracotta/6'
                        : 'text-brand-charcoal hover:bg-brand-cream-dark/60'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-4 pt-4 border-t border-brand-charcoal/8">
                {user ? (
                  <div className="flex flex-col gap-1">
                    <Link href="/profile" className="flex items-center gap-3 text-sm font-medium px-3 py-3 text-brand-charcoal hover:bg-brand-cream-dark/60 rounded-lg">
                      <User className="w-4 h-4" /> My Profile & Orders
                    </Link>
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-3 w-full text-left text-sm font-medium px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-semibold bg-brand-charcoal text-brand-cream py-3.5 rounded-lg tracking-wider uppercase">
                    <User className="w-4 h-4" /> Login / Register
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
