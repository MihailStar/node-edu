import { Request, Response, NextFunction } from 'express';
import finalhandler from 'finalhandler';

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line
  next: NextFunction
): void {
  finalhandler(req, res)(err);

  if (err.stack !== undefined) {
    process.stderr.write(`${err.stack}\n`);
  } else {
    process.stderr.write(`${err.name}: ${err.message}\n`);
  }
}
