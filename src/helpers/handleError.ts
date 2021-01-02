import { Request, Response, NextFunction } from 'express';
import finalhandler from 'finalhandler';

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next?: NextFunction
): void {
  if (err.stack) {
    process.stderr.write(`${err.stack}\n`);
  } else {
    process.stderr.write(`${err.name}: ${err.message}\n`);
  }

  finalhandler(req, res)(err);
}

export default errorHandler;
