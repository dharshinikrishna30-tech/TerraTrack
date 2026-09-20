import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Wind, Sun, Zap, Droplets } from 'lucide-react';

export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Ambient gradient orbs */}
      <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-mint-500/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-emerald-700/10 rounded-full blur-3xl animate-float-delayed pointer-events-none" />

      {/* Floating Leaves and Icons */}
      <motion.div
        animate={{
          y: [-10, 15, -10],
          x: [0, 8, 0],
          rotate: [0, 12, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 left-[12%] text-emerald-400/20"
      >
        <Leaf className="w-10 h-10" />
      </motion.div>

      <motion.div
        animate={{
          y: [12, -18, 12],
          x: [0, -10, 0],
          rotate: [0, -15, 0],
        }}
        transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/3 right-[15%] text-mint-400/20"
      >
        <Wind className="w-12 h-12" />
      </motion.div>

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.35, 0.15],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-28 left-[18%] text-emerald-300/20"
      >
        <Sun className="w-14 h-14" />
      </motion.div>

      <motion.div
        animate={{
          y: [-15, 10, -15],
          rotate: [-5, 5, -5],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/4 right-[22%] text-emerald-500/20"
      >
        <Droplets className="w-9 h-9" />
      </motion.div>

      <motion.div
        animate={{
          opacity: [0.1, 0.4, 0.1],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 right-[8%] text-mint-500/20"
      >
        <Zap className="w-8 h-8" />
      </motion.div>
    </div>
  );
};
