'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LIVING_MOTION } from '@/lib/theme/livingCanvasTokens';

export interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverLift?: boolean;
  glow?: boolean;
  interactive?: boolean;
  role?: string;
  ariaLabel?: string;
}

export const MotionCard: React.FC<MotionCardProps> = ({
  children,
  className = '',
  onClick,
  hoverLift = true,
  glow = false,
  interactive = false,
  role,
  ariaLabel,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const isClickable = Boolean(onClick) || interactive;

  return (
    <motion.div
      onClick={onClick}
      role={role || (isClickable ? 'button' : undefined)}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      whileHover={
        !shouldReduceMotion && (hoverLift || isClickable)
          ? { y: -4, scale: 1.008 }
          : undefined
      }
      whileTap={
        !shouldReduceMotion && isClickable
          ? { scale: 0.985 }
          : undefined
      }
      transition={LIVING_MOTION.springSnappy}
      className={`relative rounded-3xl p-6 transition-shadow duration-300 ${
        isClickable ? 'cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-amber-500/50' : ''
      } ${
        glow
          ? 'shadow-lg shadow-amber-500/5 hover:shadow-xl hover:shadow-amber-500/10'
          : 'shadow-sm hover:shadow-md'
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};
