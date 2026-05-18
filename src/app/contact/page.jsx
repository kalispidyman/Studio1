"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Globe, Mail, MapPin, Terminal, Calendar, ArrowLeft } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden font-body">
      {/* Decorative premium background blur elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 22 }}
        className="relative w-full max-w-3xl bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_0_100px_rgba(82,39,255,0.2)] z-10 flex flex-col items-center text-center"
      >
        {/* Animated Icon */}
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary animate-pulse">
          <Globe className="w-8 h-8" />
        </div>

        <h1 className="text-3xl md:text-5xl font-headline font-black text-white uppercase tracking-tight mb-2">
          Ethereal Network
        </h1>

        <p className="text-neutral-400 text-xs md:text-sm max-w-lg mb-10 leading-relaxed">
          Establish a secure connection. Reach out for high-end spatial visualizers, immersive 3D interfaces, and modern engineering design inquiries.
        </p>

        {/* Grid layout for contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-10">

          {/* Email Card */}
          <a
            href="mailto:neet@ethereal.studio"
            className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral-400 group-hover:text-primary transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider mb-0.5">Direct Email</div>
              <div className="text-xs text-white font-semibold font-mono">antineet78@gmail.com</div>
            </div>
          </a>

          {/* Coordinates Card */}
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 text-left">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider mb-0.5">Coordinates</div>
              <div className="text-xs text-white font-medium">28.6139° N, 77.2090° E (Delhi, IN)</div>
            </div>
          </div>

          {/* GitHub Card */}
          <a
            href="https://github.com/raagneet"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral-400 group-hover:text-primary transition-colors">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider mb-0.5">Code Lab</div>
              <div className="text-xs text-white font-semibold font-mono">github.com/raagneet</div>
            </div>
          </a>

          {/* Availability Card */}
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 text-left">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider mb-0.5">Availability</div>
              <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Accepting Demos</div>
            </div>
          </div>

        </div>

        {/* Buttons / Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="mailto:neet@ethereal.studio"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-headline font-black text-xs uppercase tracking-widest text-center shadow-lg hover:bg-neutral-200 transition-colors"
          >
            Send Direct Message
          </motion.a>

          <Link href="/" className="w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-headline font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
