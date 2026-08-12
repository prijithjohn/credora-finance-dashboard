import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Credora',
  description: 'Digital Alpha finance dashboard foundation'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
