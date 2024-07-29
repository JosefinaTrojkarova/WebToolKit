export type ItemBasicInfo = {
  _id: string;
  name: string;
  description: string;
  logo: string;
  categories: string[];
  tags: {
    pricing: string;
    licensing: string;
  };
  rating: {
    stars: number;
    reviews: number;
    saves: number;
  };
};

export type Tool = {
  _id: string;
  name: string;
  shortDescription: string;
  description: string;
  video: string;
  logo: string;
  categories: string[];
  tags: {
    pricing: string;
    licensing: string;
  };
  rating: {
    stars: number;
    reviews: number;
    saves: number;
  };
  resources: string[];
  pros: string[];
  cons: string[];
  alternatives: string[];
};

export type Category = {
  id: number;
  name: string;
  active: boolean;
};

export type Tag = {
  id: number;
  name: string;
  active: boolean;
};

export type User = {
  id: string;
  username: string;
  email: string;
};

export type ToolSuggestion = {
  suggestedBy: string;
  name: string;
  description: string;
  additionalInfo?: string;
  createdAt: string;
};
