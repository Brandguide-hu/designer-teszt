'use client';

import { motion } from 'framer-motion';
import { Button, Card } from '@/components/ui';
import { trackCTAClicked } from '@/lib/analytics';

export default function CTASection() {
  const handleClick = () => {
    trackCTAClicked('result_page');
    window.open('https://ai.brandguide.hu', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6 }}
    >
      <Card
        variant="elevated"
        padding="lg"
        className="text-center bg-gradient-to-br from-[#FFF012]/20 to-[#FFF012]/5"
      >
        <span className="text-4xl mb-4 block">🤖</span>
        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
          Fedezd fel az AI mentor lehetőségeit!
        </h3>
        <p className="text-[#6B7280] mb-6 max-w-md mx-auto">
          A brandguide AI mentorral személyre szabott tanácsokat kapsz a
          karriered és skilleid fejlesztéséhez.
        </p>
        <Button size="lg" onClick={handleClick}>
          Ismerkedj meg a brandguide-dal
        </Button>
      </Card>
    </motion.div>
  );
}
