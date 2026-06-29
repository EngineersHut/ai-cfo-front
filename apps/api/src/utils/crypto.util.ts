import * as bcrypt from "bcryptjs";

export const generateOtp = (): number => {
  return Math.floor(1000 + Math.random() * 9000);
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};
