import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

const types: Record<string, { name: string; emoji: string }> = {
  kameleon: { name: 'KAMÉLEON', emoji: '🦎' },
  kivitelezo: { name: 'KIVITELEZŐ SZTÁR', emoji: '⚡' },
  vizionarius: { name: 'VÍZIONÁRIUS', emoji: '🚀' },
  rendszerepito: { name: 'RENDSZERÉPÍTŐ', emoji: '🔧' },
  kulturakutato: { name: 'KULTÚRAKUTATÓ', emoji: '🔍' },
  hid: { name: 'HÍD', emoji: '🌉' },
  kiserletezo: { name: 'KÍSÉRLETEZŐ', emoji: '🧪' },
  stratega: { name: 'STRATÉGA', emoji: '🎯' },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const primary = searchParams.get('primary') || 'vizionarius';
  const primaryPct = parseInt(searchParams.get('primaryPct') || '50');
  const secondary = searchParams.get('secondary') || 'stratega';
  const secondaryPct = parseInt(searchParams.get('secondaryPct') || '25');

  const primaryType = types[primary] || types.vizionarius;
  const secondaryType = types[secondary] || types.stratega;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFF012',
          padding: '48px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '32px',
            padding: '48px',
            width: '100%',
            flex: 1,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ display: 'flex', fontSize: '80px', marginBottom: '16px' }}>
            {primaryType.emoji}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '64px',
              fontWeight: 700,
              color: '#222331',
              marginBottom: '24px',
              letterSpacing: '-0.02em',
            }}
          >
            {primaryType.name}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '320px',
                height: '16px',
                backgroundColor: '#E5E5E5',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: `${(primaryPct / 100) * 320}px`,
                  height: '100%',
                  backgroundColor: '#222331',
                  borderRadius: '8px',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '48px',
                fontWeight: 700,
                color: '#222331',
              }}
            >
              {primaryPct}%
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              width: '200px',
              height: '1px',
              backgroundColor: '#E5E5E5',
              marginBottom: '24px',
            }}
          />

          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 500,
              color: '#70728E',
            }}
          >
            + {secondaryType.emoji} {secondaryType.name} · {secondaryPct}%
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '18px',
              fontWeight: 600,
              color: '#222331',
              letterSpacing: '0.05em',
            }}
          >
            DESIGNER TÍPUS TESZT
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '18px',
              fontWeight: 500,
              color: '#70728E',
            }}
          >
            helloyellow.hu
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
