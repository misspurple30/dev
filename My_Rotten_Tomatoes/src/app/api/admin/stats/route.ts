import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getDetailedStats, getTopMovies, getRecentActivity } from '@/lib/actions/admin';

interface AdminUser {
  name?: string | null;
  image?: string | null;
  role?: string | null;
}

export async function GET() {
  const session = await getServerSession() as { user?: AdminUser };
  try {
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const [stats, topMovies, activities] = await Promise.all([
      getDetailedStats(),
      getTopMovies(),
      getRecentActivity()
    ]);

    return NextResponse.json({
      stats,
      topMovies,
      activities
    });
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}