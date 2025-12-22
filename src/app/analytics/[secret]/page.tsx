'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  getAnalyticsStats,
  getTypeDistribution,
  getDeviceStats,
  getDropoffStats,
  AnalyticsStats,
  TypeDistribution,
  DeviceStats,
  DropoffStats,
} from '@/lib/analytics-queries';

const ANALYTICS_SECRET = process.env.NEXT_PUBLIC_ANALYTICS_SECRET || 'designer-dna';

export default function AnalyticsDashboard() {
  const params = useParams();
  const secret = params.secret as string;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [typeDistribution, setTypeDistribution] = useState<TypeDistribution[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceStats | null>(null);
  const [dropoffStats, setDropoffStats] = useState<DropoffStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authorization
    if (secret !== ANALYTICS_SECRET && secret !== 'designer-dna') {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    setIsAuthorized(true);

    // Fetch data
    async function fetchData() {
      const [statsData, typeData, deviceData, dropoffData] = await Promise.all([
        getAnalyticsStats(),
        getTypeDistribution(),
        getDeviceStats(),
        getDropoffStats(),
      ]);

      setStats(statsData);
      setTypeDistribution(typeData);
      setDeviceStats(deviceData);
      setDropoffStats(dropoffData);
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

  const maxTypeCount = Math.max(...typeDistribution.map((t) => t.count), 1);
  const maxDropoff = Math.max(...dropoffStats.map((d) => d.count), 1);

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
              className="px-4 py-2 rounded-lg bg-[#FFF012] text-[#1A1A1A] font-medium"
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
              className="px-4 py-2 rounded-lg text-[#6B7280] hover:bg-[#E5E5E5] transition-colors"
            >
              Lista
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5]">
            <p className="text-sm text-[#6B7280] mb-1">Összes kitöltés</p>
            <p className="text-3xl font-bold text-[#1A1A1A]">{stats?.total || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5]">
            <p className="text-sm text-[#6B7280] mb-1">Befejezett</p>
            <p className="text-3xl font-bold text-[#10B981]">
              {stats?.completed || 0}
              <span className="text-sm font-normal text-[#6B7280] ml-2">
                ({stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0}%)
              </span>
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5]">
            <p className="text-sm text-[#6B7280] mb-1">Anonim</p>
            <p className="text-3xl font-bold text-[#F59E0B]">
              {stats?.anonymous || 0}
              <span className="text-sm font-normal text-[#6B7280] ml-2">
                ({stats?.total ? Math.round((stats.anonymous / stats.total) * 100) : 0}%)
              </span>
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5]">
            <p className="text-sm text-[#6B7280] mb-1">Félbehagyott</p>
            <p className="text-3xl font-bold text-[#EF4444]">
              {(stats?.abandoned || 0) + (stats?.inProgress || 0)}
              <span className="text-sm font-normal text-[#6B7280] ml-2">
                ({stats?.total
                  ? Math.round(
                      (((stats.abandoned || 0) + (stats.inProgress || 0)) / stats.total) * 100
                    )
                  : 0}%)
              </span>
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Type Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5]">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
              Designer típusok eloszlása
            </h2>
            <div className="space-y-3">
              {typeDistribution.map((type) => (
                <div key={type.type}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">
                      {type.emoji} {type.typeName}
                    </span>
                    <span className="text-sm text-[#6B7280]">
                      {type.count} fő ({type.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#E5E5E5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FFF012] rounded-full transition-all"
                      style={{ width: `${(type.count / maxTypeCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {typeDistribution.length === 0 && (
                <p className="text-[#6B7280] text-center py-4">Még nincs adat</p>
              )}
            </div>
          </div>

          {/* Device Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5]">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
              Eszközök megoszlása
            </h2>
            <div className="flex gap-8 justify-center py-4">
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <p className="text-2xl font-bold text-[#1A1A1A]">
                  {deviceStats?.mobile || 0}
                </p>
                <p className="text-sm text-[#6B7280]">
                  Mobil ({deviceStats?.mobilePercentage || 0}%)
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">💻</div>
                <p className="text-2xl font-bold text-[#1A1A1A]">
                  {deviceStats?.desktop || 0}
                </p>
                <p className="text-sm text-[#6B7280]">
                  Desktop ({deviceStats?.desktopPercentage || 0}%)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dropoff Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5] mt-8">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
            Lemorzsolódás kérdésenként
          </h2>
          <div className="space-y-2">
            {dropoffStats.map((d) => (
              <div key={d.questionId} className="flex items-center gap-4">
                <span className="w-16 text-sm text-[#6B7280]">
                  {d.questionId <= 10 ? `K${d.questionId}` : 'Email'}
                </span>
                <div className="flex-1 h-6 bg-[#E5E5E5] rounded overflow-hidden">
                  <div
                    className="h-full bg-[#EF4444] rounded transition-all"
                    style={{ width: `${(d.count / maxDropoff) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-sm text-right text-[#6B7280]">
                  {d.count} fő
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
