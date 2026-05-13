'use client';

import React, { useEffect, useState, useRef } from 'react';

const FPSMeter = () => {
  const [fps, setFps] = useState(0);
  const frames = useRef(0);
  const prevTime = useRef(performance.now());
  const requestRef = useRef();

  const animate = (time) => {
    frames.current++;
    if (time > prevTime.current + 1000) {
      setFps(Math.round((frames.current * 1000) / (time - prevTime.current)));
      prevTime.current = time;
      frames.current = 0;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div 
      id="fps-meter"
      style={{
        position: 'fixed',
        top: '12px',
        right: '12px',
        zIndex: 9999,
        padding: '6px 12px',
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        color: '#00ffaa',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '12px',
        fontWeight: 'bold',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: fps > 50 ? '#00ffaa' : fps > 30 ? '#ffaa00' : '#ff0055',
        boxShadow: `0 0 10px ${fps > 50 ? '#00ffaa' : fps > 30 ? '#ffaa00' : '#ff0055'}`
      }} />
      <span>{fps} FPS</span>
    </div>
  );
};

export default FPSMeter;
