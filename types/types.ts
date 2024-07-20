export type ItemBasicInfo = {
  _id: string;
  name: string;
  description: string;
  logo: string;
}

export type Tool = {
  name: string;
  description: string;
}

export type User = {
  id: string;
  username: string;
  email: string;
}

export type ISuggestion = {
  suggestedBy: string;
  name: string;
  description: string;
  additionalInfo?: string;
  createdAt: string;
}

export type ToolEdit = {
  editedBy: string;
  name: string;
  description: string;
  additionalInfo: string;
  createdAt: string;
    // ... other fields
}