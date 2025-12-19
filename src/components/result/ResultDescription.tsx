'use client';

import { motion } from 'framer-motion';
import { TypeInfo } from '@/lib/types';
import { Card } from '@/components/ui';

interface ResultDescriptionProps {
  type: TypeInfo;
}

export default function ResultDescription({ type }: ResultDescriptionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card variant="outlined" padding="lg" className="mb-8">
        <p className="text-lg text-[#1A1A1A] leading-relaxed">
          {type.longDescription}
        </p>
      </Card>
    </motion.div>
  );
}
