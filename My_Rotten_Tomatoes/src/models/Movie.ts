import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  overview: String,
  posterPath: String,
  releaseDate: Date,
  genres: [String],
  director: String,
  averageRating: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

movieSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.averageRating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
  }
  next();
});

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);
export default Movie;