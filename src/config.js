import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 8080;
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '1034657136';
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_NAME= process.env.DB_NAME || 'sanjoseweb';
export const JWT_SECRET = process.env.JWT_SECRET || '5bf248d9f4b62d0e0d904f013fad2cb891f4753c5522b778ce22e14079d589c5';