import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Movie from '@/models/Movie';
import User from '@/models/User';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await connectDB();

    const [movie, user] = await Promise.all([
      Movie.findOne({ tmdbId: parseInt(params.id) }),
      User.findById(session.user.id)
    ]);

    if (!movie || !user) {
      return NextResponse.json(
        { error: 'Film ou utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const isFavorite = movie.favorites.includes(user._id);

    if (isFavorite) {
      movie.favorites = movie.favorites.filter(
        id => id.toString() !== user._id.toString()
      );
      user.favorites = user.favorites.filter(
        id => id.toString() !== movie._id.toString()
      );
    } else {

      movie.favorites.push(user._id);
      user.favorites.push(movie._id);
    }

    await Promise.all([movie.save(), user.save()]);

    return NextResponse.json({
      message: isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
      isFavorite: !isFavorite,
      favorites: movie.favorites
    });

  } catch (error) {
    console.error('Erreur lors de la gestion des favoris:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}