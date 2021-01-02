import { Request, Response } from 'express';

const OPENEDU_LOGIN = 'mihailstar';

export default function loginController(req: Request, res: Response): void {
  res.set('Content-Type', 'text/plain').send(OPENEDU_LOGIN);
}
