"use client";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';

function DockItem({ children, className = '', onClick, mouseY, spring, distance, magnification, baseItemSize }) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseY, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      y: 0,
      height: baseItemSize
    };
    return val - rect.y - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size
      }}
      whileHover={{ 
        scale: 1.1,
        z: 50,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative group inline-flex items-center justify-center rounded-full bg-[#0a0a0c]/80 backdrop-blur-md border border-white/10 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-[0_0_35px_rgba(82,39,255,0.6)] hover:border-white/50 ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {/* Magnetic Glow Inner Ring */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"
        layoutId="dock-glow"
      />
      {Children.map(children, child => cloneElement(child, { isHovered }))}
    </motion.div>
  );
}

function DockLabel({ children, className = '', ...rest }) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 0, y: "-50%" }}
          animate={{ opacity: 1, x: 10, y: "-50%" }}
          exit={{ opacity: 0, x: 0, y: "-50%" }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute left-full ml-4 top-1/2 w-fit whitespace-pre rounded-md border border-white/20 bg-[#060010]/90 backdrop-blur-md shadow-lg shadow-black/50 px-3 py-1.5 text-[10px] uppercase tracking-widest text-[#d0ccee] z-50`}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = '' }) {
  return <div className={`flex items-center justify-center text-white ${className}`}>{children}</div>;
}

// =========================================================================
// 🚀 DOCK CONFIGURATION HINTS
// =========================================================================
// Want to move or resize the Dock? You can pass these as props or edit here:
// 
// 1. POSITION (X/Y Axis)
//    Scroll down to the <motion.div> below. You'll see:
//    className="fixed left-6 top-1/2 transform -translate-y-1/2 ..."
//    - X-Axis: Change `left-6` to `left-12`, `left-[50px]`, or `right-10`.
//    - Y-Axis: Change `top-1/2 -translate-y-1/2` to `top-20` (high up) or `bottom-20` (low down).
//
// 2. DIMENSIONS (Height/Width/Size)
//    - panelWidth: The base width of the glass container (default: 64)
//    - baseItemSize: The size of icons when not hovering (default: 44)
//    - magnification: How large icons become when hovered (default: 60)
//    To make the dock generally larger, increase both panelWidth & baseItemSize!
// =========================================================================

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 60,
  distance = 150,
  panelWidth = 64,
  dockWidth = 120,
  baseItemSize = 44
}) {
  const mouseY = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxWidth = useMemo(
    () => Math.max(dockWidth, magnification + magnification / 2 + 4),
    [magnification, dockWidth]
  );
  const widthRow = useTransform(isHovered, [0, 1], [panelWidth, maxWidth]);
  const width = useSpring(widthRow, spring);

  return (
    <motion.div style={{ width, scrollbarWidth: 'none' }} className="fixed left-6 top-1/2 transform -translate-y-1/2 flex flex-col items-center justify-center z-50">
      <motion.div
        onMouseMove={({ pageY }) => {
          isHovered.set(1);
          mouseY.set(pageY);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseY.set(Infinity);
        }}
        className={`${className} flex flex-col items-center h-fit gap-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-2 py-4`}
        style={{ width: panelWidth }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseY={mouseY}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
