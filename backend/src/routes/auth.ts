import { Router, Request, Response } from 'express';

const router = Router();

const USERS = [
  { username: 'admin', password: 'admin123' }
];

const TOKEN = 'supersecret-hardcoded-token';

router.post('/login', (req: Request, res: Response): void => {
  const { username, password } = req.body;

  const user = USERS.find(u => u.username === username && u.password === password);

  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  res.json({ token: TOKEN, username });
});

export default router;
