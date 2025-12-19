'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header, Footer } from '@/components/layout';
import {
  ResultHeader,
  ResultDescription,
  SecondaryType,
  TipBox,
  ResultDNA,
  ShareButtons,
  CTASection,
} from '@/components/result';
import { Button } from '@/components/ui';
import { typeData } from '@/lib/quiz-data';
import { DesignerType } from '@/lib/types';
import { trackResultViewed } from '@/lib/analytics';

export default function ResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const primaryType = params.tipus as DesignerType;
  const secondaryType = (searchParams.get('alt') || 'stratega') as DesignerType;
  const shareId = searchParams.get('s');

  const primary = typeData[primaryType];
  const secondary = typeData[secondaryType];

  // Generate mock percentages based on type (in real app, these would come from URL or API)
  const { percentages, scores } = useMemo(() => {
    const baseScores: Record<DesignerType, number> = {
      kameleon: 2,
      kivitelezo: 2,
      vizionarius: 2,
      rendszerepito: 2,
      kulturakutato: 2,
      hid: 2,
      kiserletezo: 2,
      stratega: 2,
    };

    // Boost primary and secondary
    baseScores[primaryType] = 8;
    baseScores[secondaryType] = 5;

    const total = Object.values(baseScores).reduce((a, b) => a + b, 0);

    const pcts: Record<DesignerType, number> = {} as Record<DesignerType, number>;
    for (const [type, score] of Object.entries(baseScores)) {
      pcts[type as DesignerType] = Math.round((score / total) * 100);
    }

    return { percentages: pcts, scores: baseScores };
  }, [primaryType, secondaryType]);

  // Track page view
  useEffect(() => {
    trackResultViewed(primaryType, secondaryType, !!shareId);
  }, [primaryType, secondaryType, shareId]);

  // Invalid type handling
  if (!primary) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-4">
              Ismeretlen típus
            </h1>
            <p className="text-[#6B7280] mb-6">
              Ez a designer típus nem létezik.
            </p>
            <Button onClick={() => (window.location.href = '/')}>
              Vissza a teszthez
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const shareUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_BASE_URL}/eredmeny/${primaryType}?alt=${secondaryType}&s=${shareId}`;

  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto"
        >
          <ResultHeader type={primary} percentage={percentages[primaryType]} />

          <ResultDescription type={primary} />

          {secondary && (
            <SecondaryType
              type={secondary}
              percentage={percentages[secondaryType]}
            />
          )}

          <TipBox primary={primaryType} secondary={secondaryType} />

          <ResultDNA scores={scores} percentages={percentages} />

          <ShareButtons type={primary} shareUrl={shareUrl} />

          <CTASection />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="text-center mt-8"
          >
            <Button variant="ghost" onClick={() => (window.location.href = '/')}>
              ← Teszt újrakezdése
            </Button>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
