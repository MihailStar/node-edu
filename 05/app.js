import url from 'url';
import path from 'path';
import stream from 'stream';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGIN = 'mihailstar';

const errorHandler = (err, req, res, next) => {
  res.status(500).send(err);
};

const initialize = (express, bodyParser, fs, crypto, http) => {
  return express()
    .set('x-powered-by', false)
    .use((req, res, next) => {
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD',
      });
      next();
    })
    .get('/login/', (req, res) => {
      res.format({
        html() {
          res.send(LOGIN);
        },
        text() {
          res.send(LOGIN);
        },
        default() {
          res.send(LOGIN);
        },
      });
    })
    .get('/code/', (req, res, next) => {
      res.set({ 'Content-Type': 'text/plain; charset=utf-8' });
      fs.createReadStream(__filename)
        .pipe(res)
        .on('error', (err) => {
          if (err) next(err);
        });
    })
    .get('/sha1/:input/', (req, res) => {
      res.send(
        crypto.createHash('sha1').update(req.params.input).digest('hex')
      );
    })
    .get('/req/', (req, res, next) => {
      if (typeof req.query.addr === 'string') {
        http
          .get(req.query.addr, (response) => {
            stream.pipeline(response, res, (err) => {
              if (err) next(err);
            });
          })
          .on('error', (err) => {
            if (err) next(err);
          });
      }
    })
    .post(
      '/req/',
      bodyParser.urlencoded({ extended: false }),
      (req, res, next) => {
        if (typeof req.body.addr === 'string') {
          http
            .get(req.body.addr, (response) => {
              let content = '';
              response
                .on('data', (chunk) => {
                  content += chunk;
                })
                .on('end', () => {
                  res.send(content);
                });
            })
            .on('error', (err) => {
              if (err) next(err);
            });
        }
      }
    )
    .all('*', (req, res, next) => {
      res.send(LOGIN);
      next();
    })
    .use(errorHandler);
};

export default initialize;
