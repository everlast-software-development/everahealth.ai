import { useEffect, useRef } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { siFacebook, siInstagram, siTiktok, siYoutube, siSnapchat, siX } from 'simple-icons';

const si = { siFacebook, siInstagram, siTiktok, siYoutube, siSnapchat, siX };
import { img } from '../lib/assets.js';
import { ease, inView } from '../lib/motion.js';

// Small pill label with the DNA mark, used above section titles
export function Badge({ children, dark = false }) {
  return (
    <motion.span className={`badge ${dark ? 'badge--dark' : ''}`} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ duration: 0.7, ease }}>
      <img src={dark ? img['logo-dna-white'] : img['logo-dna']} alt="" />
      {children}
    </motion.span>
  );
}

// Heading where each line slides up from behind a mask.
// lines: [['plain text'], ['text', 'accent-class']] or strings
export function Lines({ as: Tag = 'h2', lines, className = '', delay = 0, play }) {
  const ref = useRef(null);
  const seen = useInView(ref, inView);
  const show = play ?? seen;
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => {
        const parts = Array.isArray(line) ? line : [line];
        return (
          <span className="line" key={i}>
            <motion.span className="line__in" initial={{ y: '105%' }} animate={show ? { y: '0%' } : {}} transition={{ duration: 1, ease, delay: delay + i * 0.1 }}>
              {parts.map((p, k) => (typeof p === 'string' ? <span key={k}>{p}</span> : <span key={k} className={p.c}>{p.t}</span>))}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}

// Number that counts up once it is on screen
export function Counter({ to, from = 0, duration = 1.6, decimals = 0, suffix = '', delay = 0 }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  useEffect(() => {
    if (!seen) return;
    const c = animate(from, to, { duration, delay, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => { if (ref.current) ref.current.textContent = v.toFixed(decimals) + suffix; } });
    return c.stop;
  }, [seen, to, from, duration, decimals, suffix, delay]);
  return <span ref={ref}>{from.toFixed(decimals)}{suffix}</span>;
}

export function SocialIcon({ k }) {
  if (k === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.16-.02-2.64-1.6-2.64-1.62 0-1.86 1.26-1.86 2.56v4.92h-4v-11Z" /></svg>
    );
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={si[k].path} /></svg>;
}

// Social links: on hover/focus a lime liquid fill rises, the icon swaps (out up, in from below),
// the button lifts with a soft glow and a tooltip names the platform. Styles: site.css (html.is-f .socials).
// `on` (optional): pop in one after another when the parent section becomes active; without it, when scrolled into view.
export function Socials({ items, className = '', on, delay = 0 }) {
  const pop = (i) => ({ duration: 0.45, ease, delay: delay + i * 0.05 });
  const motionProps = (i) => (on === undefined
    ? { initial: { opacity: 0, scale: 0.6 }, whileInView: { opacity: 1, scale: 1 }, viewport: inView, transition: pop(i) }
    : { initial: false, animate: on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }, transition: on ? pop(i) : { duration: 0.2 } });
  return (
    <ul className={`socials ${className}`}>
      {items.map((s, i) => (
        <motion.li key={s.name} {...motionProps(i)}>
          <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
            <span className="socials__ic" aria-hidden="true"><span><SocialIcon k={s.key} /></span><span><SocialIcon k={s.key} /></span></span>
          </a>
          <span className="socials__tip" aria-hidden="true">{s.name}</span>
        </motion.li>
      ))}
    </ul>
  );
}
