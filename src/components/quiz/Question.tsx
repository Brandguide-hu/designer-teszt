'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Question as QuestionType } from '@/lib/types';
import Answer from './Answer';

interface QuestionProps {
  question: QuestionType;
  selectedAnswer: string | null;
  onAnswer: (answerId: string) => void;
}

export default function Question({ question, selectedAnswer, onAnswer }: QuestionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full"
      >
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-8 md:mb-10 leading-tight"
        >
          {question.text}
        </motion.h2>

        <div className="space-y-3 md:space-y-4">
          {question.answers.map((answer, index) => (
            <Answer
              key={answer.id}
              answer={answer}
              index={index}
              isSelected={selectedAnswer === answer.id}
              onSelect={onAnswer}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
