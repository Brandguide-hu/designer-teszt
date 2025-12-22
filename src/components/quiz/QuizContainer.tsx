'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questions } from '@/lib/quiz-data';
import { calculateResult } from '@/lib/scoring';
import { QuizResult } from '@/lib/types';
import { trackQuestionAnswered, trackQuizCompleted } from '@/lib/analytics';
import {
  createSubmission,
  saveAnswer,
  getSessionId,
  getSubmission,
  getAnswers,
} from '@/lib/supabase';
import Question from './Question';
import QuizProgress from './QuizProgress';

interface QuizContainerProps {
  onComplete: (result: QuizResult, answers: Record<number, string>, submissionId: string) => void;
}

export default function QuizContainer({ onComplete }: QuizContainerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize or resume submission
  useEffect(() => {
    async function initSubmission() {
      // Check for existing session
      const existingSessionId = getSessionId();

      if (existingSessionId) {
        // Try to resume
        const submission = await getSubmission(existingSessionId);

        if (submission && submission.status === 'in_progress') {
          // Resume from where they left off
          const existingAnswers = await getAnswers(existingSessionId);
          const answersMap: Record<number, string> = {};

          existingAnswers.forEach((a) => {
            answersMap[a.question_id] = a.answer_id;
          });

          setSubmissionId(existingSessionId);
          setAnswers(answersMap);
          setCurrentQuestion(submission.last_question_answered);
          setIsLoading(false);
          return;
        }
      }

      // Create new submission
      const newId = await createSubmission();
      if (newId) {
        setSubmissionId(newId);
      }
      setIsLoading(false);
    }

    initSubmission();
  }, []);

  const handleAnswer = useCallback(
    async (answerId: string) => {
      if (isTransitioning || !submissionId) return;

      const question = questions[currentQuestion];
      const answer = question.answers.find((a) => a.id === answerId);

      // Track answer (GTM)
      trackQuestionAnswered(currentQuestion, answerId);

      // Save answer to Supabase
      await saveAnswer(
        submissionId,
        currentQuestion,
        answerId,
        question.text,
        answer?.text || ''
      );

      // Save answer locally
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
          onComplete(result, newAnswers, submissionId);
        }
      }, 400);
    },
    [currentQuestion, answers, isTransitioning, onComplete, submissionId]
  );

  const question = questions[currentQuestion];

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl mx-auto text-center py-12"
      >
        <div className="animate-pulse text-[#6B7280]">Töltés...</div>
      </motion.div>
    );
  }

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
