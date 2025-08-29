import { Types } from 'mongoose';

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    // isActive: boolean;
    // role: 'user' | 'admin';

    // methods
    comparePassword(value: string): Promise<boolean>;
}
