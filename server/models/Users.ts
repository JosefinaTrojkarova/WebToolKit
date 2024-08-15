// WILL BE CHANGED!!!

import { ObjectId } from 'mongodb';

// User interface
export interface IUser {
  _id?: ObjectId;
  username: string;
  email: string;
  authentication: {
    password: string;
    salt: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
