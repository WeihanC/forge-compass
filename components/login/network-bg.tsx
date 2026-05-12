'use client';

import { useEffect, useRef } from 'react';

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
};
type Pulse = { a: Node; b: Node; t: number; life: number };

function hexA(hex: string, a: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export function NetworkBg({ color = '#4F8EF7' }: { color?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const N = 64;
    const nodes: Node[] = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00025,
      vy: (Math.random() - 0.5) * 0.00025,
      r: Math.random() * 1.6 + 0.6,
      pulse: Math.random() * Math.PI * 2,
    }));
    const pulses: Pulse[] = [];
    const spawnPulse = () => {
      const a = nodes[(Math.random() * N) | 0];
      const b = nodes[(Math.random() * N) | 0];
      if (a === b) return;
      pulses.push({ a, b, t: 0, life: 1.2 + Math.random() * 1.5 });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let last = performance.now();
    let pulseTimer = 0;
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
        n.pulse += dt * 1.2;
      }

      const maxD = Math.min(w, h) * 0.18;
      ctx.lineWidth = 1;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = (a.x - b.x) * w;
          const dy = (a.y - b.y) * h;
          const d = Math.hypot(dx, dy);
          if (d < maxD) {
            const alpha = (1 - d / maxD) * 0.22;
            ctx.strokeStyle = hexA(color, alpha);
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }

      pulseTimer += dt;
      while (pulseTimer > 0.35) {
        pulseTimer -= 0.35;
        spawnPulse();
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += dt / p.life;
        if (p.t >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const x = (p.a.x + (p.b.x - p.a.x) * p.t) * w;
        const y = (p.a.y + (p.b.y - p.a.y) * p.t) * h;
        const fade = Math.sin(p.t * Math.PI);
        ctx.fillStyle = hexA(color, 0.9 * fade);
        ctx.shadowColor = color;
        ctx.shadowBlur = 12 * fade;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (const n of nodes) {
        const glow = 0.55 + 0.45 * Math.sin(n.pulse);
        ctx.fillStyle = hexA(color, 0.5 + 0.35 * glow);
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [color]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: 'block' }}
    />
  );
}
