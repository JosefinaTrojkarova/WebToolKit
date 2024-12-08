import mongoose from 'mongoose';

interface IUserContribution {
  _id: string;
  comment: string;
  rating: number;
  date: Date;
  toolId: string;
}

interface IUser {
  name: string;
  username: string;
  email: string;
  image?: string;
  contributions?: IUserContribution[];
  saves?: string[];
}

const UserContributionSchema = new mongoose.Schema({
  _id: String,
  comment: String,
  rating: Number,
  date: Date,
  toolId: String,
});

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: false },
  contributions: [UserContributionSchema],
  saves: { type: [String], required: false },
});

const userDb = mongoose.connection.useDb('User');

const User =
  (userDb.models.User as mongoose.Model<IUser>) ||
  userDb.model<IUser>('User', UserSchema, 'Users');

export default User;
