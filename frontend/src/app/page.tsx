'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, MapPin, Award, Star, ChefHat, Leaf, Flame } from 'lucide-react';
import MagneticButton from '../components/MagneticButton';

/* ─── Animated counter ────────────────────────────────────────────────── */
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 2000;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(e * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Jali (lattice) SVG pattern ─────────────────────────────────────── */
function JaliPattern({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <pattern id="jali" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="1.2" fill="currentColor" opacity="0.35" />
        <path d="M0 10 H20 M10 0 V20" stroke="currentColor" strokeWidth="0.3" opacity="0.12" />
        <rect x="5" y="5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="0.4" opacity="0.1" fill="none" />
      </pattern>
      <rect width="80" height="80" fill="url(#jali)" />
    </svg>
  );
}

/* ─── Marquee ─────────────────────────────────────────────────────────── */
const marqueeItems = [
  'Dal Makhani', '✦', 'Butter Chicken', '✦', 'Truffle Paneer Tikka', '✦',
  'Seekh Kebab', '✦', 'Awadhi Biryani', '✦', 'Rasmalai Tres Leches', '✦',
  'Kulfi Falooda', '✦', 'Tandoori Pomfret', '✦', 'Nalli Nihari', '✦',
];

function MarqueeStrip() {
  const doubled = [...marqueeItems, ...marqueeItems];
  return (
    <div className="marquee-wrapper bg-brand-charcoal overflow-hidden py-4 border-y border-brand-gold/10" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className={`shrink-0 px-5 text-[11px] tracking-[0.2em] uppercase ${
            item === '✦' ? 'text-brand-gold text-xs' : 'text-white/30 font-light'
          }`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Floating dish badge ─────────────────────────────────────────────── */
function FloatingBadge({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute z-20 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' }}
        className="bg-brand-charcoal/90 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 shadow-2xl shadow-black/30"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ─── Data ────────────────────────────────────────────────────────────── */
const features = [
  { icon: Award, title: 'Royal Heritage', body: 'From 24-hour slow-cooked Dal Makhani to saffron-braised lamb shanks — honouring Awadhi and Punjabi culinary arts.' },
  { icon: Clock, title: 'Zero Friction', body: 'Table QR ordering, live order tracking, instant kitchen sync. Premium food without the usual wait.' },
  { icon: MapPin, title: 'DLF CyberCity', body: "Gurgaon's most elegant dining room — copper interiors, curated ambient lighting, and world-class hospitality." },
];

const highlights = [
  { tag: 'Starters',    name: 'Avocado Bhel',         price: '₹450', veg: true,  spice: 1, img: '/assets/food/starter_avocado_bhel.webp', sub: 'Premium street food twist' },
  { tag: 'Signature',   name: 'Slow-Cooked Dal Makhani', price: '₹520', veg: true, spice: 0, img: '/assets/food/main_dal_makhani.webp', sub: '24 hours over coal embers' },
  { tag: 'Main Course', name: 'Butter Chicken',        price: '₹695', veg: false, spice: 1, img: '/assets/food/main_butter_chicken.webp', sub: 'Rich satin tomato-cashew gravy' },
  { tag: 'Tandoor',     name: 'Truffle Paneer Tikka',  price: '₹595', veg: true,  spice: 0, img: '/assets/food/tandoor_malai_tikka.webp', sub: 'White truffle oil drizzle' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Food Critic, Delhi', quote: 'The most refined Indian dining in the NCR. Every dish is a story told in layers of flavour.' },
  { name: 'Arjun Mehta',  role: 'Michelin Guide India', quote: 'Dal Makhani that rivals the finest kitchens in Old Delhi. Simply exceptional.' },
  { name: 'Sneha Kapoor', role: 'Lifestyle Editorial', quote: 'DineFlow has reinvented what modern Indian hospitality can feel like.' },
];

/* ─── 3D tilt card ────────────────────────────────────────────────────── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 12;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 12;
    el.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg) scale3d(1.02,1.02,1.02)`;
    el.style.transition = 'transform 0.1s ease';
  }, []);
  const onLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(900px) rotateY(0) rotateX(0) scale3d(1,1,1)';
    ref.current.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)';
  }, []);
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────── */
export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY   = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOp  = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const { scrollYProgress: pageProgress } = useScroll();
  const progressScale = useSpring(pageProgress, { stiffness: 80, damping: 28 });

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-[#0D0B08] min-h-screen overflow-hidden">

      {/* ── Global progress bar ── */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2px] z-[9997] origin-left"
        style={{
          scaleX: progressScale,
          background: 'linear-gradient(90deg, #B45309, #D4AF37, #B45309)',
        }}
      />

      {/* ══════════════════════════════════════════════════════════
          HERO — full dark cinematic
      ══════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden bg-[#0D0B08]"
        aria-label="Hero"
      >
        {/* Parallax bg */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, scale: heroScale }}>
          <img
            src="/assets/food/main_dal_makhani.webp"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0D0B08]/92 via-[#0D0B08]/75 to-[#0D0B08]/88" />
        </motion.div>

        {/* Jali pattern overlay */}
        <JaliPattern className="absolute inset-0 w-full h-full text-brand-gold z-[1] pointer-events-none" />

        {/* Ambient glow orbs */}
        <div className="absolute inset-0 z-[2] pointer-events-none" aria-hidden="true">
          <motion.div
            className="absolute top-1/3 right-1/5 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/5 w-[350px] h-[350px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(180,83,9,0.08) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-40 pb-28"
          style={{ opacity: heroOp }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: headline */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 mb-7"
              >
                <div className="h-px w-10 bg-brand-gold" />
                <span className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-semibold">
                  Gurgaon&apos;s Premier Fine Dining
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[4.5rem] md:text-[6rem] lg:text-[7rem] font-bold text-white leading-[0.9] tracking-tight mb-8"
              >
                Good<br />
                food.{' '}
                <span className="text-gold-shimmer italic font-light block mt-1">
                  Zero friction.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-white/50 text-base font-light leading-relaxed max-w-md mb-10"
              >
                The evolution of North Indian gastronomy — slow-cooked heritage dishes,
                digital precision, and an atmosphere that feels like home.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <MagneticButton>
                  <Link
                    href="/menu"
                    className="group inline-flex items-center gap-2.5 bg-brand-terracotta text-white text-[11px] uppercase tracking-[0.22em] font-bold px-8 py-4 rounded-sm hover:bg-brand-terracotta-dark transition-colors shadow-lg shadow-brand-terracotta/25"
                  >
                    Order Online
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link
                    href="/reservations"
                    className="inline-flex items-center gap-2.5 border border-white/20 hover:border-brand-gold/50 text-white/75 hover:text-white text-[11px] uppercase tracking-[0.22em] font-semibold px-8 py-4 rounded-sm transition-all backdrop-blur-sm"
                  >
                    Reserve Table
                  </Link>
                </MagneticButton>
              </motion.div>
            </div>

            {/* Right: floating dish cards */}
            <div className="lg:col-span-5 relative h-[420px] hidden lg:block">
              {/* Main image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-3xl overflow-hidden border border-white/8"
              >
                <img src="/assets/food/main_dal_makhani.webp" alt="Signature Dal Makhani" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B08]/60 to-transparent" />
              </motion.div>

              {/* Floating stat badge — rating */}
              <FloatingBadge className="top-4 -left-8" delay={0.6}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-brand-gold/20 rounded-xl flex items-center justify-center">
                    <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-none">4.9</p>
                    <p className="text-white/35 text-[10px] mt-0.5">312 reviews</p>
                  </div>
                </div>
              </FloatingBadge>

              {/* Floating dish badge */}
              <FloatingBadge className="bottom-12 -right-6" delay={0.8}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-brand-terracotta/20 rounded-xl flex items-center justify-center">
                    <ChefHat className="w-4 h-4 text-brand-terracotta" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-none">24h Dal Makhani</p>
                    <p className="text-white/35 text-[10px] mt-0.5">Our signature creation</p>
                  </div>
                </div>
              </FloatingBadge>

              {/* Floating veg badge */}
              <FloatingBadge className="top-1/2 -right-10" delay={1.0}>
                <div className="flex items-center gap-2">
                  <Leaf className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-white/70 text-xs">31+ signature dishes</span>
                </div>
              </FloatingBadge>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
            className="mt-20 pt-8 border-t border-white/8 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { to: 24, suffix: 'h', label: 'Dal Makhani cook time' },
              { to: 31, suffix: '+', label: 'Signature dishes' },
              { to: 10, suffix: '', label: 'Private dining tables' },
              { to: 312, suffix: '+', label: 'Five-star reviews' },
            ].map(s => (
              <div key={s.label} className="flex flex-col">
                <span className="font-serif text-4xl font-bold text-white mb-1 tabular-nums">
                  <CountUp to={s.to} suffix={s.suffix} />
                </span>
                <span className="text-white/30 text-xs tracking-wide">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* Marquee */}
      <MarqueeStrip />

      {/* ══════════════════════════════════════════════════════════
          FEATURES — cream bg
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-brand-cream-light py-32 px-5 sm:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center max-w-xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-5 bg-brand-terracotta" />
              <span className="text-brand-terracotta text-[10px] uppercase tracking-[0.28em] font-semibold">
                The DineFlow Way
              </span>
              <div className="h-px w-5 bg-brand-terracotta" />
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-brand-charcoal">
              Heritage cuisine,<br />modern experience.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
              >
                <TiltCard className="h-full">
                  <div className={`h-full p-10 rounded-2xl border group transition-all duration-300 hover:shadow-2xl relative overflow-hidden ${
                    i === 1
                      ? 'bg-brand-charcoal border-brand-charcoal text-white'
                      : 'bg-white border-brand-cream-dark'
                  }`}>
                    {/* Jali watermark */}
                    <JaliPattern className={`absolute -bottom-4 -right-4 w-36 h-36 ${i === 1 ? 'text-white' : 'text-brand-terracotta'} opacity-40`} />

                    <motion.div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-8 ${i === 1 ? 'bg-white/8' : 'bg-brand-terracotta/8'}`}
                      whileHover={{ rotate: [0, -8, 8, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <f.icon className={`w-5 h-5 stroke-[1.5] ${i === 1 ? 'text-brand-gold' : 'text-brand-terracotta'}`} />
                    </motion.div>
                    <h3 className={`font-serif text-2xl font-bold mb-4 ${i === 1 ? 'text-white' : 'text-brand-charcoal'}`}>
                      {f.title}
                    </h3>
                    <p className={`text-sm leading-relaxed font-light ${i === 1 ? 'text-white/50' : 'text-brand-charcoal/55'}`}>
                      {f.body}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SIGNATURE DISH — dark split
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-brand-charcoal overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-stretch">
          <motion.div
            className="relative h-[460px] lg:h-auto overflow-hidden"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src="/assets/food/main_dal_makhani.webp"
              alt="Slow-cooked Dal Makhani"
              className="object-cover w-full h-full"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/20 to-transparent" />
            <motion.div
              className="absolute bottom-6 left-6 bg-brand-charcoal/85 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex gap-0.5 mb-1">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-brand-gold text-brand-gold" />)}
              </div>
              <p className="text-white/55 text-[11px]">4.9 · 312 reviews</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="py-20 lg:py-28 px-8 lg:pl-16 lg:pr-12 flex flex-col justify-center relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <JaliPattern className="absolute top-0 right-0 w-48 h-48 text-white opacity-20" />

            <div className="flex items-center gap-2 mb-5">
              <div className="h-px w-5 bg-brand-gold" />
              <span className="text-brand-gold text-[10px] uppercase tracking-[0.28em] font-semibold">Signature Creation</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              The Art of the<br />
              <span className="text-gold-shimmer italic font-light">24-Hour Dal Makhani</span>
            </h2>
            <p className="text-white/45 leading-relaxed font-light text-sm max-w-sm mb-10">
              Black lentils slow-simmered over coal embers for 24 full hours.
              A masterpiece of DLF CyberCity — thick, smoky, finished with cream and white butter.
            </p>

            <div className="flex gap-5 items-center flex-wrap mb-14">
              <MagneticButton>
                <Link href="/menu" className="group inline-flex items-center gap-2 text-brand-gold text-[11px] uppercase tracking-[0.2em] font-bold hover:text-white transition-colors">
                  Explore Full Menu
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>
              <div className="w-px h-4 bg-white/12" />
              <MagneticButton>
                <Link href="/reservations" className="group inline-flex items-center gap-2 text-white/35 text-[11px] uppercase tracking-[0.2em] font-semibold hover:text-white/70 transition-colors">
                  Book a Table
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>
            </div>

            <div className="pt-8 border-t border-white/8 grid grid-cols-3 gap-4">
              {[{ icon: ChefHat, text: 'In-house chefs' }, { icon: Leaf, text: '100% fresh daily' }, { icon: Award, text: 'Award winning' }].map(({ icon: Icon, text }) => (
                <motion.div key={text} className="flex flex-col items-center text-center gap-2" whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center hover:bg-brand-gold/10 transition-colors">
                    <Icon className="w-4 h-4 text-brand-gold stroke-[1.5]" />
                  </div>
                  <span className="text-white/30 text-[10px]">{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TONIGHT'S HIGHLIGHTS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-brand-cream-light py-32 px-5 sm:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px w-5 bg-brand-terracotta" />
                <span className="text-brand-terracotta text-[10px] uppercase tracking-[0.28em] font-semibold">Chef&apos;s Picks</span>
              </div>
              <h2 className="font-serif text-5xl md:text-6xl font-bold text-brand-charcoal leading-none">
                Tonight&apos;s<br />highlights
              </h2>
            </div>
            <MagneticButton>
              <Link href="/menu" className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-brand-charcoal/45 hover:text-brand-terracotta transition-colors">
                Full menu <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </MagneticButton>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((dish, idx) => (
              <motion.div
                key={dish.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.07, ease: 'easeOut' }}
              >
                <TiltCard>
                  <Link href="/menu" className="group block bg-white border border-brand-cream-dark rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-black/10 transition-shadow duration-400">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={dish.img}
                        alt={dish.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <span className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.18em] font-bold text-white/85 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {dish.tag}
                      </span>
                      <div className={`absolute top-3 right-3 w-5 h-5 rounded-sm border-2 bg-white flex items-center justify-center ${dish.veg ? 'border-green-500' : 'border-red-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${dish.veg ? 'bg-green-600' : 'bg-red-500'}`} />
                      </div>
                      <span className="absolute bottom-3 right-4 font-bold text-white text-lg drop-shadow-lg">{dish.price}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-xl font-bold text-brand-charcoal group-hover:text-brand-terracotta transition-colors leading-tight mb-1">
                        {dish.name}
                      </h3>
                      <p className="text-brand-charcoal/40 text-xs font-light mb-3 line-clamp-1">{dish.sub}</p>
                      {dish.spice > 0 && (
                        <div className="flex items-center gap-0.5 mb-3">
                          {[1,2,3].map(s => <Flame key={s} className={`w-3.5 h-3.5 ${s <= dish.spice ? 'text-brand-terracotta fill-brand-terracotta' : 'text-brand-charcoal/10'}`} />)}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-brand-charcoal/25 font-semibold group-hover:text-brand-terracotta/60 transition-colors">
                          View details
                        </span>
                        <motion.div
                          className="w-7 h-7 rounded-full bg-brand-charcoal/6 group-hover:bg-brand-terracotta flex items-center justify-center text-brand-charcoal/30 group-hover:text-white transition-all"
                          whileHover={{ rotate: 45 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS — dark
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#0D0B08] py-28 relative overflow-hidden">
        <JaliPattern className="absolute inset-0 w-full h-full text-brand-gold opacity-30 pointer-events-none" />
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="h-px w-8 bg-brand-gold" />
            <span className="text-brand-gold text-[10px] uppercase tracking-[0.28em] font-semibold">What guests say</span>
            <div className="h-px w-8 bg-brand-gold" />
          </div>

          <div className="relative h-52 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col items-center justify-center px-2"
              >
                <div className="flex gap-1 mb-5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-brand-gold text-brand-gold" />)}
                </div>
                <p className="font-serif text-xl md:text-2xl font-light text-white/80 leading-relaxed italic mb-7">
                  &ldquo;{testimonials[activeTestimonial]?.quote}&rdquo;
                </p>
                <div>
                  <p className="text-white font-semibold text-sm">{testimonials[activeTestimonial]?.name}</p>
                  <p className="text-white/30 text-xs mt-1">{testimonials[activeTestimonial]?.role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                aria-label={`Testimonial ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${i === activeTestimonial ? 'w-7 h-1.5 bg-brand-gold' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          RESERVATION CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-brand-cream-light py-16 px-5 sm:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="rounded-3xl overflow-hidden relative bg-brand-charcoal"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "url('/assets/food/main_dal_makhani.webp')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(10px) saturate(0.3)',
                transform: 'scale(1.1)',
              }}
            />
            <JaliPattern className="absolute inset-0 w-full h-full text-brand-gold opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal via-brand-charcoal/95 to-brand-charcoal/75" />

            {/* Animated gold border */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              animate={{ boxShadow: ['inset 0 0 0 1px rgba(212,175,55,0.1)', 'inset 0 0 0 1px rgba(212,175,55,0.25)', 'inset 0 0 0 1px rgba(212,175,55,0.1)'] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-10 py-16">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px w-4 bg-brand-gold" />
                  <span className="text-brand-gold text-[10px] uppercase tracking-[0.28em] font-semibold">Private Dining</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
                  Reserve your table tonight
                </h2>
                <p className="text-white/35 text-sm font-light max-w-md">
                  Celebrate life&apos;s finest moments in our award-winning dining room. Groups of 2 to 40.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <MagneticButton>
                  <Link href="/reservations" className="pulse-glow inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-charcoal text-[11px] uppercase tracking-[0.22em] font-bold px-8 py-4 rounded-sm transition-colors shadow-xl shadow-brand-gold/20">
                    Book a Table
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/50 text-white text-[11px] uppercase tracking-[0.22em] font-semibold px-8 py-4 rounded-sm transition-all">
                    Contact Us
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
