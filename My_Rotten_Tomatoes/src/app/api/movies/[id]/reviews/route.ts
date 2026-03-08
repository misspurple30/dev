import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Movie from '@/models/Movie';
import mongoose from 'mongoose';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { rating, comment } = await request.json();

    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      return NextResponse.json(
        { error: 'Note invalide' },
        { status: 400 }
      );
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 3) {
      return NextResponse.json(
        { error: 'Commentaire invalide' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const movie = await Movie.findOne({ tmdbId: parseInt(params.id) });
    if (!movie) {
      return NextResponse.json(
        { error: 'Film non trouvé' },
        { status: 404 }
      );
    }

    const existingReview = movie.reviews.find(
      review => review.user.toString() === session.user.id
    );

    if (existingReview) {
      return NextResponse.json(
        { error: 'Vous avez déjà donné votre avis sur ce film' },
        { status: 400 }
      );
    }

    // Ajoute l'avis
    movie.reviews.push({
      user: new mongoose.Types.ObjectId(session.user.id),
      userName: session.user.name || 'Anonyme',
      rating,
      comment: comment.trim(),
      createdAt: new Date()
    });

    const totalRating = movie.reviews.reduce((sum, review) => sum + review.rating, 0);
    movie.averageRating = totalRating / movie.reviews.length;

    await movie.save();

    return NextResponse.json({
      message: 'Avis ajouté avec succès',
      review: movie.reviews[movie.reviews.length - 1],
      averageRating: movie.averageRating
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'avis:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}