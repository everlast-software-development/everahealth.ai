import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import waitlistRouter from './routes/waitlist.js';
import contactRouter from './routes/contact.js';
import newsletterRouter from './routes/newsletter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'style-src': ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
    },
  },
}));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));

// Form endpoints: at most 10 submissions per IP every 15 minutes
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many attempts. Wait a few minutes and try again.' },
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/waitlist', formLimiter, waitlistRouter);
app.use('/api/contact', formLimiter, contactRouter);
app.use('/api/newsletter', formLimiter, newsletterRouter);
app.use('/api', (_req, res) => res.status(404).json({ message: 'Not found.' }));

// In production, the same server also serves the built React site
const clientDist = path.resolve(__dirname, '../../client/dist');
if (isProd && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, { maxAge: '7d', index: false }));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

// Last-resort error handler: never leak stack traces to the browser
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'The request body is not valid JSON.' });
  }
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on our side. Try again in a moment.' });
});

app.listen(PORT, () => console.log(`Evera API running on http://localhost:${PORT}`));
