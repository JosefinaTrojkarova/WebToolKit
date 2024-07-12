import mongoose from 'mongoose' // zmenit na native driver

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  authentication: {
    password: { type: String, required: true },
    salt: { type: String },
  },
}, { timestamps: true })

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  authentication: {
    password: string;
    salt: string;
  };
}

export const User = mongoose.model<IUser>('User', userSchema, 'Users')