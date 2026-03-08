'use server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Movie from '@/models/Movie';
import { getMovieDetailsFromTMDB } from '@/lib/tmdb';
import { revalidatePath } from 'next/cache';

export async function getStats() {
  try {
    await connectDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [userCount, movieCount, movies, newUsersToday, genres] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Movie.find(),
      User.countDocuments({ createdAt: { $gte: today } }),
      Movie.distinct('genres')
    ]);

    const reviewCount = movies.reduce((acc, movie) => 
      acc + (movie.reviews?.length || 0), 0
    );

    // Calcule de la note moyenne
    let totalRating = 0;
    let totalReviews = 0;
    
    movies.forEach(movie => {
      if (movie.reviews && movie.reviews.length > 0) {
        totalReviews += movie.reviews.length;
        totalRating += movie.reviews.reduce((sum, review) => sum + review.rating, 0);
      }
    });

    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    return {
      userCount,
      movieCount,
      reviewCount,
      newUsersToday,
      totalGenres: genres.length,
      averageRating
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return {
      userCount: 0,
      movieCount: 0,
      reviewCount: 0,
      newUsersToday: 0,
      totalGenres: 0,
      averageRating: 0
    };
  }
}
export async function getAllReviews() {
  try {
    await connectDB();
    
    const movies = await Movie.aggregate([
      { $unwind: '$reviews' },
      {
        $project: {
          'id': '$reviews._id',
          'movieId': '$_id',
          'movieTitle': '$title',
          'userId': '$reviews.userId',
          'userName': '$reviews.userName',
          'rating': '$reviews.rating',
          'comment': '$reviews.comment',
          'createdAt': '$reviews.createdAt'
        }
      },
      { $sort: { 'createdAt': -1 } }
    ]);

    return JSON.parse(JSON.stringify(movies));
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    return [];
  }
}

export async function deleteReview(reviewId: string) {
  try {
    await connectDB();
    
    await Movie.updateOne(
      { 'reviews._id': reviewId },
      { $pull: { reviews: { _id: reviewId } } }
    );

    revalidatePath('/admin/reviews');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'avis:', error);
    throw error;
  }
}

export async function getAllUsers(page: number = 1, limit: number = 10) {
  try {
    await connectDB();
    
    // Compter le nombre total d'utilisateurs
    const totalUsers = await User.countDocuments({});
    
    // Calculer le nombre de documents à sauter
    const skip = (page - 1) * limit;
    
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    return {
      users: users.map(user => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString()
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return {
      users: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalUsers: 0
      }
    };
  }
}
export async function addUser(userData: {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}) {
  try {
    await connectDB();
    
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    const user = await User.create(userData);
    revalidatePath('/admin/users');
    
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    throw error;
  }
}

export async function updateUser(userId: string, userData: {
  name?: string;
  email?: string;
  password?: string;
  role?: 'user' | 'admin';
}) {
  try {
    await connectDB();
    
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    if (userData.email && userData.email !== user.email) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Cet email est déjà utilisé');
      }
    }

    Object.assign(user, userData);
    await user.save();
    revalidatePath('/admin/users');

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    await connectDB();
    await User.findByIdAndDelete(userId);
    return { success: true };
  } catch (error) {
    throw new Error('Erreur lors de la suppression de l\'utilisateur');
  }
}

export async function deleteMovie(movieId: string) {
  try {
    await connectDB();
    await Movie.findByIdAndDelete(movieId);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression du film:', error);
    throw new Error('Erreur lors de la suppression du film');
  }
}

export async function getMovies() {
  try {
    await connectDB();
    const movies = await Movie.find({})
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(movies));
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error);
    return [];
  }
}

