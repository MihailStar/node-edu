import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';
import loginRouter from './routes/login';
import insertRouter from './routes/insert';
import handleError from './helpers/handleError';

function initialize(): Express {
  const app = express();

  app
    .set('x-powered-by', false)
    .use(cors())
    .use('/login/', loginRouter)
    .use('/insert/', insertRouter)
    .use(handleError);

  return app;
}

export default initialize;
