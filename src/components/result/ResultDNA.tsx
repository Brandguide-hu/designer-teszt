'use client';

import { motion } from 'framer-motion';
import { DesignerType } from '@/lib/types';
import { typeData } from '@/lib/quiz-data';
import { Card } from '@/components/ui';

interface ResultDNAProps {
  scores: Record<DesignerType, number>;
  percentages: Record<DesignerType, number>;
}

const allTypes: DesignerType[] = [
  'vizionarius',
  'stratega',
  'kulturakutato',
  'kameleon',
  'kivitelezo',
  'rendszerepito',
  'kiserletezo',
  'hid',
];

export default function ResultDNA({ scores, percentages }: ResultDNAProps) {
  // Sort by percentage
  const sortedTypes = [...allTypes].sort(
    (a, b) => percentages[b] - percentages[a]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <Card variant="outlined" padding="lg" className="mb-8">
        <h3 className="text-xl font-bold text-[#1A1A1A] mb-6">
          A teljes Designer DNS-ed
        </h3>

        <div className="space-y-4">
          {sortedTypes.map((typeId, index) => {
            const type = typeData[typeId];
            const pct = percentages[typeId];

            return (
              <motion.div
                key={typeId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{type.emoji}</span>
                    <span className="font-medium text-[#1A1A1A]">
                      {type.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#6B7280]">
                    {pct}%
                  </span>
                </div>
                <div className="w-full h-3 bg-[#E5E5E5] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: type.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
