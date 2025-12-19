'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questions } from '@/lib/quiz-data';
import { calculateResult } from '@/lib/scoring';
import { QuizResult } from '@/lib/types';
import { trackQuestionAnswered, trackQuizCompleted } from '@/lib/analytics';
import Question from './Question';
import QuizProgress from './QuizProgress';

interface QuizContainerProps {
  onComplete: (result: QuizResult, answers: Record<number, string>) => void;
}

export default function QuizContainer({ onComplete }: QuizContainerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnswer = useCallback(
    (answerId: string) => {
      if (isTransitioning) return;

      // Track answer
      trackQuestionAnswered(currentQuestion, answerId);

      // Save answer
      const newAnswers = { ...answers, [currentQuestion]: answerId };
      setAnswers(newAnswers);

      // Start transition
      setIsTransitioning(true);

      // Wait for animation, then proceed
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
          setIsTransitioning(false);
        } else {
          // Quiz complete
          const result = calculateResult(newAnswers);
          trackQuizCompleted(result.primary, result.secondary);
          onComplete(result, newAnswers);
        }
      }, 400);
    },
    [currentQuestion, answers, isTransitioning, onComplete]
  );

  const question = questions[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <QuizProgress current={currentQuestion} total={questions.length} />

      <AnimatePresence mode="wait">
        <Question
          key={currentQuestion}
          question={question}
          selectedAnswer={answers[currentQuestion] || null}
          onAnswer={handleAnswer}
        />
      </AnimatePresence>
    </motion.div>
  );
}
