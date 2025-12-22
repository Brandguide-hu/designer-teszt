import { ImageResponse } from 'next/og';

// Load Inter font from Google Fonts (TTF format)
const interBoldPromise = fetch(
  'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf'
).then((res) => res.arrayBuffer());

const interMediumPromise = fetch(
  'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf'
).then((res) => res.arrayBuffer());

export async function GET() {
  const [interBold, interMedium] = await Promise.all([
    interBoldPromise,
    interMediumPromise,
  ]);

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
          fontFamily: 'Inter',
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
            padding: '64px',
            width: '100%',
            flex: 1,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          {/* Logo text */}
          <div
            style={{
              display: 'flex',
              fontSize: '32px',
              fontWeight: 700,
              color: '#222331',
              marginBottom: '48px',
              letterSpacing: '0.02em',
            }}
          >
            helloyellow
          </div>

          {/* Main headline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '56px',
                fontWeight: 700,
                color: '#222331',
                marginBottom: '8px',
              }}
            >
              Milyen típusú
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: '56px',
                  fontWeight: 700,
                  color: '#222331',
                }}
              >
                designer vagy?
              </div>
              {/* Underline */}
              <div
                style={{
                  display: 'flex',
                  width: '340px',
                  height: '8px',
                  backgroundColor: '#FFF012',
                  borderRadius: '4px',
                  marginTop: '-12px',
                }}
              />
            </div>
          </div>

          {/* Subheadline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '24px',
                fontWeight: 500,
                color: '#70728E',
                marginBottom: '8px',
              }}
            >
              10 egyszerű kérdés, és megmutatjuk,
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '24px',
                fontWeight: 500,
                color: '#70728E',
                marginBottom: '8px',
              }}
            >
              milyen designer típusba tartozol.
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '24px',
                fontWeight: 700,
                color: '#222331',
              }}
            >
              Fedezd fel az erősségeid!
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginTop: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '18px',
              fontWeight: 700,
              color: '#222331',
              letterSpacing: '0.05em',
            }}
          >
            DESIGNER TÍPUS TESZT
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interBold,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: interMedium,
          weight: 500,
          style: 'normal',
        },
      ],
    }
  );
}
