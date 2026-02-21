import dotenv from "dotenv";
import { resolve } from "node:path";
dotenv.config({ path: resolve(`config/.env.${process.env.NODE_ENV}`) });

export const PORT = process.env.PORT;
export const SULT_ROUND = process.env.SULT_ROUND;
export const DB_URI = process.env.DB_URI;
export const SECRET_KEY = process.env.SECRET_KEY;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
