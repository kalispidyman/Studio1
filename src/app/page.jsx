"use client";
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import ShapeBlur from '../components/ShapeBlur';
import SplashCursor from '../components/SplashCursor';
import Folder from '../components/Folder';
import Lanyard from '../components/Lanyard';
import BorderGlow from '../components/BorderGlow';
import Dock from '../components/Dock';
import Ballpit from '../components/Ballpit';
import Preloader from '../components/Preloader';

const TheatreStudio = dynamic(() => import('../components/TheatreStudio'), { ssr: false });
import GridScan from '../components/GridScan';
import CurvedLoop from '../components/CurvedLoop';
import TEST from '../components/TEST';
import TextType from '../components/TextType';
import { User, Zap, Briefcase, Cpu, Globe, X, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

// Silence irritating THREE.Clock deprecation warnings from internal dependencies
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && typeof args[0] === 'string' && (
      args[0].includes('THREE.Clock') ||
      args[0].includes('using deprecated parameters')
    )) return;
    originalWarn(...args);
  };
}

// ----------------------------------------------------
// UI COMPONENTS
// ----------------------------------------------------
const sidebarItems = [
  { id: 'about', label: 'About Me', icon: <User size={20} /> },
  { id: 'features', label: 'Features', icon: <Zap size={20} /> },
  { id: 'projects', label: 'Projects', icon: <Briefcase size={20} /> },
  { id: 'skills', label: 'Stack', icon: <Cpu size={20} /> },
  { id: 'contact', label: 'Network', icon: <Globe size={20} /> },
  { id: 'subscriptions', label: 'Plans', icon: <CreditCard size={20} /> }
];

const FloatingPlansPanel = () => {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col gap-2 p-2 bg-black/40 backdrop-blur-2xl border-y border-r border-white/10 rounded-r-3xl shadow-2xl"
    >
      <div className="text-[9px] font-mono text-white/50 uppercase tracking-widest text-center mt-2 mb-1">Buy</div>
      
      <Link href="/pay?amount=499&purpose=Basic+Plan" className="group relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 overflow-hidden">
        <span className="text-[10px] font-medium text-white/50 group-hover:text-white transition-colors">Basic</span>
        <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">₹499</span>
      </Link>

      <Link href="/pay?amount=999&purpose=Pro+Plan" className="group relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-primary/20 to-transparent border border-primary/20 hover:border-primary/50 transition-colors overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-[10px] font-medium text-primary/80 group-hover:text-primary transition-colors relative z-10">Pro</span>
        <span className="text-xs font-bold text-white group-hover:text-white transition-colors relative z-10">₹999</span>
      </Link>

      <Link href="/pay?amount=1499&purpose=Enterprise+Plan" className="group relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 overflow-hidden">
        <span className="text-[10px] font-medium text-white/50 group-hover:text-white transition-colors">Ent.</span>
        <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">₹1499</span>
      </Link>
    </motion.div>
  );
};

