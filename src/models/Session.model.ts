import mongoose, { Document, ObjectId, Schema } from 'mongoose';
import { config } from '@config/env.conf';
import { calculateExpirationDate } from '@utils/date';

export interface SessionDocument extends Document {
    userId: ObjectId;
    userAgent?: string;
    ipAddress?: string;
    location?: string;
    createdAt: Date;
    expiresAt: Date;
}

const sessionSchema = new Schema<SessionDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        required: true,
    },
    userAgent: { type: String },
    ipAddress: { type: String },
    location: { type: String },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
        // default: thirtyDaysFromNow,
        default: calculateExpirationDate(config.JWT_REFRESH_EXPIRES_IN),
    },
});

const Session = mongoose.model<SessionDocument>('Session', sessionSchema);

export default Session;
