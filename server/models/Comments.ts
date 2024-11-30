import mongoose, { Schema } from 'mongoose';

interface IReviewItem {
  user: string;
  comment: string;
  rating: number;
  date: Date;
  id: mongoose.Types.ObjectId;
}

interface IComments {
  tool: string;
  reviews: IReviewItem[];
}

const ReviewItemSchema = new Schema<IReviewItem>({
  user: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  date: { type: Date, required: true },
  id: { type: Schema.Types.ObjectId, required: true },
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
