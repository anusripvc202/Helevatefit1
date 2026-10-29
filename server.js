const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const ROOT = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf'
};

function serveFile(res, targetPath, statusCode = 200) {
    const ext = path.extname(targetPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(statusCode, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
    });
    fs.createReadStream(targetPath).pipe(res);
}

const server = http.createServer((req, res) => {
    let rawPath = decodeURI(req.url.split('?')[0]);
    if (rawPath === '/' || rawPath === '' || rawPath === '/Helevatefit1' || rawPath === '/Helevatefit1/') {
        rawPath = '/index.html';
    } else if (rawPath.startsWith('/Helevatefit1/')) {
        rawPath = rawPath.slice('/Helevatefit1'.length);
    }

    const hasTrailingSlash = rawPath.length > 1 && rawPath.endsWith('/');
    const cleanRel = rawPath.replace(/^\/+/, '');
    const exactPath = path.join(ROOT, cleanRel);

    // Prevent directory traversal
    if (!exactPath.startsWith(ROOT)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    // 1. If trailing slash (e.g. /community/), check <dir>/index.html first so ../ relative paths resolve cleanly
    if (hasTrailingSlash) {
        const dirIndex = path.join(exactPath, 'index.html');
        if (fs.existsSync(dirIndex) && fs.statSync(dirIndex).isFile()) {
            serveFile(res, dirIndex, 200);
            return;
        }
    }

    // 2. If exact file exists (e.g. /index.html, /community.html, /css/styles.css)
    if (fs.existsSync(exactPath) && fs.statSync(exactPath).isFile()) {
        serveFile(res, exactPath, 200);
        return;
    }

    // 3. If clean URL without trailing slash (e.g. /community), serve <slug>.html so root-relative paths resolve cleanly
    const htmlCandidate = exactPath + '.html';
    if (fs.existsSync(htmlCandidate) && fs.statSync(htmlCandidate).isFile()) {
        serveFile(res, htmlCandidate, 200);
        return;
    }

    // 4. Check <dir>/index.html as fallback
    const dirIndexFallback = path.join(exactPath, 'index.html');
    if (fs.existsSync(dirIndexFallback) && fs.statSync(dirIndexFallback).isFile()) {
        serveFile(res, dirIndexFallback, 200);
        return;
    }

    // 5. GitHub Pages 404.html fallback
    const notFoundPage = path.join(ROOT, '404.html');
    if (fs.existsSync(notFoundPage) && fs.statSync(notFoundPage).isFile()) {
        serveFile(res, notFoundPage, 200);
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Node.js Web Server is live at http://localhost:${PORT}/`);
});
