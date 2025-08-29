import mongoose, { Schema } from 'mongoose';
import { comparePassword, encryptPassword } from '@utils/encryptPassword';
import { IUser } from '../types/User';

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowerCase: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        isEmailVerified: { type: Boolean, required: true, default: false },
        // role: {
        //     type: String,
        //     enum: ['user', 'admin'],
        //     default: 'user',
        // },
        // isActive: {
        //     type: Boolean,
        //     default: true,
        // },
    },
    {
        timestamps: true,
    },
);

// Encrypt password here instead of in registerService
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) this.password = await encryptPassword(this.password);
    next();
});

// Compare password here instead of in loginService
userSchema.methods.comparePassword = async function (password: string) {
    return comparePassword(password, this.password);
};

/**
 * Automatically removes the password field when the user document is serialized to JSON.
 * This ensures sensitive data is never exposed in API responses.
 * Intercepts JSON.stringify(), res.json(), console.log()
 */
userSchema.set('toJSON', {
    transform: function (_, ret) {
        delete ret.password;
        return ret;
    },
});

// Another manual option to omit password
// userSchema.methods.omitPassword = function () {
//   const user = this.toObject();
//   delete user.password;
//   return user;
// };

export const User = mongoose.model<IUser>('User', userSchema);
