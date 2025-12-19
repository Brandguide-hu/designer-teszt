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

type Phase = 'hero' | 'quiz' | 'email' | 'loading';

export default function Home() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('hero');
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleQuizComplete = useCallback((quizResult: QuizResult) => {
    setResult(quizResult);
    setPhase('email');
  }, []);

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

          {phase === 'email' && result && (
            <EmailForm
              key="email"
              result={result}
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
