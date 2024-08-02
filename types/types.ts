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

export type ToolHeader = {
  _id: string;
  name: string;
  logo: string;
  shortDescription: string;
  website: string;
  rating: {
    stars: number;
    saves: number;
  };
};

export type ToolMain = {
  _id: string;
  categories: string[];
  description: string;
  logo: string;
  tags: {
    pricing: string;
    licensing: string;
  };
  rating: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    reviews: number;
  };
  resources: {
    link: string;
    type: string;
  }[];
  video: string;
  pros: {
    name: string;
    votes: string;
  }[];
  cons: {
    name: string;
    votes: string;
  }[];
  alternatives: string[];
};

export type Tool = {
  _id: string;
  name: string;
  categories: string[];
  description: string;
  logo: string;
  tags: {
    pricing: string;
    licensing: string;
  };
  rating: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    stars: number;
    reviews: number;
    saves: number;
  };
  shortDescription: string;
  resources: {
    link: string;
    type: string;
  }[];
  video: string;
  pros: {
    name: string;
    votes: string;
  }[];
  cons: {
    name: string;
    votes: string;
  }[];
  alternatives: string[];
};

export type Alternative = {
  _id: string;
  name: string;
  categories: string[];
  logo: string;
  tags: {
    pricing: string;
    licensing: string;
  };
  rating: {
    stars: number;
    reviews: number;
  };
  shortDescription: string;
  pros: {
    name: string;
    votes: string;
  }[];
  cons: {
    name: string;
    votes: string;
  }[];
};

export type Review = {
  _id: string;
  tool: string;
  user: string;
  comment: string;
  rating: number;
  date: string;
};

export type Category = {
  id: number;
  name: string;
  active: boolean;
};

export type CategoryDatabase = {
  id: number;
  name: string;
  tools: string[];
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
