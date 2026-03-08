import { Inter } from 'next/font/google';
import Header from '@/components/common/Header';
import { getServerSession } from 'next-auth/next';
import SessionProvider from '@/components/providers/SessionProvider';
import './globals.css';
import Footer from '@/components/common/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'My Rotten Tomatoes',
  description: 'Une plateforme de critiques de films',
  keywords: 'films, critiques, cinéma, movies, reviews',
  authors: [{ name: 'Team purple' }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="fr">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Header />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}