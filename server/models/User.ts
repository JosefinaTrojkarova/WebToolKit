import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: false },
  // contributions: { type: Number, required: false, default: 0 },
});

const User =
  mongoose.models.User || mongoose.model('User', UserSchema, 'Users');

export default User;
