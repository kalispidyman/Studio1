import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function InteractiveCard360() {
  // 1. Raw motion values to track infinite rotation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 2. Wrap in a spring to give it that heavy, physical momentum when you flick it
  const rotateX = useSpring(y, { stiffness: 200, damping: 30, mass: 1 });
  const rotateY = useSpring(x, { stiffness: 200, damping: 30, mass: 1 });

  // 3. Map pointer movement directly to rotation degrees
  const handlePan = (event, info) => {
    // Multiplying by 0.5 controls the sensitivity of the spin
    x.set(x.get() + info.delta.x * 0.5);
    // Invert the Y delta so pulling down flips the top towards you
    y.set(y.get() - info.delta.y * 0.5);
  };

  return (
    <div style={styles.container}>
      <div style={{ perspective: 1200 }}>

        <motion.div
          onPan={handlePan}
          whileTap={{ cursor: 'grabbing', scale: 0.95 }}
          style={{
            rotateX,
            rotateY,
            ...styles.cardAssembly
          }}
        >
          {/* ================= FRONT FACE ================= */}
          <div style={styles.cardFront}>
            <div style={styles.glassHighlight} />

            <div style={styles.photoBox}>
              <div style={styles.avatarSilhouette} />
            </div>

            <div style={styles.textContainer}>
              <h1 style={styles.title}>ETHEREAL</h1>
              <h2 style={styles.subtitle}>STUDIO</h2>
              <p style={styles.idNumber}>ID: 8472-A-99</p>
            </div>

            <div style={styles.barcodeArea}>
              <div style={{ ...styles.bar, width: '4px' }} />
              <div style={{ ...styles.bar, width: '2px' }} />
              <div style={{ ...styles.bar, width: '8px' }} />
              <div style={{ ...styles.bar, width: '2px' }} />
              <div style={{ ...styles.bar, width: '5px' }} />
              <div style={{ ...styles.bar, width: '2px' }} />
              <div style={{ ...styles.bar, width: '6px' }} />
            </div>
          </div>

          {/* ================= BACK FACE ================= */}
          <div style={styles.cardBack}>
            {/* Magnetic Stripe */}
            <div style={styles.magStripe} />

            {/* Signature Area */}
            <div style={styles.signatureStrip}>
              <span style={styles.signatureText}>Authorized Signature</span>
            </div>

            {/* Terms text */}
            <div style={styles.backText}>
              <p>This card is the property of Ethereal Studio. If found, please return to the nearest security desk.</p>
              <p>Access Level: OMNI-DIRECTOR</p>
            </div>

            {/* Holographic Security Sticker */}
            <div style={styles.holoSticker} />
          </div>

        </motion.div>
      </div>
    </div>
  );
}

// Styling
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#050505',
    overflow: 'hidden',
  },
  cardAssembly: {
    position: 'relative',
    width: 280,
    height: 420,
    cursor: 'grab',
    // CRITICAL: This allows the front and back faces to exist in 3D space
    transformStyle: 'preserve-3d',
  },

  // --- FRONT STYLES ---
  cardFront: {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    borderRadius: 16,
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 30px 50px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 24,
    boxSizing: 'border-box',
    transformStyle: 'preserve-3d',
    // CRITICAL: Hides the front when you look at the back
    backfaceVisibility: 'hidden',
    // Small Z-translation prevents Z-fighting (glitching) between front and back
    transform: 'translateZ(1px)',
  },
  glassHighlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%)',
    pointerEvents: 'none',
    borderRadius: 16,
  },
  photoBox: {
    width: 100, height: 120,
    backgroundColor: 'rgba(0,0,0,0.6)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 8,
    marginTop: 20,
    display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
    overflow: 'hidden',
    transform: 'translateZ(20px)', // Pops out in 3D
  },
  avatarSilhouette: {
    width: 60, height: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
  },
  textContainer: {
    marginTop: 30, textAlign: 'center',
    transform: 'translateZ(30px)',
  },
  title: { color: '#fff', margin: 0, fontSize: 22, letterSpacing: '0.2em', fontWeight: 800 },
  subtitle: { color: '#aaa', margin: '4px 0 0 0', fontSize: 14, letterSpacing: '0.4em' },
  idNumber: { color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', fontSize: 10, marginTop: 16, letterSpacing: '0.1em' },
  barcodeArea: {
    marginTop: 'auto', display: 'flex', height: 30, width: '100%',
    justifyContent: 'center', gap: 3, opacity: 0.5,
    transform: 'translateZ(10px)',
  },
  bar: { height: '100%', backgroundColor: '#fff' },

  // --- BACK STYLES ---
  cardBack: {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    borderRadius: 16,
    backgroundColor: 'rgba(15, 15, 15, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxSizing: 'border-box',
    // CRITICAL: Flips the back face so it faces the opposite direction
    transform: 'rotateY(180deg) translateZ(1px)',
    backfaceVisibility: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  magStripe: {
    width: '100%',
    height: 60,
    backgroundColor: '#000',
    marginTop: 40,
  },
  signatureStrip: {
    margin: '30px 20px 0 20px',
    height: 40,
    backgroundColor: '#ddd',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 10,
  },
  signatureText: {
    fontFamily: 'cursive',
    color: '#333',
    fontSize: 18,
    opacity: 0.5,
  },
  backText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    margin: '20px 20px',
    lineHeight: 1.5,
    textAlign: 'center',
  },
  holoSticker: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ff00cc, #3333ff, #00ffff)',
    position: 'absolute',
    bottom: 20,
    right: 20,
    boxShadow: '0 0 10px rgba(0,255,255,0.2)',
  }
};