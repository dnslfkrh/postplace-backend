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

} = process.env;