export async function getTopMovies(limit = 10) {
  try {
    await connectDB();
    const movies = await Movie.aggregate([
      {
        $project: {
          title: 1,
          averageRating: { $avg: '$reviews.rating' },
          reviewCount: { $size: '$reviews' }
        }
      },
      { $sort: { averageRating: -1 } },
      { $limit: limit }
    ]);
    
    return movies.map(movie => ({
      id: movie._id.toString(),
      title: movie.title,
      averageRating: movie.averageRating || 0,
      reviewCount: movie.reviewCount || 0
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des meilleurs films:', error);
    return [];
  }
}
export async function updateMovie(movieId: string, data: {
  title: string;
  overview: string;
  genres: string[];
  director: string;
}) {
  try {
    await connectDB();
    
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new Error('Film non trouvé');
    }

    Object.assign(movie, data);
    await movie.save();
    revalidatePath('/admin/movies');

    return JSON.parse(JSON.stringify(movie));
  } catch (error) {
    console.error('Erreur lors de la mise à jour du film:', error);
    throw error;
  }
}

export async function getRecentActivity(limit = 20) {
  try {
    await connectDB();
    
    const [recentReviews, recentUsers, recentMovies] = await Promise.all([
      Movie.aggregate([
        { $unwind: '$reviews' },
        { $sort: { 'reviews.createdAt': -1 } },
        { $limit: limit },
        {
          $project: {
            type: { $literal: 'review' },
            description: {
              $concat: [
                'Nouvel avis sur ',
                '$title',
                ' par ',
                '$reviews.userName'
              ]
            },
            createdAt: '$reviews.createdAt'
          }
        }
      ]),
      User.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('name createdAt')
        .lean()
        .then(users => users.map(user => ({
          type: 'user',
          description: `Nouvel utilisateur : ${user.name}`,
          createdAt: user.createdAt
        }))),
      Movie.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('title createdAt')
        .lean()
        .then(movies => movies.map(movie => ({
          type: 'movie',
          description: `Nouveau film ajouté : ${movie.title}`,
          createdAt: movie.createdAt
        })))
    ]);

    const allActivities = [...recentReviews, ...recentUsers, ...recentMovies]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);

    return allActivities.map((activity, index) => ({
      id: index.toString(),
      ...activity,
      createdAt: activity.createdAt.toISOString()
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des activités récentes:', error);
    return [];
  }
}
export async function addManualMovie(data: {
  title: string;
  overview: string;
  releaseDate: string;
  director: string;
  genres: string[];
  posterPath?: string;
}) {
  try {
    await connectDB();
    
    // film avec le même titre existe déjà
    const existingMovie = await Movie.findOne({ 
      title: { $regex: `^${data.title}$`, $options: 'i' } 
    });
    
    if (existingMovie) {
      throw new Error('Un film avec ce titre existe déjà');
    }

    const newMovie = await Movie.create({
      tmdbId: -Date.now(), // ID négatif pour marquer comme ajouté manuellement
      title: data.title,
      overview: data.overview || '',
      posterPath: data.posterPath || '',
      releaseDate: data.releaseDate ? new Date(data.releaseDate) : null,
      director: data.director || 'Inconnu',
      genres: data.genres || [],
      averageRating: 0,
      reviews: [],
      favorites: []
    });

    revalidatePath('/admin/movies');
    return JSON.parse(JSON.stringify(newMovie));
  } catch (error) {
    console.error('Erreur lors de l\'ajout manuel du film:', error);
    throw error;
  }
}

export async function getDetailedStats() {
  try {
    await connectDB();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      userStats,
      movieStats,
      reviewStats
    ] = await Promise.all([
      User.aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            today: [
              { $match: { createdAt: { $gte: today } } },
              { $count: 'count' }
            ]
          }
        }
      ]),
      Movie.aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            genres: [
              { $unwind: '$genres' },
              { $group: { _id: null, count: { $addToSet: '$genres' } } }
            ]
          }
        }
      ]),
      Movie.aggregate([
        { $unwind: '$reviews' },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            averageRating: { $avg: '$reviews.rating' }
          }
        }
      ])
    ]);

    return {
      userCount: userStats[0]?.total[0]?.count || 0,
      newUsersToday: userStats[0]?.today[0]?.count || 0,
      movieCount: movieStats[0]?.total[0]?.count || 0,
      totalGenres: movieStats[0]?.genres[0]?.count?.length || 0,
      reviewCount: reviewStats[0]?.total || 0,
      averageRating: reviewStats[0]?.averageRating || 0
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques détaillées:', error);
    return {
      userCount: 0,
      newUsersToday: 0,
      movieCount: 0,
      totalGenres: 0,
      reviewCount: 0,
      averageRating: 0
    };
  }
}

export async function addMovie(tmdbId: number) {
  try {
    await connectDB();
    
    const existingMovie = await Movie.findOne({ tmdbId });
    if (existingMovie) {
      throw new Error('Ce film existe déjà dans la base de données');
    }

    const movieDetails = await getMovieDetailsFromTMDB(tmdbId);
    if (!movieDetails) {
      throw new Error('Impossible de récupérer les détails du film depuis TMDB');
    }
    
    const newMovie = await Movie.create({
      tmdbId,
      title: movieDetails.title,
      overview: movieDetails.overview || '',
      posterPath: movieDetails.poster_path || '',
      releaseDate: movieDetails.release_date,
      director: movieDetails.credits?.crew.find(p => p.job === 'Director')?.name || 'Inconnu',
      genres: movieDetails.genres?.map(g => g.name) || [],
      averageRating: 0,
      reviews: [],
      favorites: []
    });

    return JSON.parse(JSON.stringify(newMovie));
  } catch (error) {
    console.error('Erreur lors de l\'ajout du film:', error);
    throw error;
  }
}

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  try {
    await connectDB();
    await User.findByIdAndUpdate(userId, { role });
    return { success: true };
  } catch {
    throw new Error('Erreur lors de la mise à jour du rôle');
  }
}