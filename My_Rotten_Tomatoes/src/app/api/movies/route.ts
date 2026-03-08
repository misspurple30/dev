import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Movie from '@/models/Movie';

export async function GET() {
  try {
    await connectDB();
    const movies = await Movie.find({}).sort({ createdAt: -1 });
    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des films' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { movieId } = await request.json();
    await connectDB();
    await Movie.findByIdAndDelete(movieId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du film' },
      { status: 500 }
    );
  }
}
