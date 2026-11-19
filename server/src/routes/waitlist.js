import { Router } from 'express';
import crypto from 'node:crypto';
import { validateWaitlist, isBot } from '../lib/validate.js';
import { insert, findOne } from '../lib/store.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    if (isBot(req.body)) return res.status(201).json({ ok: true }); // silently ignore bots

    const { data, errors } = validateWaitlist(req.body);
    if (Object.keys(errors).length) {
      return res.status(422).json({ message: 'Check the highlighted fields.', errors });
    }

    // Joining twice is not an error for the person, so answer the same way
    const existing = await findOne('waitlist', (r) => r.email === data.email);
    if (existing) return res.status(200).json({ ok: true, alreadyJoined: true });

    await insert('waitlist', { id: crypto.randomUUID(), ...data, createdAt: new Date().toISOString() });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
