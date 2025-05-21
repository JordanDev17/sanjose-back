if (
  !process.env.DB_HOST ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_PORT ||
  !process.env.DB_NAME
) {
  console.error('❌ Faltan variables de entorno para la base de datos');
  process.exit(1);
}

export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_PORT = parseInt(process.env.DB_PORT);
export const DB_DATABASE = process.env.DB_NAME;
