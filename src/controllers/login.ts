import { Request, Response } from 'express';
import { OPENEDU_LOGIN } from '../constants/constants';

function controller(req: Request, res: Response): void {
  res.format({
    'text/html': () => {
      res.send(OPENEDU_LOGIN);
    },
    'text/plain': () => {
      res.send(OPENEDU_LOGIN);
    },
    'application/json': () => {
      res.send({ login: OPENEDU_LOGIN });
    },
    default: () => {
      res.send(OPENEDU_LOGIN);
    },
  });
}

export default controller;
