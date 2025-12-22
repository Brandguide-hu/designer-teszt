'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getQuestionStats, QuestionStats } from '@/lib/analytics-queries';

const ANALYTICS_SECRET = process.env.NEXT_PUBLIC_ANALYTICS_SECRET || 'designer-dna';

export default function QuestionsPage() {
  const params = useParams();
  const secret = params.secret as string;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [questionStats, setQuestionStats] = useState<QuestionStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (secret !== ANALYTICS_SECRET && secret !== 'designer-dna') {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    setIsAuthorized(true);

    async function fetchData() {
      const data = await getQuestionStats();
      setQuestionStats(data);
      setIsLoading(false);
    }

    fetchData();
  }, [secret]);

  if (!isAuthorized && !isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">🔒 Hozzáférés megtagadva</h1>
          <p className="text-[#6B7280]">Hibás titkos kód.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
        <div className="animate-pulse text-[#6B7280]">Töltés...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E5E5] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#1A1A1A]">
            📊 Designer Teszt Analytics
          </h1>
          <nav className="flex gap-4">
            <Link
              href={`/analytics/${secret}`}
              className="px-4 py-2 rounded-lg text-[#6B7280] hover:bg-[#E5E5E5] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href={`/analytics/${secret}/questions`}
              className="px-4 py-2 rounded-lg bg-[#FFF012] text-[#1A1A1A] font-medium"
            >
              Kérdések
            </Link>
            <Link
              href={`/analytics/${secret}/list`}
              className="px-4 py-2 rounded-lg text-[#6B7280] hover:bg-[#E5E5E5] transition-colors"
            >
              Lista
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">
          Kérdésenkénti bontás
        </h2>

        <div className="space-y-8">
          {questionStats.map((q) => (
            <div
              key={q.questionId}
              className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5]"
            >
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">
                {q.questionId + 1}. kérdés
              </h3>
              <p className="text-[#6B7280] mb-4">"{q.questionText}"</p>
              <p className="text-sm text-[#6B7280] mb-4">
                Összes válasz: {q.totalResponses}
              </p>

              <div className="space-y-3">
                {q.answers.map((a, index) => {
                  const maxCount = q.answers[0]?.count || 1;
                  const isTop = index === 0;

                  return (
                    <div key={a.answerId}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm flex-1">
                          <span className="font-medium">{a.answerId})</span>{' '}
                          {a.answerText}
                          {isTop && (
                            <span className="ml-2 text-xs bg-[#FFF012] px-2 py-0.5 rounded-full">
                              legnépszerűbb
                            </span>
                          )}
                        </span>
                        <span className="text-sm text-[#6B7280] ml-4 whitespace-nowrap">
                          {a.count} ({a.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-[#E5E5E5] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isTop ? 'bg-[#FFF012]' : 'bg-[#6B7280]'
                          }`}
                          style={{ width: `${(a.count / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {questionStats.length === 0 && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-[#E5E5E5] text-center">
              <p className="text-[#6B7280]">Még nincs adat a kérdésekről.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
