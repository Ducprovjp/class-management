import jwt from 'jsonwebtoken';

export const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) throw new Error('JWT_SECRET_KEY not found in env');

  return jwt.sign({ id: userId }, secret, {
    expiresIn: '7d', // hoặc lấy từ env
  });
};
