import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext'],
});

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  title: 'Designer Típus Teszt | Hello Yellow',
  description:
    'Fedezd fel, milyen típusú designer vagy! 10 kérdés, 2 perc, és megmutatjuk az erősségeidet.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://teszt.brandguide.hu'
  ),
  openGraph: {
    title: 'Designer Típus Teszt | Hello Yellow',
    description:
      'Fedezd fel, milyen típusú designer vagy! 10 kérdés, 2 perc, és megmutatjuk az erősségeidet.',
    type: 'website',
    locale: 'hu_HU',
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: 'Designer Típus Teszt',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Designer Típus Teszt | Hello Yellow',
    description:
      'Fedezd fel, milyen típusú designer vagy! 10 kérdés, 2 perc, és megmutatjuk az erősségeidet.',
    images: ['/og/default.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <head>
        {GTM_ID && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        )}
      </head>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
