'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  getSubmissions,
  generateCSV,
  SubmissionWithAnswers,
} from '@/lib/analytics-queries';

const ANALYTICS_SECRET = process.env.NEXT_PUBLIC_ANALYTICS_SECRET || 'designer-dna';

const TYPE_INFO: Record<string, { name: string; emoji: string }> = {
  kameleon: { name: 'Kaméleon', emoji: '🦎' },
  kivitelezo: { name: 'Kivitelező', emoji: '⚡' },
  vizionarius: { name: 'Vízionárius', emoji: '🚀' },
  rendszerepito: { name: 'Rendszerépítő', emoji: '🔧' },
  kulturakutato: { name: 'Kultúrakutató', emoji: '🔍' },
  hid: { name: 'Híd', emoji: '🌉' },
  kiserletezo: { name: 'Kísérletező', emoji: '🧪' },
  stratega: { name: 'Stratéga', emoji: '🎯' },
};

export default function ListPage() {
  const params = useParams();
  const secret = params.secret as string;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionWithAnswers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (secret !== ANALYTICS_SECRET && secret !== 'designer-dna') {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    setIsAuthorized(true);

    async function fetchData() {
      const data = await getSubmissions({
        status: statusFilter,
        device: deviceFilter,
        primaryType: typeFilter,
      });
      setSubmissions(data);
      setIsLoading(false);
    }

    fetchData();
  }, [secret, statusFilter, deviceFilter, typeFilter]);

  const handleExportCSV = () => {
    const csv = generateCSV(submissions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `designer-teszt-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              className="px-4 py-2 rounded-lg text-[#6B7280] hover:bg-[#E5E5E5] transition-colors"
            >
              Kérdések
            </Link>
            <Link
              href={`/analytics/${secret}/list`}
              className="px-4 py-2 rounded-lg bg-[#FFF012] text-[#1A1A1A] font-medium"
            >
              Lista
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E5E5] mb-6 flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-sm text-[#6B7280] mr-2">Státusz:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Összes</option>
              <option value="completed">Befejezett</option>
              <option value="anonymous">Anonim</option>
              <option value="abandoned">Félbehagyott</option>
              <option value="in_progress">Folyamatban</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-[#6B7280] mr-2">Eszköz:</label>
            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Összes</option>
              <option value="mobile">Mobil</option>
              <option value="desktop">Desktop</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-[#6B7280] mr-2">Típus:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Összes</option>
              {Object.entries(TYPE_INFO).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.emoji} {info.name}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-auto">
            <button
              onClick={handleExportCSV}
              className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#333] transition-colors"
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-[#6B7280] mb-4">
          {submissions.length} találat
        </p>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5]">
              <tr>
                <th className="text-left text-sm font-medium text-[#6B7280] px-4 py-3">
                  #
                </th>
                <th className="text-left text-sm font-medium text-[#6B7280] px-4 py-3">
                  Email
                </th>
                <th className="text-left text-sm font-medium text-[#6B7280] px-4 py-3">
                  Státusz
                </th>
                <th className="text-left text-sm font-medium text-[#6B7280] px-4 py-3">
                  Fő típus
                </th>
                <th className="text-left text-sm font-medium text-[#6B7280] px-4 py-3">
                  Altípus
                </th>
                <th className="text-left text-sm font-medium text-[#6B7280] px-4 py-3">
                  Eszköz
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s, index) => (
                <>
                  <tr
                    key={s.id}
                    className="border-b border-[#E5E5E5] hover:bg-[#FFFDF5] cursor-pointer"
                    onClick={() =>
                      setExpandedId(expandedId === s.id ? null : s.id)
                    }
                  >
                    <td className="px-4 py-3 text-sm text-[#6B7280]">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {s.email || (
                        <span className="text-[#6B7280]">–</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {s.status === 'completed' && (
                        <span className="text-[#10B981]">✅ Befejezett</span>
                      )}
                      {s.status === 'anonymous' && (
                        <span className="text-[#F59E0B]">👤 Anonim</span>
                      )}
                      {s.status === 'abandoned' && (
                        <span className="text-[#EF4444]">
                          ⚠️ K{s.last_question_answered}
                        </span>
                      )}
                      {s.status === 'in_progress' && (
                        <span className="text-[#6B7280]">
                          ⏳ K{s.last_question_answered}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {s.primary_type ? (
                        <span>
                          {TYPE_INFO[s.primary_type]?.emoji}{' '}
                          {TYPE_INFO[s.primary_type]?.name}{' '}
                          <span className="text-[#6B7280]">
                            {s.primary_percentage}%
                          </span>
                        </span>
                      ) : (
                        <span className="text-[#6B7280]">–</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {s.secondary_type ? (
                        <span>
                          {TYPE_INFO[s.secondary_type]?.emoji}{' '}
                          {TYPE_INFO[s.secondary_type]?.name}
                        </span>
                      ) : (
                        <span className="text-[#6B7280]">–</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {s.device === 'mobile' ? '📱' : '💻'}
                    </td>
                  </tr>

                  {/* Expanded details */}
                  {expandedId === s.id && (
                    <tr key={`${s.id}-details`}>
                      <td
                        colSpan={6}
                        className="px-4 py-4 bg-[#F5F5F5] border-b border-[#E5E5E5]"
                      >
                        <div className="space-y-4">
                          {/* Answers */}
                          <div>
                            <h4 className="font-medium text-sm text-[#1A1A1A] mb-2">
                              Válaszok:
                            </h4>
                            <div className="space-y-1">
                              {s.answers.map((a) => (
                                <p
                                  key={a.id}
                                  className="text-sm text-[#6B7280]"
                                >
                                  <span className="font-medium">
                                    K{a.question_id + 1}:
                                  </span>{' '}
                                  {a.answer_id}) {a.answer_text}
                                </p>
                              ))}
                              {s.answers.length === 0 && (
                                <p className="text-sm text-[#6B7280]">
                                  Nincs válasz
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Scores */}
                          {s.all_scores && (
                            <div>
                              <h4 className="font-medium text-sm text-[#1A1A1A] mb-2">
                                Eredmény:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(s.all_scores)
                                  .sort((a, b) => b[1].percentage - a[1].percentage)
                                  .map(([type, data]) => (
                                    <span
                                      key={type}
                                      className="text-xs bg-white px-2 py-1 rounded-lg border border-[#E5E5E5]"
                                    >
                                      {TYPE_INFO[type]?.emoji}{' '}
                                      {TYPE_INFO[type]?.name}: {data.percentage}%
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )}

                          {/* Timestamp */}
                          <p className="text-xs text-[#6B7280]">
                            Létrehozva: {new Date(s.created_at).toLocaleString('hu-HU')}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}

              {submissions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-[#6B7280]"
                  >
                    Nincs találat a megadott szűrőkkel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
