import connectDB from '@/lib/mongodb';
import Movie from '@/models/Movie';
import { FilterParams } from '@/types';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { getMovieDetailsFromTMDB } from '@/lib/tmdb';

const movieCache = new Map();

export async function getFavoriteMovies(userId: string, page = 1, limit = 10) {
  try {
    await connectDB();
    
    const skip = (page - 1) * limit;
    
    const [movies, total] = await Promise.all([
      Movie.find({ favorites: userId })
        .select('title posterPath averageRating tmdbId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Movie.countDocuments({ favorites: userId })
    ]);

    return {
      movies: JSON.parse(JSON.stringify(movies)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    return {
      movies: [],
      pagination: {
        page: 1,
        limit,
        total: 0,
        totalPages: 0
      }
    };
  }
}

export async function getAvailableGenres() {
  try {
    await connectDB();
    const genres = await Movie.distinct('genres');
    return genres.sort();
  } catch (error) {
    console.error('Erreur lors de la récupération des genres:', error);
    return [];
  }
}

export async function getAvailableYears() {
  try {
    await connectDB();
    const dates = await Movie.distinct('releaseDate');
    const years = dates.map(date => new Date(date).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a);
  } catch (error) {
    console.error('Erreur lors de la récupération des années:', error);
    return [];
  }
}

export async function getMovieDetails(id: string) {
  try {
    await connectDB();
    
    if (movieCache.has(id)) {
      return movieCache.get(id);
    }

    let movie = await Movie.findOne({ tmdbId: parseInt(id) })
      .populate('reviews.user', 'name email')
      .lean();

    if (!movie && mongoose.Types.ObjectId.isValid(id)) {
      movie = await Movie.findById(id)
        .populate('reviews.user', 'name email')
        .lean();
    }

    if (!movie) {
      const tmdbMovie = await getMovieDetailsFromTMDB(parseInt(id));
      if (!tmdbMovie) return null;

      const newMovie = await Movie.create({
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        overview: tmdbMovie.overview || '',
        posterPath: tmdbMovie.poster_path,
        releaseDate: tmdbMovie.release_date,
        genres: tmdbMovie.genres?.map((g: any) => g.name) || [],
        director: tmdbMovie.credits?.crew.find((p: any) => p.job === 'Director')?.name || 'Inconnu',
        averageRating: tmdbMovie.vote_average / 2,
        reviews: [],
        favorites: []
      });

      movie = newMovie.toObject();
    }


    const result = JSON.parse(JSON.stringify(movie));
    movieCache.set(id, result);
    setTimeout(() => movieCache.delete(id), 5 * 60 * 1000);

    return result;
  } catch (error) {
    console.error('Erreur lors de la récupération du film:', error);
    return null;
  }
}
export async function getAvailableDirectors() {
  try {
    await connectDB();
    const directors = await Movie.distinct('director');
    return directors.filter(Boolean).sort();
  } catch (error) {
    console.error('Erreur lors de la récupération des réalisateurs:', error);
    return [];
  }
}

export async function getFilteredMovies(filters: FilterParams, page = 1, limit = 12) {
  try {
    await connectDB();

    const moviesCount = await Movie.countDocuments();
    if (moviesCount < 100) {
      console.log('Initialisation des films...');
      await initializeMoreMovies();
    }

    const query: any = {};

    if (filters.genre) {
      query.genres = filters.genre;
    }

    if (filters.year) {
      const startDate = new Date(`${filters.year}-01-01`);
      const endDate = new Date(`${filters.year + 1}-01-01`);
      query.releaseDate = { $gte: startDate, $lt: endDate };
    }

    if (filters.rating) {
      query.averageRating = { $gte: filters.rating };
    }

    if (filters.director) {
      query.director = filters.director;
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { overview: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const sortOptions: any = {};
    sortOptions[filters.sortBy || 'releaseDate'] = filters.sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      Movie.find(query)
        .select('-reviews') 
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Movie.countDocuments(query)
    ]);

    return {
      movies: JSON.parse(JSON.stringify(movies)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error);
    return {
      movies: [],
      pagination: { page: 1, limit, total: 0, totalPages: 0 }
    };
  }
}

async function initializeMoreMovies() {
  try {
    const pages = 10;
    const processedMovies = new Set();
    let addedCount = 0;

    for (let page = 1; page <= pages; page++) {
      console.log(`Récupération page ${page}/${pages}...`);
      
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`Erreur TMDB API: ${response.statusText}`);
      }

      const data = await response.json();

      const moviesPromises = data.results.map(async (movie: any) => {
        if (!processedMovies.has(movie.id)) {
          processedMovies.add(movie.id);
          
          try {
            const exists = await Movie.findOne({ tmdbId: movie.id });
            if (!exists) {
              const details = await getMovieDetailsFromTMDB(movie.id);
              const newMovie = {
                tmdbId: movie.id,
                title: movie.title,
                overview: movie.overview || '',
                posterPath: movie.poster_path,
                releaseDate: movie.release_date,
                genres: details.genres?.map((g: any) => g.name) || [],
                director: details.credits?.crew.find((p: any) => p.job === 'Director')?.name || 'Inconnu',
                averageRating: movie.vote_average / 2,
                reviews: [],
                favorites: []
              };

              await Movie.create(newMovie);
              addedCount++;
            }
          } catch (error) {
            console.error(`Erreur pour le film ${movie.title}:`, error);
          }
        }
      });

      await Promise.all(moviesPromises);
      console.log(`Page ${page} terminée. Films ajoutés: ${addedCount}`);
    }

    console.log(`Initialisation terminée. Total films ajoutés: ${addedCount}`);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des films:', error);
    throw error;
  }
}

export async function addReview(
  movieId: string,
  userId: string,
  userName: string,
  rating: number,
  comment: string
) {
  try {
    await connectDB();
    
    const movie = await Movie.findOne({ tmdbId: parseInt(movieId) });
    if (!movie) {
      throw new Error('Film non trouvé');
    }

    const existingReview = movie.reviews.find(
      (r: any) => r.user.toString() === userId
    );

    if (existingReview) {
      throw new Error('Vous avez déjà donné votre avis sur ce film');
    }

    const newReview = {
      user: new ObjectId(userId),
      userName,
      rating,
      comment,
      createdAt: new Date()
    };

    movie.reviews.push(newReview);
    movie.averageRating = movie.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / movie.reviews.length;

    await movie.save();
    
    // on va invalider le cache pour ce film
    movieCache.delete(movieId);

    return { 
      success: true, 
      review: JSON.parse(JSON.stringify(newReview)),
      averageRating: movie.averageRating
    };
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'avis:', error);
    throw error;
  }
}