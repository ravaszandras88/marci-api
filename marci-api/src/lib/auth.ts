import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: Date;
}

export interface UserSession {
  id: number;
  email: string;
  name: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};