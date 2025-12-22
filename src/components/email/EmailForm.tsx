'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button, Input, Checkbox } from '@/components/ui';
import { QuizResult } from '@/lib/types';
import { trackEmailSubmitted } from '@/lib/analytics';
import { completeSubmission } from '@/lib/supabase';

interface ResultData {
  primaryType: string;
  primaryTypeName: string;
  primaryPercentage: number;
  secondaryType: string;
  secondaryTypeName: string;
  secondaryPercentage: number;
  allScores: Record<string, { score: number; percentage: number }>;
}

interface EmailFormProps {
  result: QuizResult;
  submissionId: string;
  resultData: ResultData;
  onSuccess: () => void;
}

interface FormData {
  email: string;
  gdpr: boolean;
}

export default function EmailForm({
  result,
  submissionId,
  resultData,
  onSuccess,
}: EmailFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Save to Audienceful
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          primaryType: result.primary,
          secondaryType: result.secondary,
          allScores: result.allScores,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Hiba történt');
      }

      // Complete submission in Supabase with email
      await completeSubmission(submissionId, data.email, resultData);

      trackEmailSubmitted(result.primary);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message === 'Subscription failed'
            ? 'Ezzel az email címmel már feliratkoztál. Nézd meg a postaládád!'
            : err.message
          : 'Hiba történt. Kérlek, próbáld újra.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Skip email - mark as anonymous
  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      await completeSubmission(submissionId, null, resultData);
      onSuccess();
    } catch {
      setError('Hiba történt. Kérlek, próbáld újra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-3">
          Kész is!
        </h2>
        <p className="text-[#6B7280] text-lg">
          Add meg az email címed, és megmutatjuk, milyen típusú designer vagy!
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          id="email"
          type="email"
          placeholder="designer@example.com"
          {...register('email', {
            required: 'Kérlek, add meg az email címed',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Kérlek, adj meg érvényes email címet',
            },
          })}
          error={errors.email?.message}
        />

        <Checkbox
          id="gdpr"
          label="Elfogadom az adatkezelési tájékoztatót, és hozzájárulok, hogy a Hello Yellow hírlevelet küldjön nekem."
          {...register('gdpr', {
            required: 'Az adatkezelési hozzájárulás kötelező',
          })}
          error={errors.gdpr?.message}
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#EF4444] text-sm text-center"
          >
            {error}
          </motion.p>
        )}

        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          className="w-full"
        >
          Mutasd az eredményem!
        </Button>

        <button
          type="button"
          onClick={handleSkip}
          disabled={isSubmitting}
          className="w-full text-center text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
        >
          Kihagyom, csak mutasd az eredményt →
        </button>
      </form>
    </motion.div>
  );
}
