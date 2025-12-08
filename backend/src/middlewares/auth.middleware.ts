import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt.js';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Không tìm thấy token xác thực' });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Chưa xác thực' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Không có quyền truy cập' });
      return;
    }

    next();
  };
};
