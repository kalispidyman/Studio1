'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Environment } from '@react-three/drei';

const OrbitingRing = ({ radius, speed, axis, color }) => {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation[axis] += delta * speed;
    }
  });
  
  const initialRotation = [
    axis === 'x' ? 0 : Math.PI / 3,
    axis === 'y' ? 0 : Math.PI / 4,
    axis === 'z' ? 0 : Math.PI / 6,
  ];

  return (
    <mesh ref={ref} rotation={initialRotation}>
      <torusGeometry args={[radius, 0.008, 16, 48]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  );
};

const MorphingCore = () => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if(meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={4} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.4}>
        <icosahedronGeometry args={[1, 16]} />
        <MeshDistortMaterial 
          color="#5227ff" 
          envMapIntensity={2} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
          metalness={0.9} 
          roughness={0.1} 
          distort={0.4} 
          speed={5} 
        />
      </mesh>
      
      <OrbitingRing radius={2.2} speed={1.5} axis="x" color="#5227ff" />
      <OrbitingRing radius={2.6} speed={-1.2} axis="y" color="#ffffff" />
      <OrbitingRing radius={3.0} speed={0.8} axis="z" color="#c084fc" />
    </Float>
  );
};

const EtherealPreloader = ({ onComplete }) => {
  const numberRef = useRef(null);
  const barRef = useRef(null);
  const [isCanvasMounted, setIsCanvasMounted] = useState(false);

  useEffect(() => {
    let startTime = Date.now();
    const duration = 3500;
    let frameId;
    
    // Defer Canvas mount to prevent shader compilation from stuttering the numbers
    const canvasTimer = setTimeout(() => {
      setIsCanvasMounted(true);
    }, 200);

    const easeInOutQuart = (t) => {
      return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    };

    const update = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      
      const easedT = easeInOutQuart(t);
      const currentNumber = Math.floor(easedT * 100);

      if (numberRef.current) {
        numberRef.current.textContent = currentNumber.toString().padStart(2, '0');
      }
      
      if (barRef.current) {
        barRef.current.style.width = `${easedT * 100}%`;
      }

      if (t < 1) {
        frameId = requestAnimationFrame(update);
      } else if (onComplete) {
        // Delay slightly for visual impact before dismissing
        setTimeout(onComplete, 500);
      }
    };

    frameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(canvasTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col md:flex-row w-full h-full bg-[#050508] overflow-hidden font-body">
      {/* LEFT SIDE: Typography & Progress */}
      <div className="relative flex-1 flex flex-col justify-between p-12 md:p-24 z-20 border-r border-white/5">
        <div className="overflow-hidden">
          <motion.h1 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl font-black tracking-tighter text-white"
            style={{ fontFamily: "'Syncopate', sans-serif" }}
          >
            ETHEREAL<span className="text-primary italic">.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-[10px] uppercase tracking-[0.6em] mt-4 text-white font-medium"
          >
            Digital Craftsmanship & Spatial Logic
          </motion.p>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex items-baseline gap-4">
            <span 
              ref={numberRef}
              className="text-8xl md:text-[12rem] font-headline font-black leading-none text-white selection:bg-primary"
            >
              00
            </span>
            <span className="text-2xl md:text-4xl text-white/20 font-light">%</span>
          </div>

          <div className="w-full max-w-md h-[2px] bg-white/5 relative overflow-hidden">
            <div 
              ref={barRef}
              className="absolute inset-y-0 left-0 bg-primary"
              style={{ width: "0%", transition: "none" }}
            />
          </div>

          <motion.div 
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary/80">
              Initializing Neural Core...
            </span>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE: 3D Animation */}
      <div className="relative flex-[1.2] md:flex-[1.5] h-full overflow-hidden">
        <div className="absolute inset-0 z-0 scale-110 md:scale-100">
          {isCanvasMounted && (
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }}>
              <ambientLight intensity={0.4} />
              <spotLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
              <pointLight position={[-10, -10, -5]} intensity={5} color="#5227ff" />
              
              <MorphingCore />
              <Environment preset="night" />
            </Canvas>
          )}
        </div>
        
        {/* Subtle Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/40 to-transparent pointer-events-none" />
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};

export default EtherealPreloader;
