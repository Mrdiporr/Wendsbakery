// ─────────────────────────────────────────────────────────────────────────────
// server.js — Custom Next.js server entry point for cPanel / Phusion Passenger
//
// cPanel's Node.js App manager (Phusion Passenger) requires a server.js file
// at the project root as its startup entry point.
//
// Environment variables are set in the cPanel Node.js App UI.
// ─────────────────────────────────────────────────────────────────────────────

const { createServer } = require('http');
const { parse }        = require('url');
const next             = require('next');

const dev      = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || 'localhost';
const port     = parseInt(process.env.PORT || '3000', 10);

const app    = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  }).listen(port, hostname, () => {
    console.log(`> Wendy's Bakehouse storefront ready on http://${hostname}:${port}`);
  });
});
