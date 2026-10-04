import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../out/', import.meta.url)));
const port = Number(process.env.PORT || 3000);

if (!existsSync(root)) {
  console.error('out/ 폴더가 없습니다. 먼저 npm run build를 실행하세요.');
  process.exit(1);
}

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};

function resolveRequest(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/^\/+/, '');
  const candidate = normalize(join(root, clean));
  if (!candidate.startsWith(root)) return null;

  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  if (existsSync(candidate) && statSync(candidate).isDirectory()) {
    const index = join(candidate, 'index.html');
    if (existsSync(index)) return index;
  }

  const html = `${candidate}.html`;
  if (existsSync(html)) return html;
  const nestedIndex = join(candidate, 'index.html');
  if (existsSync(nestedIndex)) return nestedIndex;
  return null;
}

createServer((req, res) => {
  const target = resolveRequest(req.url || '/');
  if (!target) {
    const notFound = join(root, '404.html');
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (existsSync(notFound)) createReadStream(notFound).pipe(res);
    else res.end('404 Not Found');
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', mime[extname(target).toLowerCase()] || 'application/octet-stream');
  createReadStream(target).pipe(res);
}).listen(port, '127.0.0.1', () => {
  console.log(`Static export preview: http://localhost:${port}`);
});
