import { User } from '@models/User.model';
import { AppError } from '@utils/AppError';

export const getUsersService = async () => {
    // When using lean(), the password field is returned
    // const users = await User.find({}).lean();
    const users = await User.find({});
    return users;
};
