import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    token: { type: String, select: false },
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

export const User = mongoose.model('User', userSchema, 'Users')