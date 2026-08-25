import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, Instagram, Facebook, Utensils } from 'lucide-react';

const navLinks = [
  { label: 'Menu', href: '/menu' },
  { label: 'Reservations', href: '/reservations' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Our Heritage', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white" aria-label="Site footer">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand column */}
          <div className="md:col-span-4">
            <div className="flex flex-col mb-6">
              <span className="font-serif text-[1.75rem] font-bold tracking-[0.06em] text-white leading-none">
                DINEFLOW
              </span>
              <span className="text-[9px] tracking-[0.28em] uppercase text-brand-gold font-medium mt-0.5">
                Gurgaon, NCR
              </span>
            </div>
            <p className="text-white/40 text-sm font-light leading-relaxed max-w-xs">
              Modern Indian gastronomy meets seamless digital hospitality. Experience slow-cooked heritage, reimagined.
            </p>

            {/* Social */}
            <div className="flex gap-3 mt-7">
              <a
                href="#"
                aria-label="DineFlow on Instagram"
                className="w-9 h-9 bg-white/8 hover:bg-brand-gold/20 rounded-lg flex items-center justify-center text-white/40 hover:text-brand-gold transition-all duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="DineFlow on Facebook"
                className="w-9 h-9 bg-white/8 hover:bg-brand-gold/20 rounded-lg flex items-center justify-center text-white/40 hover:text-brand-gold transition-all duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="DineFlow food posts"
                className="w-9 h-9 bg-white/8 hover:bg-brand-gold/20 rounded-lg flex items-center justify-center text-white/40 hover:text-brand-gold transition-all duration-200"
              >
                <Utensils className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav links */}
          <div className="md:col-span-3">
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-semibold mb-5">Explore</h3>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 hover:text-white transition-colors duration-150 font-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact info */}
          <div className="md:col-span-5">
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-semibold mb-5">Find Us</h3>
            <div className="flex flex-col gap-4">
              <address className="not-italic flex items-start gap-3 text-sm text-white/55 font-light">
                <MapPin className="w-4 h-4 text-brand-gold/70 shrink-0 mt-0.5 stroke-[1.5]" aria-hidden="true" />
                <span>DLF CyberCity, Phase III<br />Gurgaon, Haryana 122002</span>
              </address>
              <a href="tel:+911244000000" className="flex items-center gap-3 text-sm text-white/55 hover:text-white transition-colors font-light">
                <Phone className="w-4 h-4 text-brand-gold/70 shrink-0 stroke-[1.5]" aria-hidden="true" />
                <span>+91 124 400 0000</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-white/55 font-light">
                <Clock className="w-4 h-4 text-brand-gold/70 shrink-0 mt-0.5 stroke-[1.5]" aria-hidden="true" />
                <div>
                  <p>Mon – Thu: 12:00 PM – 11:00 PM</p>
                  <p>Fri – Sun: 12:00 PM – 12:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs font-light">
            © {new Date().getFullYear()} DineFlow Restaurant. All rights reserved.
          </p>
          <nav aria-label="Legal links" className="flex gap-5">
            {legalLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-white/25 hover:text-white/50 text-xs font-light transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
