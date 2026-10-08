import { createServer } from 'node:http';

const defaultPort = 9090;
let server = null;

const handlers = {};
const filters = [];
  
export function registerFilter(handler, purpose) {
  console.log(new Date(), 'Registering filter for', purpose ?? 'an unknown purpose');
  filters.push(handler);
}

export function registerHandler(params, handler) {
  const { path } = params;
  console.log(new Date(), 'Registering handler for', path, 'resource');
  handlers[path] = {
    params,
    handler,
  };
}

export async function startServer(port = defaultPort) {
  if (server) {
    return Promise.reject(new Error('Server já foi iniciado'));
  } else {
    return new Promise((resolve, reject) => { // handler da requisição HTTP
      server = createServer(function requestListener(request, response) {
        for (const filter of filters) {
          if (filter(request, response)?.handled) { // if handled, request chain is finished
            return;
          };
        }

        const url = new URL(request.url, `http://localhost:${port}`);
        const requestPath = url.pathname;
        const requestMethod = request.method;
        const requestAccept = request.headers['accept']?.trim().split(',').filter(Boolean);

        if (requestPath.length > 1 && requestPath.endsWith('/')) {
          requestPath = requestPath.slice(0, -1);
        }
        let handlerKey = requestPath;
        let idParam = null;
        const pathParts = requestPath.split('/').filter(Boolean);

        if (pathParts.length === 2 && !isNaN(pathParts[1])) {
          handlerKey = `/${pathParts[0]}/:id`;
          idParam = pathParts[1];
        }
        if (handlerKey in handlers) {
          const { handler, params: { method, accept } } = handlers[handlerKey];
          if (requestMethod === method) {
            if (requestAccept?.some((res) => accept.includes(res))) {
              handler(request, response, idParam);
              return;
            } else {
              response.writeHead(406);
              response.end();
              return;
            }
          } else {
            response.writeHead(405);
            response.end();
            return;
          }
        } else {
          response.writeHead(404);
          response.end(`The resource ${url.pathname} does not exist.`);
          return;
        }
        // The request flow should never reach up to this point
        // If it does, it means the request was not handled properly,
        // and a Server Error must be thrown.
        response.writeHead(500);
        response.end('The server cannot handle this request. This should not happen :(');
        return;
      }).listen(port, () => {
        resolve(`O servidor foi iniciado na porta ${port}`);
      }).on('error', (error) => {
        reject(error);
      });
    });
  }
}
