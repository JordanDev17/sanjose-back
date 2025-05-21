import {createPool} from 'mysql2/promise'
import {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from './config.js'

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : 'undefined'); // No imprimir la contraseña
console.log('DB_NAME:', process.env.DB_NAME);

export const pool = createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_NAME
})

