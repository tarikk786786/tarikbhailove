import { useEffect } from 'react';

export function useAnimatedFavicon() {
  useEffect(() => {
    let frame = 0;
    let animationId: number;
    let timeoutId: NodeJS.Timeout;

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Find or create favicon link
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, 32, 32);
      
      // Draw a glowing animated circle
      const centerX = 16;
      const centerY = 16;
      const radius = 10 + Math.sin(frame * 0.1) * 2; // Pulsing radius
      
      // Outer glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius + 4);
      const hue = (frame * 2) % 360;
      gradient.addColorStop(0, `hsla(${hue}, 100%, 60%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, 100%, 60%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner bright core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Update the favicon
      if (link) {
        link.href = canvas.toDataURL('image/png');
      }
      
      frame++;
      // We don't want to run this too fast, 15fps is enough for a favicon to save CPU
      timeoutId = setTimeout(() => {
        animationId = requestAnimationFrame(animate);
      }, 1000 / 15);
    };

    animate();

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
    };
  }, []);
}
