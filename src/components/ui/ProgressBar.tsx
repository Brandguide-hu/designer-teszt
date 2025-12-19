'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-[#6B7280]">
          {current} / {total}
        </span>
        <span className="text-sm font-medium text-[#6B7280]">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#FFF012] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
