import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';
import loginRouter from './routers/login';
import renderRouter from './routers/render';
import wpRouter from './routers/wp';
import handleError from './helpers/handleError';

function initialize(): Express {
  const app = express();

  app
    .set('x-powered-by', false)
    .set('view engine', 'pug')
    .set('views', path.join(__dirname, '../views'))
    .use(cors())
    .use('/login/', loginRouter)
    .use('/render/', renderRouter)
    .use('/wordpress/wp-json/wp/v2/posts/', wpRouter)
    .use(express.static(path.join(__dirname, '../public')))
    .use(handleError);

  return app;
}

export default initialize;
