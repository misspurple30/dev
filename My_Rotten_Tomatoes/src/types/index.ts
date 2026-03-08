import { Types } from 'mongoose';
import 'next-auth';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  favorites: Types.ObjectId[] | string[];
}

export interface Movie {
  id: string;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  director: string;
  genres: string[];
  averageRating: number;
  reviews: Review[];
  favorites: Types.ObjectId[] | string[];
  updatedAt: string;
}

export interface Review {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  userCount: number;
  movieCount: number;
  reviewCount: number;
  newUsersToday: number;
  totalGenres: number;
  averageRating: number;
}

export interface TopMovie {
  id: string;
  title: string;
  averageRating: number;
  reviewCount: number;
  posterPath: string;
}

export interface Activity {
  id: string;
  type: 'review' | 'user' | 'movie';
  description: string;
  createdAt: string;
  userId?: string;
  movieId?: string;
  userName?: string;
  movieTitle?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FilterParams {
  genre?: string;
  year?: number;
  rating?: number;
  search?: string;
  director?: string;
  sortBy?: 'title' | 'releaseDate' | 'averageRating';
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: PaginationParams;
}

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'user' | 'admin';
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'user' | 'admin';
  }
}