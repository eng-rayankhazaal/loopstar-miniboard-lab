import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const routes = new Map([
  ['/', ['public/index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['public/styles.css', 'text/css; charset=utf-8']]
]);

export function createMiniBoardServer() {
  return createServer(async (request, response) => {
    const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
    const route = routes.get(pathname);
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'self'; img-src 'self' data:; form-action 'none'; base-uri 'none'");
    response.setHeader('Cache-Control', 'no-store');
    if (!['GET', 'HEAD'].includes(request.method ?? 'GET')) {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end();
      return;
    }
    if (!route) {
      response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
      response.end('Not found');
      return;
    }
    try {
      const [relative, mediaType] = route;
      const body = await readFile(path.join(root, relative));
      response.writeHead(200, {'Content-Type': mediaType});
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch {
      response.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
      response.end('Unable to serve page');
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 4177);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error('Invalid PORT');
    process.exitCode = 2;
  } else {
    createMiniBoardServer().listen(port, '127.0.0.1', () => {
      console.log(`MiniBoard seed ready: http://127.0.0.1:${port}`);
    });
  }
}