const TopNavBar = ({ activeSection }) => {
  // LANYARD TWEAK CONTROLS: Change these variables easily!
  const lanyardXOffset = "-50%";  // X-Axis (Negative moves left, Positive moves right)
  const lanyardYOffset = "-150px";    // Y-Axis (Centered to icon vertically)
  const lanyardZoom = 35;         // Zoom (Z-Axis)

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      className={`fixed top-0 right-0 w-full md:w-[calc(100%-6rem)] flex justify-end md:justify-between items-center px-8 md:px-12 py-8 bg-transparent transition-all duration-300 overflow-visible ${activeSection === 'about' ? 'z-[80]' : 'z-[100]'}`}
    >
      <div className="text-xl md:text-2xl font-bold tracking-tighter text-[#d0ccee] font-headline hidden md:block">Ethereal Studio</div>
      <div className="flex items-center gap-4 md:gap-6 relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary hover:bg-primary-container text-on-primary-fixed px-5 py-2 md:px-6 md:py-2 rounded-full font-label text-[0.65rem] md:text-[0.7rem] uppercase tracking-widest transition-all duration-300 cursor-pointer"
        >
          Inquire
        </motion.button>
        <div className="relative group/curator cursor-pointer">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-outline-variant/30 flex-shrink-0 relative z-20 hover:border-primary transition-colors">
            <img alt="Studio Curator Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDQNXNzuSlVYyFuq5yEvSUAa3ffMZ8mZDg-jgW5oqQ1KEaMczCu598B_eurV1X9xH7zNvkXrRIZl0-krPgrdkGhvbogDa0twT6bNesqLCu23SxI7Myj9_uk8L1TFGSdDAARDeGOVWGO_B9rXAXEDDatStaBW7EqErszDERgsFZsKMw_mZTgApGu9HqseVurFlF5U0kdvbp7i183IREnuZAbR0gYOIdjCLqWeBZpoXeVqSpsSUOp73eMSvQdmxtQfhkilC1K4YaMuud" />
          </div>
          {/* Lanyard hangs dynamically behind the icon - NOW ONLY VISIBLE ON HOVER */}
          <div
            className={`absolute top-1/2 left-1/2 w-screen md:w-[600px] h-[800px] transition-opacity duration-700 pointer-events-none opacity-0 group-hover/curator:opacity-100 ${activeSection ? 'opacity-0 !pointer-events-none' : 'z-[10000]'}`}
            style={{ transform: `translate(${lanyardXOffset}, ${lanyardYOffset})` }}
          >
            {!activeSection && <Lanyard position={[0, 5, lanyardZoom]} gravity={[0, -40, 0]} />}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

const Hero = () => {
  const shapeSizeX = 1.8;
  const shapeSizeY = 1.0;
  const roundness = 0.4;
  const borderSize = 0.05;
  const circleSize = 0.3;
  const circleEdge = 0.5;
  const mouseDamping = 8;

  return (
    <div className="relative min-h-[100vh] w-full flex items-center justify-center">
      {/* BACKGROUND SHAPE */}
      <div className="absolute inset-0 z-0">
        <ShapeBlur
          variation={0}
          pixelRatioProp={2}
          shapeSizeX={shapeSizeX}
          shapeSizeY={shapeSizeY}
          roundness={roundness}
          borderSize={borderSize}
          circleSize={circleSize}
          circleEdge={circleEdge}
          mouseDamping={mouseDamping}
        />
      </div>

      {/* CENTERED TEXT - ABSOLUTE ALIGNMENT */}
      <div className="relative z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
          className="flex flex-col items-center gap-1.5"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 bg-primary animate-pulse rotate-45" />
            <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-primary/80">Studio.v1</span>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-[0.15em] text-white font-headline text-center leading-none">
            <TextType
              text="ETHEREAL STUDIOS"
              typingSpeed={100}
              showCursor={false}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 3.0, duration: 1 }}
            className="text-[7px] md:text-[9px] uppercase tracking-[0.6em] text-white font-medium italic mt-2"
          >
            Creative Intelligence
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};


