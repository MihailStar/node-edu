import fs_ from 'fs';
import crypto_ from 'crypto';
import http_ from 'http';
import express_, { Request, Response, NextFunction, Express } from 'express';
import bodyParser_ from 'body-parser';

declare const errorHandler: (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

declare const initialize: (
  express: typeof express_,
  bodyParser: typeof bodyParser_,
  fs: typeof fs_,
  crypto: typeof crypto_,
  http: typeof http_
) => Express;

export default initialize;
