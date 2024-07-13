import { ObjectId } from 'mongodb';

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