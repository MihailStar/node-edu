import express, { Express } from 'express';
import userRoute from './routes/user';
import otherRoute from './routes/other';
import handleError from './helpers/handleError';

function initialize(): Express {
  const app = express();

  app
    .set('x-powered-by', false)
    .use('/api/v1/users?/', userRoute)
    .use(otherRoute)
    .use(handleError);

  return app;
}

export default initialize;
