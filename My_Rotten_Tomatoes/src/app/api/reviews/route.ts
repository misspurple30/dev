import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Movie from '@/models/Movie';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { movieId, userId, rating, comment } = await request.json();
    await connectDB();

    const review = {
      user: new ObjectId(userId),
      rating,
      comment,
      createdAt: new Date()
    };

    await Movie.findOneAndUpdate(
      { tmdbId: parseInt(movieId) },
      { $push: { reviews: review } },
      { new: true }
    );

    return NextResponse.json(
      { message: 'Avis ajouté avec succès' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'avis:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'ajout de l\'avis' },
      { status: 500 }
    );
  }
}