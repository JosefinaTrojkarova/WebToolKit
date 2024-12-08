import mongoose from 'mongoose';

interface IUser {
  name: string;
  username: string;
  email: string;
  image?: string;
  contributions?: object[];
  saves?: string[];
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: false },
  contributions: { type: [Object], required: false },
  saves: { type: [String], required: false },
});

const userDb = mongoose.connection.useDb('User');

const User =
  (userDb.models.User as mongoose.Model<IUser>) ||
  userDb.model<IUser>('User', UserSchema, 'Users');

export default User;
