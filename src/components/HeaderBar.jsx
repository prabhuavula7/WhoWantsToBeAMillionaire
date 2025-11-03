import React from 'react';
import { motion } from 'framer-motion';

export default function HeaderBar({ title, subtitle }) {
  return (
    <motion.header initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }} className="w-full py-4 px-4 sm:px-6 glass-panel relative overflow-visible">
      {/* halo behind the logo for a stage look */}
      <img src="/logo-halo.svg" alt="halo" className="absolute left-6 top-1/2 -translate-y-1/2 w-24 opacity-40 pointer-events-none" />
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center gap-3">
            <img src="/wwtbam-logo.svg" alt="logo" className="h-12 w-12 logo-soften neon-glow" />
            <span className="absolute -right-3 -top-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-wwtbam-gold text-black">Live</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="bg-wwtbam-gold text-black px-3 py-0.5 rounded-md text-sm font-bold">Family Quiz Builder</span>
            </div>
            <div className="text-lg font-semibold text-white drop-shadow-md">{title}</div>
            {subtitle && <div className="text-sm text-white/85">{subtitle}</div>}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
