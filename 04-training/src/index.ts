/* eslint-disable no-console */

import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import gzip from './helpers/gzip';
import PORT from './helpers/getPort';

function errorHandler(
  error: Error,
  request: http.IncomingMessage,
  response: http.ServerResponse
): void {
  console.error(error);

  response.writeHead(500, 'Internal Server Error', {});
  response.write(JSON.stringify({ message: 'Internal Server Error' }));
  response.end();
}

function requestHandler(
  request: http.IncomingMessage,
  response: http.ServerResponse
): void {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Content-Type', 'application/json; charset=utf-8;');
  response.setHeader('X-Author', 'MihailStar');

  if (typeof request.method !== 'string' || typeof request.url !== 'string') {
    response.statusCode = 403;
    response.statusMessage = 'Forbidden';
    response.end(JSON.stringify({ message: response.statusMessage }));

    return;
  }

  if (request.url === '/echo') {
    response.statusCode = 302;
    response.statusMessage = 'Found';
    response.setHeader('Location', '/echo?message');
    response.end();

    return;
  }

  if (request.url === '/') {
    response.statusCode = 200;
    response.statusMessage = 'OK';

    const filePath = path.join(__dirname, '../data/data.json');
    const file = fs.createReadStream(filePath);

    response.on('close', () => {
      file.destroy();
    });

    file
      .on('error', (error: Error) => {
        errorHandler(error, request, response);
      })
      .pipe(response);

    return;
  }

  const urlParsed = url.parse(request.url, true);

  if (
    urlParsed.pathname === '/echo' &&
    typeof urlParsed.query.message === 'string'
  ) {
    response.statusCode = 200;
    response.statusMessage = 'OK';
    response.setHeader('Cache-control', 'no-cache');

    const responseData = {
      echo: urlParsed.query.message,
      date: Date.now(),
      message: response.statusMessage,
    };

    if (
      typeof request.headers['accept-encoding'] === 'string' &&
      request.headers['accept-encoding'].match(/gzip/) !== null
    ) {
      response.setHeader('Content-Encoding', 'gzip');

      gzip(JSON.stringify(responseData))
        .then((compressed: Buffer) => {
          response.end(compressed);
        })
        .catch((error: Error) => {
          errorHandler(error, request, response);
        });
    } else {
      response.end(JSON.stringify(responseData));
    }
  } else {
    response.statusCode = 404;
    response.statusMessage = 'Not Found';
    response.end(JSON.stringify({ message: response.statusMessage }));
  }
}

function requestListener(
  request: http.IncomingMessage,
  response: http.ServerResponse
): void {
  try {
    requestHandler(request, response);
  } catch (error) {
    errorHandler(error, request, response);
  }
}

// new http.Server().on('request', requestListener).listen(PORT, () => {
//   console.log(`http://localhost:${PORT}`);
// });

http.createServer(requestListener).listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
