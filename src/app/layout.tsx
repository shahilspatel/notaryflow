import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NotaryFlow - Professional Business Management for Loan Signing Agents',
  description: 'Run your notary business with less chaos. Accept bookings, sync to Google Calendar, send reminders, generate invoices, collect payments, and track mileage.',
  keywords: ['notary', 'loan signing', 'appointment scheduling', 'business management', 'payments'],
  authors: [{ name: 'NotaryFlow' }],
  creator: 'NotaryFlow',
  publisher: 'NotaryFlow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://notaryflow.app'),
  openGraph: {
    title: 'NotaryFlow - Professional Notary Business Management',
    description: 'Accept bookings, sync to Google Calendar, send reminders, generate invoices, collect payments, and track mileage.',
    url: '/',
    siteName: 'NotaryFlow',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NotaryFlow - Professional Notary Business Management',
    description: 'Accept bookings, sync to Google Calendar, send reminders, generate invoices, collect payments, and track mileage.',
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
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.stripe.com https://resend.com;" />
      </head>
      <body className="min-h-screen bg-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
