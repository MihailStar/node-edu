import { Request, Response, NextFunction } from 'express';

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next?: NextFunction
): void {
  if (err.stack === undefined) {
    process.stderr.write(`${err.name}: ${err.message}\n`);
  } else {
    process.stderr.write(`${err.stack}\n`);
  }

  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ message: 'Internal server error' });
  } else {
    res.status(500).json({ message: `${err.name}: ${err.message}` });
  }
}

export default errorHandler;
