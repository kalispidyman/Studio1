'use client';

import React, { useEffect, useRef } from 'react';

const LiquidBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width, height;
    const resize = () => {
      // PERFORMANCE BOOST: Render background at 0.5x resolution
      const dpr = 0.5;
      width = window.innerWidth * dpr;
      height = window.innerHeight * dpr;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Color palette: Ethereal / Spatial / Deep Studio
    const colors = [
      { r: 82, g: 39, b: 255 },  // Primary Purple
      { r: 26, g: 26, b: 36 },   // Dark Indigo
      { r: 10, g: 10, b: 12 },   // Deep Black
      { r: 139, g: 92, b: 246 }  // Soft Violet
    ];

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = Math.random() * 400 + 300;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.velocity = Math.random() * 0.005 + 0.002;
        this.radius = Math.random() * 100 + 50;
      }

      update() {
        this.angle += this.velocity;
        this.x = this.baseX + Math.cos(this.angle) * this.radius;
        this.y = this.baseY + Math.sin(this.angle) * this.radius;
      }

      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.25)`);
        gradient.addColorStop(1, 'rgba(10, 10, 12, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles = [];
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(Math.random() * width, Math.random() * height));
    }

    const render = () => {
      // Very slight clear with low alpha for a subtle motion blur trail
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, width, height);
      
      ctx.globalCompositeOperation = 'screen';
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      ctx.globalCompositeOperation = 'source-over';

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-50 pointer-events-none opacity-80"
      style={{ filter: 'blur(40px) contrast(1.1)' }}
    />
  );
};

export default LiquidBackground;
