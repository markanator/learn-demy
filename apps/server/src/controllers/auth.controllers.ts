import { Request, Response } from 'express';

export const register = (req: Request, res: Response) => {
  console.log(req.body);
  res.send('register user');
};
