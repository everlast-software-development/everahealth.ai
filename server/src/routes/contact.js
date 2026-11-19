import { Router } from 'express';
import crypto from 'node:crypto';
import { validateContact, isBot } from '../lib/validate.js';
import { insert } from '../lib/store.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    if (isBot(req.body)) return res.status(201).json({ ok: true });

    const { data, errors } = validateContact(req.body);
    if (Object.keys(errors).length) {
      return res.status(422).json({ message: 'Check the highlighted fields.', errors });
    }

    await insert('messages', { id: crypto.randomUUID(), ...data, createdAt: new Date().toISOString() });
    // Next step: send an email notification here (e.g. with Nodemailer or Resend)
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
