import { Inter } from 'next/font/google';
import Header from '@/components/common/Header';
import { getServerSession } from 'next-auth/next';
import SessionProvider from '@/components/providers/SessionProvider';
import './globals.css';
import Footer from '@/components/common/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MyRottenTomatoes',
  description: 'Votre plateforme de critiques de films',
  keywords: 'films, critiques, cinéma, movies, reviews',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  return (
    <html lang="fr">
      <body className={`${inter.className} bg-[#141414] text-white`}>
        <SessionProvider session={session}>
          <Header />
          <div className="min-h-screen">
            {children}
          </div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
