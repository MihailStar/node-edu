import express, { Express } from 'express';
import cors from 'cors';
import loginRouter from './routers/login';
import testRouter from './routers/test';
import handleError from './util/handleError';

export default function initialize(): Express {
  return express()
    .set('x-powered-by', false)
    .use('/login/', cors(), loginRouter)
    .use('/test/', cors(), testRouter)
    .use(handleError);
}
