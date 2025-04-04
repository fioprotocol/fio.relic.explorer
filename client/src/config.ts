import dotenv from 'dotenv';

dotenv.config();

export const config = {
  baseUrl: process.env.REACT_APP_BASE_URL,
};
