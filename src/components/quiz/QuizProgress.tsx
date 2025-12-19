'use client';

import { motion } from 'framer-motion';

interface QuizProgressProps {
  current: number;
  total: number;
}

export default function QuizProgress({ current, total }: QuizProgressProps) {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-[#6B7280]">
          Kérdés {current + 1} / {total}
        </span>
        <span className="text-sm font-medium text-[#1A1A1A]">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#FFF012] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
