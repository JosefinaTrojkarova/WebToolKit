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

export type Tool = {
  name: string;
  description: string;
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
