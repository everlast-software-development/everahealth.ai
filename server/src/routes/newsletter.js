import { Router } from 'express';
import crypto from 'node:crypto';
import { validateNewsletter, isBot } from '../lib/validate.js';
import { insert, findOne } from '../lib/store.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    if (isBot(req.body)) return res.status(201).json({ ok: true });
    const { data, errors } = validateNewsletter(req.body);
    if (Object.keys(errors).length) return res.status(422).json({ message: 'Check your email address.', errors });

    const existing = await findOne('newsletter', (r) => r.email === data.email);
    if (!existing) await insert('newsletter', { id: crypto.randomUUID(), ...data, createdAt: new Date().toISOString() });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
