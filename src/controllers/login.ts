import { Request, Response } from 'express';

const LOGIN = 'mihailstar';

function controller(req: Request, res: Response): void {
  res.format({
    'text/html': () => {
      res.send(LOGIN);
    },
    'text/plain': () => {
      res.send(LOGIN);
    },
    'application/json': () => {
      res.send({ login: LOGIN });
    },
    default: () => {
      res.send(LOGIN);
    },
  });
}

export default controller;
