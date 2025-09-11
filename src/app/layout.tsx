import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { ImageProvider } from '@/contexts/ImageContext';
import { SettingsProvider } from '@/contexts/SettingsContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Image Studio - Generador y Mejorador de Imágenes con IA',
  description: 'Crea y mejora imágenes increíbles usando inteligencia artificial. Generador de imágenes con múltiples estilos y herramientas de mejora profesional.',
  keywords: [
    'inteligencia artificial',
    'generador de imágenes',
    'AI',
    'arte digital',
    'mejora de imágenes',
    'upscaling',
    'restauración de fotos'
  ],
  authors: [{ name: 'AI Image Studio' }],
  creator: 'AI Image Studio',
  publisher: 'AI Image Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ai-image-studio.vercel.app'),
  openGraph: {
    title: 'AI Image Studio - Generador y Mejorador de Imágenes con IA',
    description: 'Crea y mejora imágenes increíbles usando inteligencia artificial. Múltiples estilos artísticos y herramientas profesionales.',
    url: 'https://ai-image-studio.vercel.app',
    siteName: 'AI Image Studio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Image Studio - Generador de Imágenes con IA',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Image Studio - Generador y Mejorador de Imágenes',
    description: 'Crea y mejora imágenes increíbles usando inteligencia artificial.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="msapplication-TileColor" content="#6366f1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SettingsProvider>
            <ImageProvider>
              <div className="min-h-screen bg-background">
                {children}
              </div>
            </ImageProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}