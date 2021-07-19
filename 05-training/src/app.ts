import fs_ from 'fs';
import crypto_ from 'crypto';
import http_ from 'http';
import path from 'path';
import express_, { Request, Response, NextFunction } from 'express';
import bodyParser_ from 'body-parser';
import nodeFetch from 'node-fetch';
import finalhandler from 'finalhandler';
import PORT from './helpers/getPort';

const urlencodedParser = bodyParser_.urlencoded({ extended: false });

type Initialize = (
  express: typeof express_,
  bodyParser: typeof bodyParser_,
  fs: typeof fs_,
  crypto: typeof crypto_,
  http: typeof http_
) => void;

const initialize: Initialize = (express, bodyParser, fs, crypto, http) => {
  const app = express();

  app
    .set('x-powered-by', false)
    .use((req, res, next) => {
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD',
      });
      next();
    })
    .get('/login/', (req, res) => {
      res.format({
        html() {
          res.send('mihailstar');
        },
        json() {
          res.send({ login: 'mihailstar' });
        },
        text() {
          res.send('mihailstar');
        },
        default() {
          res.send('mihailstar');
        },
      });
    })
    .get('/code/', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist/app.js'));
    })
    .get('/sha1/:input/', (req, res) => {
      res.send(
        crypto.createHash('sha1').update(req.params.input).digest('hex')
      );
    })
    .get('/req/', (req, res, next) => {
      if (typeof req.query.addr === 'string') {
        nodeFetch(req.query.addr)
          .then((response) => response.text())
          .then((text) => res.send(text))
          .catch((error) => next(error));
      }
    })
    .post('/req/', urlencodedParser, (req, res, next) => {
      if (typeof req.body.addr === 'string') {
        nodeFetch(req.body.addr)
          .then((response) => response.text())
          .then((text) => res.send(text))
          .catch((error) => next(error));
      }
    })
    .all('*', (req, res, next) => {
      res.send('mihailstar');
      next();
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .use((err: Error, req: Request, res: Response, next: NextFunction) => {
      finalhandler(req, res)(err);
    });

  return http.createServer(app).listen(PORT, () => {
    process.stdout.write(`http://localhost:${PORT}\n`);
  });
};

export default initialize;
