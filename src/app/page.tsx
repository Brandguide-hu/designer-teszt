'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { Header, Footer } from '@/components/layout';
import Hero from '@/components/Hero';
import { QuizContainer } from '@/components/quiz';
import { EmailForm } from '@/components/email';
import Loading from '@/components/Loading';
import { QuizResult } from '@/lib/types';
import { generateShareId } from '@/lib/share';
import { typeData } from '@/lib/quiz-data';

type Phase = 'hero' | 'quiz' | 'email' | 'loading';

export default function Home() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('hero');
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const handleQuizComplete = useCallback(
    (quizResult: QuizResult, _answers: Record<number, string>, subId: string) => {
      setResult(quizResult);
      setSubmissionId(subId);
      setPhase('email');
    },
    []
  );

  const handleEmailSuccess = useCallback(() => {
    setPhase('loading');
  }, []);

  const handleLoadingComplete = useCallback(() => {
    if (result) {
      const shareId = generateShareId();
      router.push(
        `/eredmeny/${result.primary}?alt=${result.secondary}&s=${shareId}`
      );
    }
  }, [result, router]);

  // Build result data for submission
  const getResultData = useCallback(() => {
    if (!result) return null;

    const allScoresData: Record<string, { score: number; percentage: number }> = {};
    for (const [type, score] of Object.entries(result.allScores)) {
      allScoresData[type] = {
        score,
        percentage: result.allPcts[type as keyof typeof result.allPcts],
      };
    }

    return {
      primaryType: result.primary,
      primaryTypeName: typeData[result.primary].name,
      primaryPercentage: result.primaryPct,
      secondaryType: result.secondary,
      secondaryTypeName: typeData[result.secondary].name,
      secondaryPercentage: result.secondaryPct,
      allScores: allScoresData,
    };
  }, [result]);

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {phase === 'hero' && (
            <Hero key="hero" onStart={() => setPhase('quiz')} />
          )}

          {phase === 'quiz' && (
            <QuizContainer key="quiz" onComplete={handleQuizComplete} />
          )}

          {phase === 'email' && result && submissionId && (
            <EmailForm
              key="email"
              result={result}
              submissionId={submissionId}
              resultData={getResultData()!}
              onSuccess={handleEmailSuccess}
            />
          )}

          {phase === 'loading' && (
            <Loading key="loading" onComplete={handleLoadingComplete} />
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
