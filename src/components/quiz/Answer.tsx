'use client';

import { motion } from 'framer-motion';
import { Answer as AnswerType } from '@/lib/types';

interface AnswerProps {
  answer: AnswerType;
  index: number;
  isSelected: boolean;
  onSelect: (answerId: string) => void;
}

const letterMap = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function Answer({ answer, index, isSelected, onSelect }: AnswerProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.02, x: 8 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(answer.id)}
      className={`
        w-full p-4 md:p-5
        text-left
        rounded-xl
        border-2
        transition-all duration-200
        group
        ${
          isSelected
            ? 'border-[#FFF012] bg-[#FFF012]/10'
            : 'border-[#E5E5E5] hover:border-[#FFF012]/50 bg-white hover:bg-[#FFF012]/5'
        }
      `}
    >
      <div className="flex items-start gap-4">
        <span
          className={`
            flex-shrink-0
            w-8 h-8
            flex items-center justify-center
            rounded-lg
            text-sm font-bold
            transition-all duration-200
            ${
              isSelected
                ? 'bg-[#FFF012] text-[#1A1A1A]'
                : 'bg-[#E5E5E5] text-[#6B7280] group-hover:bg-[#FFF012]/20'
            }
          `}
        >
          {letterMap[index]}
        </span>
        <span className="text-[#1A1A1A] text-base md:text-lg leading-relaxed">
          {answer.text}
        </span>
      </div>
    </motion.button>
  );
}