const SpatialGrid = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(sectionRef.current.children,
        { y: 100, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mt-32 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[300px] md:auto-rows-[250px] relative z-10"
    >
      <div className="md:col-span-8 md:row-span-2 glass-pearl rounded-3xl overflow-hidden relative group">
        <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 mix-blend-screen" alt="abstract" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmQgIAqACyF2ftII73qrR4MXi0Ktj-NFfOHxXQTlV7EGwUceAhGKYSzy8qhKP7X4aHU7z9NRjHGsIuNv0fOC4oGBWiDFXHIAQH1TdcHSK4tC6Xdff8bYs1dg3q9nZK7bE-P4a4PpZQWa5bqcN9U5DJysM0rG_TZIZVyFNr-IViKprkgLP7JSW7JzD6yEygLZfOFncXHjwYAyto9dfRxPrQzj8KrLS6jubPG0HAwACzFgrsO14z_Q4pPTjjS92UfLQV0sUcD3imNiy4" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
          <span className="font-label text-[10px] uppercase tracking-widest text-primary mb-2 block">Atmospheric Case Study</span>
          <h3 className="text-2xl md:text-3xl font-headline font-bold text-white">Luminous Depths</h3>
        </div>
      </div>

      <div className="md:col-span-4 md:row-span-1 glass-pearl rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group cursor-default">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl group-hover:bg-secondary/30 transition-colors"></div>
        <div className="mt-2 z-20 w-max relative transition-transform duration-500 origin-left">
          <Folder size={0.65} color="#b4b1d2" items={['✨', '🚀', '🎨']} />
        </div>
        <div>
          <h4 className="text-xl font-headline font-bold mb-2 text-white">Tactile Interface</h4>
          <p className="text-sm text-on-surface-variant opacity-80">Physics-based interactions for a native spatial feel.</p>
        </div>
      </div>

      <div className="md:col-span-4 md:row-span-2 glass-pearl rounded-3xl overflow-hidden relative group cursor-pointer border border-white/5">
        <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 mix-blend-lighten" alt="spheres" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtWajW6uZfA4_sb-4PmyjoOAiZkh55NwHFWo5y1Cvu3ypknfHiKjLqEIh-ZkNuSuFXTdxgppz0emvwtxKPaot3mqFjboZ-KmmPXlh2cSQcdSF6KVjM6c8wWY3HYumxylmjIQD7Hun29mAOTx3bW4tvbk5I2ACafG4-CiqHngUa752OMtvHzsqcUSeIMz333VvYtgHqL1UXf3wyP6ZGi5-2J91t4hxx1fMDsZt5EDmozBkHJXHrIsu0RH1_MIupYaWlrQRLc_4fYny9" />
        <div className="absolute inset-0 backdrop-blur-[4px] bg-black/40 group-hover:backdrop-blur-[0px] transition-all duration-700"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center glass-pearl !border-none !bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <h3 className="text-2xl font-headline font-bold text-white mb-4">Depth of Field</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full glass-pearl flex items-center justify-center hover:bg-white/20 transition-colors text-white"
          >
            <span className="material-symbols-outlined">play_arrow</span>
          </motion.button>
        </div>
      </div>

      <div className="md:col-span-4 md:row-span-1 glass-pearl rounded-3xl p-6 md:p-8 flex items-center gap-6 relative overflow-hidden group">
        <div className="flex-1 transform group-hover:-translate-y-1 transition-transform">
          <div className="text-3xl md:text-4xl font-headline font-black text-primary-container">8K</div>
          <div className="text-[10px] md:text-xs uppercase tracking-tighter opacity-70">Resolution</div>
        </div>
        <div className="w-px h-12 bg-white/10"></div>
        <div className="flex-1 transform group-hover:-translate-y-1 transition-transform delay-75">
          <div className="text-3xl md:text-4xl font-headline font-black text-secondary">0.2s</div>
          <div className="text-[10px] md:text-xs uppercase tracking-tighter opacity-70">Latency Goal</div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="flex flex-col md:flex-row justify-between items-center w-full px-8 md:px-12 py-12 gap-8 md:gap-4 bg-transparent relative z-10 md:ml-20 mt-20 border-t border-white/5"
  >
    <div className="font-label text-[10px] uppercase tracking-[0.2em] opacity-60 text-primary text-center md:text-left">
      © 2024 Ethereal Studio.
      <br className="md:hidden" />
      <span className="md:ml-2 block md:inline mt-2 md:mt-0 font-bold text-[#b8ccb7]">designer @NEET</span>
    </div>
    <div className="flex gap-6 md:gap-8 flex-wrap justify-center">
      {['Privacy', 'Terms', 'Coordinates'].map(link => (
        <a key={link} className="font-label text-[10px] uppercase tracking-[0.2em] opacity-40 text-primary hover:opacity-100 hover:text-white transition-all" href="#">
          {link}
        </a>
      ))}
    </div>
    <div className="flex gap-4">
      {['public', 'alternate_email'].map(icon => (
        <motion.div
          key={icon}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full glass-pearl flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer text-primary hover:text-white"
        >
          <span className="material-symbols-outlined text-sm">{icon}</span>
        </motion.div>
      ))}
    </div>
  </motion.footer>
);

export default function App() {
  const [activeSection, setActiveSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Preloader is now dismissed via onComplete callback from the component
  useEffect(() => {
    // Check if we've already run the preloader in this session
    if (sessionStorage.getItem('siteLoaded')) {
      setIsLoading(false);
      return;
    }

    sessionStorage.setItem('siteLoaded', 'true');
    // We can still have a failsafe timer if needed, but onComplete is preferred
    const failsafe = setTimeout(() => {
      setIsLoading(false);
    }, 10000); // 10s failsafe
    return () => clearTimeout(failsafe);
  }, []);

  // Generate dock items with click handlers
  const dockItems = sidebarItems.map(item => ({
    icon: item.icon,
    label: item.label,
    onClick: () => {
      if (item.id === 'about') {
        setActiveSection(prev => prev === 'about' ? null : 'about');
      } else if (item.id === 'features') {
        setActiveSection(prev => prev === 'features' ? null : 'features');
      } else if (item.id === 'projects') {
        setActiveSection(prev => prev === 'projects' ? null : 'projects');
      } else if (item.id === 'subscriptions') {
        router.push('/subscriptions/');
      } else if (item.id === 'contact') {
        router.push('/contact/');
      } else {
        setActiveSection(null);
      }
    }
  }));



  return (
    <ReactLenis root>
      <div className="relative overflow-hidden bg-[#000] text-foreground selection:bg-primary/30 min-h-screen font-body">

        {/* CUSTOM PRELOADER OVERLAY */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="preloader"
              initial={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#050508] overflow-hidden shadow-2xl"
            >
              <Preloader onComplete={() => setIsLoading(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        <SplashCursor
          SPLAT_RADIUS={0.25}
          SPLAT_FORCE={8000}
          DENSITY_DISSIPATION={1.4}
        />

        <Dock items={dockItems} />
        <TopNavBar activeSection={activeSection} />

        {process.env.NODE_ENV === 'development' && (
          <TheatreStudio visible={activeSection === 'projects'} />
        )}

        {/* About Me Ballpit Overlay */}
        <AnimatePresence>
          {activeSection === 'about' && (
            <motion.div
              key="about-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-12"
            >
              {/* Darkened backdrop */}
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={() => setActiveSection(null)}
              />

              {/* COOL "SMALL-TO-BIG" POP ANIMATION */}
              <motion.div
                initial={{
                  scale: 0.9,
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  scale: 0.9,
                  opacity: 0,
                  y: 20
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                className="relative w-full max-w-[1400px] h-[85vh] rounded-[3rem] overflow-hidden border border-white/20 shadow-[0_0_200px_rgba(82,39,255,0.3)] z-10 bg-[#050508] flex flex-col"
              >
                {/* Visual "Shimmer" sweep on entry */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
                />

                {/* Ballpit Background */}
                <div className="absolute inset-0">
                  <Ballpit
                    count={120}
                    gravity={0.4}
                    size0={1.2}
                    minSize={0.4}
                    maxSize={1.1}
                    colors={[0x5227ff, 0xb4b1d2, 0x8b5cf6, 0xffffff]}
                    followCursor={true}
                  />
                </div>

                {/* Content overlay - GLASSMORHIC LANDSCAPE CARD */}
                <div className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8 pointer-events-none">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="w-full max-w-5xl bg-black/40 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-8 md:p-12 pointer-events-auto shadow-2xl relative"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                      {/* Left Side: Branding */}
                      <div className="space-y-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-[2px] bg-primary rounded-full" />
                          <span className="text-[11px] font-mono uppercase tracking-[0.5em] text-primary font-black">Elite Studio</span>
                        </div>

                        <div className="space-y-6">
                          <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-black text-white uppercase tracking-tighter leading-[1.15]">
                            Elite Web<br />
                            <span className="text-primary italic">Solutions</span>
                          </h2>
                        </div>

                        <div className="flex flex-col gap-5">
                          <p className="text-xl md:text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-300">
                            Navneet (Neet)
                          </p>
                          <div className="inline-block">
                            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white bg-primary/20 px-5 py-2.5 rounded-full border border-primary/30">
                              Digital Solutions Architect
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Content & Action */}
                      <div className="space-y-10 flex flex-col justify-center">
                        <div className="space-y-8">
                          <p className="text-xl md:text-2xl text-white font-semibold leading-relaxed drop-shadow-lg">
                            Architecting <span className="text-primary font-bold">high-performance</span> digital legacies through technical precision.
                          </p>

                          <div className="bg-white/5 rounded-2xl p-8 border border-white/10 backdrop-blur-md">
                            <p className="text-base md:text-lg text-white leading-relaxed italic font-medium">
                              "I provide a bespoke interactive demo for every project before any financial commitment—ensuring absolute quality and authenticity."
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-8 mt-4">
                          <motion.button
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto px-14 py-7 rounded-[1.5rem] bg-white text-black font-headline text-xs font-black uppercase tracking-[0.3em] shadow-[0_25px_50px_rgba(255,255,255,0.2)] transition-all"
                          >
                            Request Demo
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveSection(null)}
                            className="w-full sm:w-auto px-14 py-7 rounded-[1.5rem] bg-black/40 backdrop-blur-md border border-white/20 text-white font-headline text-xs font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all"
                          >
                            Return
                          </motion.button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* FEATURES GRID SCAN OVERLAY */}
          {activeSection === 'features' && (
            <motion.div
              key="features-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-2xl"
            >
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setActiveSection(null)}
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateX: 10 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateX: -10 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="relative w-full h-full max-w-[1400px] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(82,39,255,0.3)] bg-black"
              >
                <GridScan
                  className="w-full h-full"
                  scanColor="#5227ff"
                  linesColor="#1a1a24"
                  bloomIntensity={2.5}
                  bloomThreshold={0.2}
                  chromaticAberration={0.005}
                  scanDuration={3}
                  scanOnClick={true}
                  enableWebcam={true}
                  showPreview={true}
                />

                <div className="absolute top-12 left-12 z-20 pointer-events-none">
                  <h2 className="text-4xl font-headline font-black text-white italic tracking-tighter">SPATIAL SCANNER</h2>
                  <p className="text-white/40 text-xs font-mono tracking-widest mt-2 uppercase">Status: Tracking active... click to surge pulse.</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveSection(null)}
                  className="absolute top-12 right-12 z-20 px-6 py-2 rounded-full glass-pearl border border-white/20 text-white font-headline text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-colors"
                >
                  Terminate
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {activeSection === 'projects' && (
            <motion.div
              key="projects-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[160] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-xl"
            >
              <div
                className="absolute inset-0"
                onClick={() => setActiveSection(null)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -20 }}
                className="relative w-full h-full max-w-[1400px] rounded-[3rem] border border-white/10 shadow-2xl z-10 bg-black"
              >
                <TEST />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveSection(null)}
                  className="absolute top-12 right-12 z-20 w-12 h-12 rounded-full glass-pearl border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}


        </AnimatePresence>

        {!activeSection && <Hero />}

        {/* Main Content */}
        <main className="relative px-6 md:px-12 pb-32 min-h-screen z-10 w-full mx-auto max-w-[1600px]">
          <SpatialGrid />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1 }}
            className="mt-40 flex flex-col items-center justify-center mb-20 relative z-10"
          >
            <div className="relative w-64 h-64 cursor-pointer group glass-pearl rounded-full p-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-secondary rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-[1px] border-dashed border-white/20 rounded-full"
              />
              <span className="material-symbols-outlined text-4xl text-primary opacity-80 group-hover:scale-125 transition-transform duration-500">expand_more</span>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-center w-full">
                <span className="font-label text-[10px] uppercase tracking-[0.4em] text-primary">Keep Scrolling</span>
              </div>
            </div>
          </motion.div>

          {/* BorderGlow Cards Section */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 w-full mb-20">
            {[1, 2, 3, 4].map((item, i) => (
              <BorderGlow
                key={i}
                animated={true}
                className="w-full h-80 flex flex-col items-center justify-center text-center p-6"
                backgroundColor="#0a0a0c"
                glowColor={['40 80 80', '320 80 80', '210 80 80', '160 80 80'][i % 4]}
              >
                <div className="w-16 h-16 rounded-full glass-pearl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">{['auto_awesome', 'token', 'deployed_code', 'blur_on'][i % 4]}</span>
                </div>
                <h3 className="text-xl font-headline font-bold text-white mb-2">Ethereal Tier {item}</h3>
                <p className="text-xs text-white/50">Exclusive access, premium interactions, and boundless 3D fluidity.</p>
              </BorderGlow>
            ))}
          </div>
        </main>

        {/* CurvedLoop Marquee Section */}
        <div className="relative z-10 w-full overflow-hidden border-t border-white/5 py-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
          <CurvedLoop
            marqueeText="✦ Ethereal Studio ✦ Digital Craftsmanship ✦ Spatial Design ✦ Web Experiences ✦ Immersive Tech ✦ Creative Coding ✦"
            speed={2.5}
            curveAmount={40}
            direction="left"
            interactive={true}
            className="opacity-60 tracking-[0.2em] font-headline"
          />
        </div>

        <Footer />
      </div>
    </ReactLenis>
  );
}
