import mongoose from 'mongoose';
interface Tags {
  pricing: string[];
  licensing: string[];
}

interface Rating {
  stars: number;
  reviews: number;
  saves: number;
}

interface Pros {
  name: string;
  votes: number;
}

export interface ITool {
  name: string;
  description: string;
  shortDescription: string;
  website: string;
  pricingLink: string;
  video: string;
  logo: string;
  categories: string[];
  tags: Tags;
  rating: Rating;
  pros: Pros[];
  cons: Pros[];
}

const ToolSchema = new mongoose.Schema<ITool>({
  name: { type: String, required: true },
  description: { type: String },
  shortDescription: { type: String },
  video: { type: String },
  website: { type: String },
  pricingLink: { type: String },
  logo: { type: String },
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
  pros: [
    {
      name: { type: String },
      votes: { type: Number },
    },
  ],
  cons: [
    {
      name: { type: String },
      votes: { type: Number },
    },
  ],
});

const toolDb = mongoose.connection.useDb('Tools');

const Tool =
  (toolDb.models.Tool as mongoose.Model<ITool>) ||
  toolDb.model<ITool>('Tool', ToolSchema, 'Main');

export default Tool;
