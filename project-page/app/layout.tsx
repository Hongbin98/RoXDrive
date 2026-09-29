import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { sitePath } from '@/lib/site-path';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hongbin98.github.io/RoXDrive/'),
  title: 'RoXDrive — Action-Faithful Closed-Loop RL',
  description: 'Closed-loop reinforcement learning for end-to-end autonomous driving via action-faithful world-model rollouts.',
  icons: { icon: sitePath('/favicon.svg') },
  openGraph: {
    type: 'website',
    title: 'RoXDrive — Action-Faithful Closed-Loop RL',
    description: 'Reliable policy optimization from action-faithful world-model rollouts.',
    siteName: 'RoXDrive',
    images: [{ url: sitePath('/roxdrive-og.png'), width: 1733, height: 910, alt: 'RoXDrive: Action-Faithful Closed-Loop RL' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoXDrive — Action-Faithful Closed-Loop RL',
    description: 'Reliable policy optimization from action-faithful world-model rollouts.',
    images: [sitePath('/roxdrive-og.png')],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
