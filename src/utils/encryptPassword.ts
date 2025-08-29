import bcrypt from 'bcrypt';
import { config } from '../config/env.conf';

const ROUNDS = config.BCRYPT_SALT_ROUNDS;

export const encryptPassword = async (password: string) => await bcrypt.hash(password, ROUNDS);

export const comparePassword = async (plainPassword: string, hashedPassword: string) =>
    await bcrypt.compare(plainPassword, hashedPassword);
