/* eslint-disable no-console */

import http from 'http';
import path from 'path';
import serveStatic from 'serve-static';
import finalhandler from 'finalhandler';
import PORT from './helpers/getPort';

const serve = serveStatic(path.join(__dirname, '../public'));

/**
 * @tutorial https://stackoverflow.com/a/8640308
 */
function onRequest(
  request: http.IncomingMessage,
  response: http.ServerResponse
): void {
  try {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'x-test');
    response.setHeader('Server', 'Node.js');

    // if (request.method && /^GET|POST$/i.test(request.method)) {
    //   response.setHeader('Allow', 'GET, POST');

    //   response.statusCode = 405;
    //   response.statusMessage = 'Method Not Allowed';

    //   response.end();

    //   return;
    // }

    if (request.url === '/result4' || request.url === '/result4/') {
      response.setHeader(
        'Access-Control-Allow-Methods',
        'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH'
      );
      response.setHeader('Content-Type', 'application/json; charset=utf-8;');

      response.statusCode = 200;
      response.statusMessage = 'Ok';

      let body = '';

      request
        .on('error', (error) => {
          finalhandler(request, response)(error);
        })
        .on('data', (data) => {
          body += data;

          if (body.length > 1e6) {
            request.destroy();

            response.statusCode = 413;
            response.statusMessage = 'Payload Too Large';

            response.end();
          }
        })
        .on('end', () => {
          response
            .on('error', (error) => {
              finalhandler(request, response)(error);
            })
            .end(
              JSON.stringify({
                message: 'mihailstar',
                'x-result': request.headers['x-test'] ?? '',
                'x-body': body,
              })
            );
        });

      return;
    }

    serve(request, response, () => finalhandler(request, response)(null));
  } catch (error) {
    finalhandler(request, response)(error);
  }
}

http.createServer(onRequest).listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
