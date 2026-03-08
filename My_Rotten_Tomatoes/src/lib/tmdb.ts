const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const validateResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Erreur TMDB:', errorData);
    throw new Error(`Erreur TMDB: ${response.status} ${errorData.status_message || response.statusText}`);
  }
  return response.json();
};

export async function getMovieDetailsFromTMDB(movieId?: number) {
    try {
      if (!TMDB_API_KEY) {
        console.error('Clé API TMDB manquante');
        throw new Error('Configuration TMDB manquante');
      }

      if (movieId) {
        const response = await fetch(
          `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits&language=fr-FR`
        );
        return validateResponse(response);
      } else {
        const response = await fetch(
          `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=fr-FR`
        );
        return validateResponse(response);
      }
    } catch (error) {
      console.error('Erreur TMDB:', error);
      return null;
    }
  }

export async function searchMoviesFromTMDB(query: string, page = 1) {
  try {
    if (!TMDB_API_KEY) {
      console.error('Clé API TMDB manquante');
      throw new Error('Configuration TMDB manquante');
    }

    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=fr-FR`
    );

    return validateResponse(response);
  } catch (error) {
    console.error('Erreur TMDB:', error);
    throw error;
  }
}

export async function getTrendingMovies(page = 1) {
  try {
    if (!TMDB_API_KEY) {
      console.error('Clé API TMDB manquante');
      throw new Error('Configuration TMDB manquante');
    }

    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&page=${page}&language=fr-FR`
    );

    return validateResponse(response);
  } catch (error) {
    console.error('Erreur TMDB:', error);
    throw error;
  }
}