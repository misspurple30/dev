import mongoose, { Document } from 'mongoose';

export interface IReview extends Document {
  movie: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
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
    required: true,
    trim: true,
    minlength: [3, 'Le commentaire doit faire au moins 3 caractères'],
    maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

reviewSchema.index({ movie: 1, user: 1 }, { unique: true });

const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);
export default Review;