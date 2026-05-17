import type {Metadata} from 'next';
import './globals.css'; 
import { Bricolage_Grotesque } from 'next/font/google';
import { Navbar } from '@/components/navbar';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
});

export const metadata: Metadata = {
  title: 'BayFam Bakery',
  description: 'A website for BayFam Bakery.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body suppressHydrationWarning className="font-sans min-h-screen flex flex-col bg-[#FDFBF7]">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
