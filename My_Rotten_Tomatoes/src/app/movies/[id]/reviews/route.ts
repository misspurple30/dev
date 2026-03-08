import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Movie from '@/models/Movie';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const movie = await Movie.findOne({ tmdbId: parseInt(params.id) }).populate('reviews.user', 'name');
    if (!movie) {
      return NextResponse.json({ error: 'Film non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      reviews: movie.reviews,
      averageRating: movie.averageRating,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json({ error: 'Note et commentaire requis' }, { status: 400 });
    }

    const movie = await Movie.findOne({ tmdbId: parseInt(params.id) });
    if (!movie) {
      return NextResponse.json({ error: 'Film non trouvé' }, { status: 404 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier si l'utilisateur a déjà laissé un avis
    const existingReview = movie.reviews.find(
      (r: any) => r.user.toString() === session.user.id
    );
    if (existingReview) {
      return NextResponse.json({ error: 'Vous avez déjà donné votre avis sur ce film' }, { status: 400 });
    }

    movie.reviews.push({
      user: new mongoose.Types.ObjectId(session.user.id),
      userName: user.name,
      rating,
      comment,
    });

    movie.averageRating =
      movie.reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / movie.reviews.length;

    await movie.save();

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
