'use client';
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, ShoppingBag } from 'lucide-react';

interface Toast { id: number; message: string; type: 'cart' | 'success' | 'error'; }
interface ToastCtx { showToast: (message: string, type?: Toast['type']) => void; }

const ToastContext = createContext<ToastCtx>({ showToast: () => {} });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((message: string, type: Toast['type'] = 'cart') => {
    const id = ++counter.current;
    setToasts(prev => [...prev.slice(-3), { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9998] flex flex-col gap-2 pointer-events-none" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="pointer-events-auto flex items-center gap-3 bg-brand-charcoal text-white px-5 py-3.5 rounded-xl shadow-2xl shadow-black/20 border border-white/8 min-w-[220px]"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                t.type === 'cart' ? 'bg-brand-terracotta/20' :
                t.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {t.type === 'cart'
                  ? <ShoppingBag className="w-4 h-4 text-brand-terracotta" />
                  : <CheckCircle className="w-4 h-4 text-green-400" />
                }
              </div>
              <span className="text-sm font-light text-white/90 flex-1">{t.message}</span>
              <button
                onClick={() => setToasts(prev => prev.filter(tt => tt.id !== t.id))}
                className="text-white/30 hover:text-white/70 transition-colors ml-1"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
