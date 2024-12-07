import mongoose, { Schema } from 'mongoose';

interface IReviewItem {
  user: string;
  comment: string;
  rating: number;
  date: Date;
}

interface IComments {
  tool: string;
  reviews: IReviewItem[];
}

const ReviewItemSchema = new Schema<IReviewItem>({
  user: { type: String, ref: 'User', required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  date: { type: Date, required: true },
});

const CommentsSchema = new Schema<IComments>({
  tool: { type: String, required: true },
  reviews: [ReviewItemSchema],
});

const CommentsDb = mongoose.connection.useDb('Tools');

const Comments =
  (CommentsDb.models.Comments as mongoose.Model<IComments>) ||
  CommentsDb.model<IComments>('Comments', CommentsSchema, 'Comments');

export default Comments;
