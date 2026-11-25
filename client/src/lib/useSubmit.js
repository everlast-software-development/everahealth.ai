import { useState } from 'react';
import { postJSON } from './api.js';

// Shared state for the contact form
export function useSubmit(path) {
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');
  const [fields, setFields] = useState({});

  async function submit(values) {
    setStatus('sending');
    setError('');
    setFields({});
    try {
      await postJSON(path, values);
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setFields(err.fields || {});
      setStatus('error');
    }
  }

  return { status, error, fields, submit };
}
