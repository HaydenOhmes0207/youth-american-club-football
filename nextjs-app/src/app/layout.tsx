import type { Metadata } from 'next';
import { Barlow } from 'next/font/google';
import './globals.css';
import '@/components/components.css';
import DemoShell from '@/components/DemoShell';
import { ToastProvider } from '@/components/Toast';

const barlow = Barlow({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-barlow',
});

export const metadata: Metadata = {
  title: 'Youth American Club Football',
  description: 'Youth football club management platform',
};

export default function RootLayout() {
  return (
    <html lang="en" className="bg-background">
      <body className={`${barlow.className} ${barlow.variable}`}>
        <ToastProvider>
          <DemoShell />
        </ToastProvider>
      </body>
    </html>
  );
}
