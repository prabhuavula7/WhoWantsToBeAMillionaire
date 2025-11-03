import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function PrimaryButton({ children, className = '', variant = 'primary', neon = false, ...props }) {
  const shouldReduceMotion = useReducedMotion();

  const variantClass = variant === 'ghost'
    ? 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
    : variant === 'gold'
      ? 'btn-gold'
      : variant === 'danger'
        ? 'btn-danger'
        : 'btn-primary';

  const neonClass = neon ? 'neon-glow' : '';

  const whileHover = shouldReduceMotion ? {} : { scale: 1.03 };
  const whileTap = shouldReduceMotion ? {} : { scale: 0.985 };
  const transition = shouldReduceMotion ? { duration: 0.08 } : { type: 'spring', stiffness: 320, damping: 26 };

  return (
    <motion.button
      {...props}
      className={`${variantClass} ${neonClass} ${className}`.trim()}
      whileHover={whileHover}
      whileTap={whileTap}
      transition={transition}
    >
      {children}
    </motion.button>
  );
}
