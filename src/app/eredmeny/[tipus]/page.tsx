import { Metadata } from 'next';
import { Suspense } from 'react';
import ResultPageClient from './ResultPageClient';

const typeNames: Record<string, string> = {
  kameleon: 'Kaméleon',
  kivitelezo: 'Kivitelező sztár',
  vizionarius: 'Vízionárius',
  rendszerepito: 'Rendszerépítő',
  kulturakutato: 'Kultúrakutató',
  hid: 'Híd',
  kiserletezo: 'Kísérletező',
  stratega: 'Stratéga',
};

interface PageProps {
  params: Promise<{ tipus: string }>;
  searchParams: Promise<{ alt?: string; primaryPct?: string; secondaryPct?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const primary = resolvedParams.tipus || 'vizionarius';
  const secondary = resolvedSearchParams.alt || 'stratega';
  const primaryPct = resolvedSearchParams.primaryPct || '35';
  const secondaryPct = resolvedSearchParams.secondaryPct || '20';

  const primaryName = typeNames[primary] || 'Designer';
  const secondaryName = typeNames[secondary] || 'Stratéga';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://teszt.helloyellow.hu';
  const ogImageUrl = `${baseUrl}/api/og?primary=${primary}&primaryPct=${primaryPct}&secondary=${secondary}&secondaryPct=${secondaryPct}`;

  const title = `${primaryName} vagyok! – Designer Típus Teszt`;
  const description = `Az én fő típusom: ${primaryName} (${primaryPct}%), altípusom: ${secondaryName} (${secondaryPct}%). Te melyik vagy? Töltsd ki a tesztet és tudd meg!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/eredmeny/${primary}?alt=${secondary}&primaryPct=${primaryPct}&secondaryPct=${secondaryPct}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Designer típus: ${primaryName}`,
        },
      ],
      siteName: 'Designer Típus Teszt',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
        <div className="animate-pulse text-[#6B7280]">Töltés...</div>
      </div>
    }>
      <ResultPageClient />
    </Suspense>
  );
}
