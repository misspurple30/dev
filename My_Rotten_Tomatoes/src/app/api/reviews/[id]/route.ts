import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import Movie from '@/models/Movie';

interface Params {
  id: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await connectDB();
    const { movieId } = await request.json();

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return NextResponse.json({ error: 'Film non trouvé' }, { status: 404 });
    }

    const review = movie.reviews.id(params.id);
    if (!review) {
      return NextResponse.json({ error: 'Avis non trouvé' }, { status: 404 });
    }

    interface UserSession {
      id: string;
      role: string;
    }

    const user = session.user as UserSession;
    if (user.role !== 'admin' && review.user.toString() !== user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    movie.reviews.pull(params.id);
    await movie.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'avis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'avis' },
      { status: 500 }
    );
  }
}