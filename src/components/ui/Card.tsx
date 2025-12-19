'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white',
    elevated: 'bg-white shadow-xl',
    outlined: 'bg-white border-2 border-[#E5E5E5]',
  };

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <motion.div
      className={`rounded-2xl ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
