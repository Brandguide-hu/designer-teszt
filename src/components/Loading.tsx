'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingProps {
  onComplete: () => void;
}

const loadingMessages = [
  'Elemezzük a válaszaidat...',
  'Kiszámoljuk a designer DNS-edet...',
  'Megtaláljuk a típusodat...',
];

export default function Loading({ onComplete }: LoadingProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 800);

    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-md mx-auto text-center py-20"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 mx-auto mb-8"
      >
        <svg viewBox="0 0 50 50" className="w-full h-full">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#E5E5E5"
            strokeWidth="4"
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#FFF012"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="80"
            strokeDashoffset="60"
          />
        </svg>
      </motion.div>

      <motion.p
        key={messageIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-lg text-[#6B7280]"
      >
        {loadingMessages[messageIndex]}
      </motion.p>
    </motion.div>
  );
}
