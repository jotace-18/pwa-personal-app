import dotenv from 'dotenv';
dotenv.config();

export const port = process.env.PORT || 4000;
export const db = {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
};
export const jwtSecret = process.env.JWT_SECRET;
