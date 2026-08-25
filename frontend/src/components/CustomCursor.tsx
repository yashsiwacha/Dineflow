'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type CursorState = 'default' | 'hover' | 'click' | 'text' | 'hidden';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  const mouse  = useRef({ x: -200, y: -200 });
  const ring   = useRef({ x: -200, y: -200 });
  const rafId  = useRef<number>(0);
  const [state, setState] = useState<CursorState>('default');

  /* ── Silky RAF lerp loop ─────────────────────────────────────────── */
  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.1);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.1);

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  /* ── Event listeners ─────────────────────────────────────────────── */
  const handleEnter = useCallback((e: Event) => {
    const el = e.target as HTMLElement;
    if (el.matches('input, textarea, [contenteditable]')) setState('text');
    else setState('hover');
  }, []);

  const handleLeave = useCallback(() => setState('default'), []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (state === 'hidden') setState('default');
    };
    const onDown  = () => setState('click');
    const onUp    = () => setState(s => s === 'click' ? 'default' : s);
    const onLeave = () => setState('hidden');
    const onEnterDoc = () => setState('default');

    const attachToInteractive = () => {
      document.querySelectorAll('a, button, [role="button"], label, select').forEach(el => {
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });
      document.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnterDoc);

    attachToInteractive();
    const obs = new MutationObserver(attachToInteractive);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnterDoc);
      obs.disconnect();
    };
  }, [handleEnter, handleLeave, state]);

  /* ── Visual config per state ─────────────────────────────────────── */
  const cfg = {
    default: { ring: 24, ringColor: 'rgba(180,83,9,0.3)',   ringBg: 'transparent', radius: '50%',   opacity: 0.75, blur: 'none' },
    hover:   { ring: 48, ringColor: 'rgba(212,175,55,0.7)',  ringBg: 'rgba(212,175,55,0.06)', radius: '50%', opacity: 1, blur: 'none' },
    click:   { ring: 16, ringColor: 'rgba(180,83,9,0.8)',    ringBg: 'rgba(180,83,9,0.15)', radius: '50%',  opacity: 1, blur: 'none' },
    text:    { ring: 6,  ringColor: 'rgba(180,83,9,0.6)',    ringBg: 'transparent', radius: '2px',  opacity: 0.9, blur: 'none' },
    hidden:  { ring: 0,  ringColor: 'transparent',           ringBg: 'transparent', radius: '50%',  opacity: 0, blur: 'none' },
  }[state];

  const dur = '0.22s cubic-bezier(0.16,1,0.3,1)';

  return (
    <>
      {/* Trailing ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width:  cfg.ring,
          height: cfg.ring,
          marginLeft: -cfg.ring / 2,
          marginTop:  -cfg.ring / 2,
          border: `1.5px solid ${cfg.ringColor}`,
          borderRadius: cfg.radius,
          backgroundColor: cfg.ringBg,
          opacity: cfg.opacity,
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform',
          transition: `width ${dur}, height ${dur}, margin ${dur}, border-color 0.2s, background-color 0.2s, border-radius 0.2s, opacity 0.2s`,
        }}
      />
    </>
  );
}
