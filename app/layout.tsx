import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Penjulum | Premium Denim',
  description: 'Hand-painted artistry meets premium denim. Wear your story.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
