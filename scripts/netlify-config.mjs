import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const frontend = path.join(root, 'Frontend');
const apiBase = (process.env.SB_API_BASE || '').trim().replace(/\/+$/, '');

if (!apiBase) {
  throw new Error('NDRYSHORJA SB_API_BASE mungon. Vendos adresen e plotte te API-se ne Render, p.sh. https://schoolbuffet.onrender.com');
}

const apiUrl = new URL(apiBase);

if (apiUrl.protocol !== 'https:') {
  throw new Error('SB_API_BASE duhet te jete https:// per cookie SameSite=None.');
}

const apiOrigin = apiUrl.origin;

const envSource = [
  '(function (global) {',
  '  var SB = global.SB = global.SB || {};',
  '',
  '  SB.env = {',
  '    apiBase: ' + JSON.stringify(apiBase),
  '  };',
  '})(window);',
  ''
].join('\n');

const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: " + apiOrigin,
  "connect-src 'self' " + apiOrigin,
  "form-action 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'"
].join('; ');

const headers = [
  '/*',
  '  X-Content-Type-Options: nosniff',
  '  X-Frame-Options: DENY',
  '  Referrer-Policy: same-origin',
  '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
  '  Content-Security-Policy: ' + csp,
  '',
  '/js/*',
  '  Cache-Control: no-cache',
  '',
  '/css/*',
  '  Cache-Control: no-cache',
  '',
  '/assets/img/*',
  '  Cache-Control: public, max-age=86400',
  ''
].join('\n');

await writeFile(path.join(frontend, 'js', 'env.js'), envSource);
await writeFile(path.join(frontend, '_headers'), headers);

console.log('Frontend/js/env.js dhe Frontend/_headers u gjeneruan per ' + apiOrigin);
