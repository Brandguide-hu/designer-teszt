'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui';
import { combinationTips } from '@/lib/quiz-data';
import { DesignerType } from '@/lib/types';

interface TipBoxProps {
  primary: DesignerType;
  secondary: DesignerType;
}

export default function TipBox({ primary, secondary }: TipBoxProps) {
  const key = `${primary}_${secondary}`;
  const tip = combinationTips[key] || combinationTips.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <Card
        variant="default"
        padding="lg"
        className="mb-8 bg-[#FFF012]/10 border-2 border-[#FFF012]"
      >
        <div className="flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
              Mit jelent ez a kombináció?
            </h3>
            <p className="text-[#1A1A1A] leading-relaxed">{tip}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
