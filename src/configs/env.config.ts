import * as dotenv from "dotenv";

dotenv.config();

export const {
    PORT,
    FRONTEND_URL,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    JWT_SECRET,
    JWT_REFRESH_SECRET,

} = process.env;