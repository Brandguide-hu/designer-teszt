'use client';

import { motion } from 'framer-motion';
import { TypeInfo } from '@/lib/types';
import { Card } from '@/components/ui';

interface SecondaryTypeProps {
  type: TypeInfo;
  percentage: number;
}

export default function SecondaryType({ type, percentage }: SecondaryTypeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <Card
        variant="elevated"
        padding="md"
        className="mb-8"
        style={{ borderLeft: `4px solid ${type.color}` }}
      >
        <div className="flex items-start gap-4">
          <span className="text-4xl">{type.emoji}</span>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Másodlagos típusod:</p>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">
              {type.name}
            </h3>
            <p className="text-[#6B7280]">
              {percentage}% egyezés • {type.shortDescription}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
