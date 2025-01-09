import mongoose, { Schema } from 'mongoose';

interface IReviewItem {
  user: string;
  toolId: string;
  comment: string;
  rating: number;
  date: Date;
}

interface IReviews {
  tool: string;
  reviews: IReviewItem[];
}

const ReviewItemSchema = new Schema<IReviewItem>({
  user: { type: String, ref: 'User', required: true },
  toolId: { type: String, ref: 'Tool', required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  date: { type: Date, required: true },
});

const ReviewsSchema = new Schema<IReviews>({
  tool: { type: String, required: true },
  reviews: [ReviewItemSchema],
});

const ReviewsDb = mongoose.connection.useDb('Tools');

const Reviews =
  (ReviewsDb.models.Reviews as mongoose.Model<IReviews>) ||
  ReviewsDb.model<IReviews>('Reviews', ReviewsSchema, 'Reviews');

export default Reviews;
