#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const rootDir = process.cwd();
const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const getOption = (name, fallback) => {
  const direct = args.find((arg) => arg.startsWith(`${name}=`));
  if (!direct) return fallback;
  return direct.slice(name.length + 1);
};

const host = getOption('--host', '127.0.0.1');
const port = Number(getOption('--port', process.env.PORT || '4321'));
const shouldOpen = hasFlag('--open');
const clients = new Set();

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

const liveReloadSnippet = `
<script>
(() => {
  const protocol = location.protocol === 'https:' ? 'https://' : 'http://';
  const source = new EventSource(protocol + location.host + '/_livereload');
  source.addEventListener('reload', () => window.location.reload());
  source.addEventListener('error', () => {
    source.close();
    setTimeout(() => window.location.reload(), 1200);
  });
})();
</script>`;

const sendReload = () => {
  for (const client of clients) {
    client.write('event: reload\ndata: now\n\n');
  }
};

const injectSnippet = (html) => {
  if (html.includes('/_livereload')) return html;
  if (html.includes('</body>')) {
    return html.replace('</body>', `${liveReloadSnippet}\n</body>`);
  }
  return `${html}${liveReloadSnippet}`;
};

const serve404 = (res) => {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
};

const resolvePath = (requestPath) => {
  const cleanPath = decodeURIComponent(requestPath.split('?')[0]);
  const safePath = path.normalize(cleanPath).replace(/^([.][.][/\\])+/, '');
  let filePath = path.join(rootDir, safePath);

  if (cleanPath === '/' || cleanPath === '') {
    filePath = path.join(rootDir, 'index.html');
  }

  if (!path.extname(filePath)) {
    const htmlPath = `${filePath}.html`;
    if (fs.existsSync(htmlPath)) {
      filePath = htmlPath;
    }
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!filePath.startsWith(rootDir)) {
    return null;
  }

  return filePath;
};

const server = http.createServer((req, res) => {
  if (!req.url) {
    serve404(res);
    return;
  }

  if (req.url.startsWith('/_livereload')) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write('\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  const filePath = resolvePath(req.url);
  if (!filePath || !fs.existsSync(filePath)) {
    serve404(res);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const type = contentTypes[ext] || 'application/octet-stream';

  try {
    let payload = fs.readFileSync(filePath);
    if (ext === '.html') {
      payload = Buffer.from(injectSnippet(payload.toString('utf8')));
    }
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(payload);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Server error: ${error.message}`);
  }
});

try {
  fs.watch(rootDir, { recursive: true }, (_, filename) => {
    if (!filename || filename.includes('.DS_Store')) return;
    sendReload();
  });
} catch (error) {
  console.warn('Live-Reload-Watcher konnte nicht rekursiv gestartet werden:', error.message);
}

server.listen(port, host, () => {
  const url = `http://${host}:${port}`;
  console.log(`Maison Aveline dev server running at ${url}`);
  console.log('Live Reload aktiv. HTML-Dateien werden automatisch neu geladen.');

  if (shouldOpen) {
    if (process.platform === 'darwin') {
      exec(`open ${url}`);
    } else if (process.platform === 'win32') {
      exec(`start ${url}`);
    } else {
      exec(`xdg-open ${url}`);
    }
  }
});
