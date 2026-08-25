import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import { ToastProvider } from '../components/Toast';
import { AuthProvider } from '../lib/hooks/useAuth';
import { CartProvider } from '../lib/hooks/useCart';

export const metadata: Metadata = {
  title: 'DineFlow — Good food. Zero friction.',
  description: 'Premium North Indian dining in Gurgaon. Order online, reserve tables, or dine-in with QR codes.',
  openGraph: {
    title: 'DineFlow — Good food. Zero friction.',
    description: "Premium Modern Indian dining in Gurgaon's DLF CyberCity.",
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-brand-cream-light text-brand-charcoal min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <CustomCursor />
              <Navbar />
              <main className="flex-grow" id="main-content">
                {children}
              </main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
