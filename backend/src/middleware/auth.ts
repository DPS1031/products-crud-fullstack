import { Request, Response, NextFunction } from 'express';

const VALID_TOKEN = 'supersecret-hardcoded-token';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token || token !== VALID_TOKEN) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  next();
};
