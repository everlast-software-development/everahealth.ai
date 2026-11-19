import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useSubmit } from '../lib/useSubmit.js';
import { img } from '../lib/assets.js';
import Field from './Field.jsx';
import Done from './Done.jsx';

export default function WaitlistModal({ onClose }) {
  const ref = useRef(null);
  const { status, error, fields, submit } = useSubmit('/api/waitlist');
  useEffect(() => { ref.current.showModal(); }, []);
  const close = () => ref.current.close();
  const onSubmit = (e) => { e.preventDefault(); submit(Object.fromEntries(new FormData(e.currentTarget))); };

  return (
    <dialog ref={ref} className="modal" aria-labelledby="wl-title" onClose={onClose} onClick={(e) => e.target === ref.current && close()}>
      <div className="modal__in">
        <button className="modal__x" onClick={close} aria-label="Close"><X /></button>
        {status === 'done' ? (
          <Done title="You’re on the list" text="We’ll email you as soon as Evera opens for early access."><button className="cta cta--lime" onClick={close}><span>Done</span></button></Done>
        ) : (
          <>
            <span className="badge badge--glass"><img src={img['logo-dna-white']} alt="" /> Evera Waitlist</span>
            <h2 id="wl-title" className="modal__title">Get Early Access</h2>
            <p className="modal__text">We’re launching Evera soon! Join our waitlist to enjoy early access, exclusive updates, and be the first to explore the full experience.</p>
            <form onSubmit={onSubmit} noValidate>
              <Field label="Name" name="name" required autoComplete="name" error={fields.name} sfx="-wl" />
              <Field label="Email" name="email" type="email" required autoComplete="email" error={fields.email} sfx="-wl" />
              <Field label="Phone Number" name="phone" type="tel" autoComplete="tel" error={fields.phone} sfx="-wl" />
              <Field label="Message" name="message" textarea error={fields.message} sfx="-wl" />
              <input type="text" name="website" tabIndex="-1" autoComplete="off" className="hp" aria-hidden="true" />
              {error && <p className="form__err" role="alert">{error}</p>}
              <button className="cta cta--lime cta--block" type="submit" disabled={status === 'sending'}><span>{status === 'sending' ? 'Joining…' : 'Join the waitlist'}</span></button>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
