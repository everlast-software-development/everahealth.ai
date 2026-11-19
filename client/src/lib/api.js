// Small wrapper around fetch for the Node API.
// In development Vite forwards /api to localhost:5000 (see vite.config.js).
const BASE = import.meta.env.VITE_API_URL || '';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Preview build: no server, so check the basics and pretend it worked
async function fakePost(path, body) {
  await new Promise((r) => setTimeout(r, 700));
  const fields = {};
  if ('name' in body && String(body.name || '').trim().length < 2) fields.name = 'Enter your name.';
  if (!EMAIL.test(String(body.email || '').trim())) fields.email = 'Enter an email address like name@example.com.';
  if (path.includes('contact') && String(body.message || '').trim().length < 10) fields.message = 'Write at least 10 characters so we know how to help.';
  if (Object.keys(fields).length) { const e = new Error('Check the highlighted fields.'); e.fields = fields; throw e; }
  return { ok: true };
}

export async function postJSON(path, body) {
  if (import.meta.env.VITE_PREVIEW) return fakePost(path, body);
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Something went wrong. Try again in a moment.');
    err.fields = data.errors || {};
    throw err;
  }
  return data;
}
