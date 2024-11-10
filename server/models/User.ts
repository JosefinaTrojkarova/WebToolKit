import mongoose from 'mongoose';

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    name: String,
    handle: String,
    email: String,
    image: String,
    contributions: Number,
  })
);

export default mongoose.models.User || mongoose.model('User');

// Not Used Yet
