import bcrypt from 'bcrypt';

export const hashToken = async (token: string): Promise<string> => {
  return bcrypt.hash(token, 10);
};

export const compareToken = async (token: string, hashedToken: string): Promise<boolean> => {
  return bcrypt.compare(token, hashedToken);
};