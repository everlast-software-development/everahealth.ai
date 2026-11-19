const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9\s\-()]{7,20}$/;

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function validateWaitlist(body = {}) {
  const data = {
    name: clean(body.name, 100),
    email: clean(body.email, 200).toLowerCase(),
    phone: clean(body.phone, 30),
    plan: clean(body.plan, 30),
    message: clean(body.message, 2000),
  };
  const errors = {};
  if (data.name.length < 2) errors.name = 'Enter your name.';
  if (!EMAIL.test(data.email)) errors.email = 'Enter an email address like name@example.com.';
  if (data.phone && !PHONE.test(data.phone)) errors.phone = 'Enter a phone number with digits only, for example +971 50 123 4567.';
  if (data.plan && !['Basic', 'Premium', 'Professional'].includes(data.plan)) data.plan = '';
  return { data, errors };
}

export function validateContact(body = {}) {
  const data = {
    name: clean(body.name, 100),
    email: clean(body.email, 200).toLowerCase(),
    phone: clean(body.phone, 30),
    subject: clean(body.subject, 150),
    message: clean(body.message, 3000),
  };
  const errors = {};
  if (data.name.length < 2) errors.name = 'Enter your name.';
  if (!EMAIL.test(data.email)) errors.email = 'Enter an email address like name@example.com.';
  if (data.phone && !PHONE.test(data.phone)) errors.phone = 'Enter a phone number like +971 50 123 4567.';
  if (data.message.length < 10) errors.message = 'Write at least 10 characters so we know how to help.';
  return { data, errors };
}

// Honeypot: the hidden "website" field is empty for real people
export const isBot = (body = {}) => typeof body.website === 'string' && body.website.trim() !== '';

export function validateNewsletter(body = {}) {
  const data = { email: clean(body.email, 200).toLowerCase() };
  const errors = {};
  if (!EMAIL.test(data.email)) errors.email = 'Enter an email address like name@example.com.';
  return { data, errors };
}
