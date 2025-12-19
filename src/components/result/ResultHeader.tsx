'use client';

import { motion } from 'framer-motion';
import { TypeInfo } from '@/lib/types';

interface ResultHeaderProps {
  type: TypeInfo;
  percentage: number;
}

export default function ResultHeader({ type, percentage }: ResultHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="text-7xl md:text-8xl mb-6"
      >
        {type.emoji}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[#6B7280] text-lg mb-2"
      >
        A te designer típusod:
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
        style={{ color: type.color }}
      >
        {type.name}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1A1A]/5"
      >
        <span className="text-2xl font-bold text-[#1A1A1A]">{percentage}%</span>
        <span className="text-[#6B7280]">egyezés</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xl md:text-2xl text-[#1A1A1A] mt-6 max-w-xl mx-auto"
      >
        {type.shortDescription}
      </motion.p>
    </motion.div>
  );
}
