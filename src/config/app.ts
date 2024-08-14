import dotenv from 'dotenv';

dotenv.config();

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
export const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 3000;

const SERVER = {
  SERVER_HOSTNAME,
  SERVER_PORT,
  isDevelopment,
  isProduction,
  isTest,
};

export default SERVER;
