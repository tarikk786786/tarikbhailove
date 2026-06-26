import { useEffect, useRef } from 'react';

/* ══════════════════════════════════════════════════════════════
   CUSTOM CURSOR — Magnetic gravity cursor with energy trail
══════════════════════════════════════════════════════════════ */

export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ringPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      // Dot snaps immediately
      dot.style.left = `${e.clientX}px`;
      dot.style.top  = `${e.clientY}px`;

      // Detect hoverable elements
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el && (el.closest('button') || el.closest('a') || el.closest('.cap-card') || el.closest('.qprompt'))) {
        ring.classList.add('hovering');
      } else {
        ring.classList.remove('hovering');
      }
    };

    const animate = () => {
      // Ring follows with lag
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.12;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.12;
      ring.style.left = `${ringPosRef.current.x}px`;
      ring.style.top  = `${ringPosRef.current.y}px`;
      frameRef.current = requestAnimationFrame(animate);
    };

    const onClick = () => {
      dot.style.transform = 'translate(-50%,-50%) scale(3)';
      dot.style.opacity = '0.5';
      setTimeout(() => {
        dot.style.transform = 'translate(-50%,-50%) scale(1)';
        dot.style.opacity = '1';
      }, 300);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('click', onClick);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
