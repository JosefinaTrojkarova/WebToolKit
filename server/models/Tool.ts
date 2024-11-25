import mongoose, { Document, Schema } from 'mongoose';

// Define interfaces for nested objects
interface Tags {
  pricing: string[];
  licensing: string[];
}

interface Rating {
  stars: number;
  reviews: number;
  saves: number;
}

// Define the main Tool interface
export type ITool = {
  name: string;
  description: string;
  logo: string;
  categories: string[];
  tags: Tags;
  rating: Rating;
} & Document;

// Create the Mongoose schema
const toolSchema = new Schema<ITool>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  logo: { type: String, required: true },
  categories: [{ type: String }],
  tags: {
    pricing: [{ type: String }],
    licensing: [{ type: String }],
  },
  rating: {
    stars: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
  },
});

export const ToolModel = mongoose.model<ITool>('Tool', toolSchema);
