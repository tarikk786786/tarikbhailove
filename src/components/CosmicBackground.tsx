import { useEffect, useRef } from 'react';

/* ══════════════════════════════════════════════════════════════
   COSMIC BACKGROUND — Canvas particle nebula + WebGL-like effects
══════════════════════════════════════════════════════════════ */

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  alpha: number;
  alphaSpeed: number;
  color: string;
  type: 'star' | 'dust' | 'energy';
  life: number;
  maxLife: number;
}

const COLORS = ['#a78bfa', '#60a5fa', '#f0abfc', '#06b6d4', '#fbbf24', '#34d399'];

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const count = Math.min(200, Math.floor((window.innerWidth * window.innerHeight) / 8000));

      for (let i = 0; i < count; i++) {
        const type = Math.random() < 0.6 ? 'star' : Math.random() < 0.7 ? 'dust' : 'energy';
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          radius: type === 'star' ? Math.random() * 1.5 + 0.3 : type === 'dust' ? Math.random() * 3 + 1 : Math.random() * 2 + 0.5,
          alpha: Math.random(),
          alphaSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() < 0.5 ? 1 : -1),
          color: type === 'star' ? '#ffffff' : randomColor(),
          type,
          life: Math.random() * 1000,
          maxLife: 800 + Math.random() * 400,
        });
      }
    };
    initParticles();

    // Mouse interaction
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Draw nebula gradient layer
    const drawNebula = (t: number) => {
      const s = Math.sin(t * 0.0003);
      const c = Math.cos(t * 0.0002);

      // Radial gradient blobs
      const blobs = [
        { x: canvas.width * (0.2 + s * 0.08), y: canvas.height * (0.3 + c * 0.1), r: 280, clr: 'rgba(124,58,237,' },
        { x: canvas.width * (0.75 + c * 0.06), y: canvas.height * (0.6 + s * 0.08), r: 220, clr: 'rgba(6,182,212,' },
        { x: canvas.width * (0.5 + s * 0.05), y: canvas.height * (0.15 + c * 0.06), r: 180, clr: 'rgba(236,72,153,' },
        { x: canvas.width * (0.1 + c * 0.05), y: canvas.height * (0.7 + s * 0.07), r: 150, clr: 'rgba(16,185,129,' },
      ];

      for (const b of blobs) {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, b.clr + '0.08)');
        grad.addColorStop(0.5, b.clr + '0.04)');
        grad.addColorStop(1, b.clr + '0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Draw connection lines between nearby particles
    const drawConnections = () => {
      const ps = particlesRef.current;
      const maxDist = 80;
      ctx.lineWidth = 0.4;

      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          if (ps[i].type === 'star' || ps[j].type === 'star') continue;
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const op = (1 - dist / maxDist) * 0.15;
            ctx.strokeStyle = `rgba(124,58,237,${op})`;
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Main render loop
    const render = (ts: number) => {
      timeRef.current = ts;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep space base
      ctx.fillStyle = 'rgba(0,0,10,0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawNebula(ts);
      drawConnections();

      // Update + draw particles
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha += p.alphaSpeed;

        // Mouse repulsion for energy particles
        if (p.type === 'energy') {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120 * 0.03;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
          // Speed limit
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > 1.2) { p.vx *= 0.95; p.vy *= 0.95; }
        }

        // Boundary wrap
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Alpha bounds
        if (p.alpha <= 0.02) { p.alpha = 0.02; p.alphaSpeed = Math.abs(p.alphaSpeed); }
        if (p.alpha >= 1) { p.alpha = 1; p.alphaSpeed = -Math.abs(p.alphaSpeed); }

        // Draw
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

        if (p.type === 'star') {
          // Star glow
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
          g.addColorStop(0, '#ffffff');
          g.addColorStop(0.3, 'rgba(255,255,255,0.6)');
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'energy') {
          // Energy particle with glow
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
          g.addColorStop(0, p.color);
          g.addColorStop(0.5, p.color.replace(')', ', 0.4)').replace('rgb', 'rgba'));
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Dust
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Shooting star effect occasionally
      if (Math.random() < 0.002) {
        const sx = Math.random() * canvas.width;
        const sy = Math.random() * canvas.height * 0.5;
        const len = 60 + Math.random() * 100;
        const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
        const grad = ctx.createLinearGradient(sx, sy, sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
        grad.addColorStop(0, 'rgba(255,255,255,0.9)');
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
        ctx.stroke();
      }

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div className="cosmic-bg">
      <div className="nebula-field">
        <div className="n-orb n-orb-1" />
        <div className="n-orb n-orb-2" />
        <div className="n-orb n-orb-3" />
        <div className="n-orb n-orb-4" />
        <div className="n-orb n-orb-5" />
      </div>
      <canvas ref={canvasRef} id="cosmos-canvas" />
      <div className="holo-grid" />
      <div className="scanlines" />
    </div>
  );
}
