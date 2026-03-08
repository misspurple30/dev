import connectDB from '@/lib/mongodb';
import Movie from '@/models/Movie';
import { ObjectId } from 'mongodb';

export async function addReview(
  movieId: string,
  userId: string,
  userName: string,
  rating: number,
  comment: string
) {
  try {
    await connectDB();
    
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new Error('Film non trouvé');
    }

    movie.reviews.push({
      user: new ObjectId(userId),
      userName,
      rating,
      comment,
      createdAt: new Date()
    });

    await movie.save();
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'avis:', error);
    throw error;
  }
}

export async function deleteReview(movieId: string, reviewId: string) {
  try {
    await connectDB();
    
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new Error('Film non trouvé');
    }

    movie.reviews.pull(reviewId);
    await movie.save();
    
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'avis:', error);
    throw error;
  }
}