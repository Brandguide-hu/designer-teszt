'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { trackQuizStart } from '@/lib/analytics';

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  const handleStart = () => {
    trackQuizStart();
    onStart();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto text-center py-12 md:py-20"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="text-6xl md:text-7xl mb-6"
      >
        🎨
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-6 leading-tight"
      >
        Milyen típusú
        <br />
        <span className="text-[#1A1A1A] relative">
          designer
          <motion.span
            className="absolute -bottom-2 left-0 w-full h-3 bg-[#FFF012] -z-10"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          />
        </span>{' '}
        vagy?
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg md:text-xl text-[#6B7280] mb-8 max-w-md mx-auto"
      >
        10 egyszerű kérdés, és megmutatjuk, milyen designer típusba tartozol. Fedezd fel az erősségeid!
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button size="lg" onClick={handleStart}>
          Kezdjük! →
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-sm text-[#6B7280] mt-6"
      >
        ⏱️ Kb. 2 perc • 🔒 Anonim
      </motion.p>
    </motion.div>
  );
}
