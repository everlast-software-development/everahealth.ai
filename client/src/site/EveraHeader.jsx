import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import './header.css';

/* Evera header: the logo on the left; "Get early access" and "Menu" on the right, on the same gutter as
   every section. "Menu" opens a full-screen index that grows out of the button as a circle. */

const E = [0.22, 1, 0.36, 1];
const IRIS = [0.76, 0, 0.24, 1];
const ITEMS = [
  { i: 0, title: 'Home', text: 'Meet Evera, your AI medical assistant.' },
  { i: 1, title: 'How it works', text: 'Upload, track, act: three simple steps.' },
  { i: 2, title: 'About', text: 'Why we built Evera, and who it is for.' },
  { i: 3, title: 'Face scan', text: 'See what a selfie can tell about your health.' },
  { i: 4, title: 'Features', text: 'Lab results, skin, body and meals in one place.' },
  { i: 7, title: 'Pricing', text: 'Simple plans for every need.' },
  { i: 8, title: 'Contact', text: 'Questions? Talk to the Evera team.' },
];
const num = (i) => String(i + 1).padStart(2, '0');
const STOP_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']);

/* the label is two stacked copies: on hover the first rolls up and out, the second rolls in */
const Roll = ({ children }) => (
  <span className="ev-roll"><span>{children}</span><span aria-hidden="true">{children}</span></span>
);

export default function EveraHeader({ cur, go, onJoin, logo, inert }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(null);         // the menu item under the pointer or focus
  const [origin, setOrigin] = useState({ x: 0, y: 0, r: 2000 });
  const btn = useRef(null);
  const firstItem = useRef(null);

  const toggle = () => {
    if (!open) {
      // the circle grows from the button's centre to the farthest corner (+40)
      const b = btn.current.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
      const r = Math.max(Math.hypot(x, y), Math.hypot(innerWidth - x, y), Math.hypot(x, innerHeight - y), Math.hypot(innerWidth - x, innerHeight - y)) + 40;
      setOrigin({ x, y, r });
      setHover(null);
    }
    setOpen((o) => !o);
  };
  const close = () => setOpen(false);
  const pick = (i) => { close(); go(i); };

  // while open: Esc closes; nothing may move the section slider (or the page) behind
  useEffect(() => {
    if (!open) return undefined;
    const block = (e) => {
      if (e.type === 'keydown') {
        if (e.key === 'Escape') { e.preventDefault(); close(); return; }
        if (!STOP_KEYS.has(e.key) || e.target.closest?.('input, textarea')) return;
        if (e.key === ' ' && e.target.closest?.('button, a')) return;      // Space still presses a focused button
      }
      e.preventDefault(); e.stopImmediatePropagation();
    };
    const opts = { capture: true, passive: false };
    ['wheel', 'touchmove', 'keydown'].forEach((t) => window.addEventListener(t, block, opts));
    const f = setTimeout(() => firstItem.current?.focus({ preventScroll: true }), 450);
    return () => { clearTimeout(f); ['wheel', 'touchmove', 'keydown'].forEach((t) => window.removeEventListener(t, block, opts)); };
  }, [open]);
  // closing hands focus back to the Menu button
  const wasOpen = useRef(false);
  useEffect(() => { if (wasOpen.current && !open) btn.current?.focus({ preventScroll: true }); wasOpen.current = open; }, [open]);

  const shownItem = ITEMS.find((x) => x.i === hover) || ITEMS.find((x) => x.i === cur) || ITEMS[0];
  const shut = `circle(0px at ${origin.x}px ${origin.y}px)`, full = `circle(${origin.r}px at ${origin.x}px ${origin.y}px)`;

  return (
    <header className={`f-nav ev-nav ${open ? 'is-open' : ''}`} inert={inert ? '' : undefined}>
      <div className="ev-nav__bar">
        <button className="ev-nav__logo" onClick={() => pick(0)} aria-label="Evera home"><img src={logo} alt="EVERA" /></button>
        <div className="ev-nav__acts">
          <button className="ev-pillbtn ev-pillbtn--join" onClick={() => { close(); onJoin(); }}>
            <Roll>Get early access</Roll>
            <span className="ev-pillbtn__ic"><ArrowUpRight aria-hidden="true" /></span>
          </button>
          <button ref={btn} className={`ev-pillbtn ev-pillbtn--menu ${open ? 'is-open' : ''}`} onClick={toggle}
            aria-expanded={open} aria-controls="ev-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
            <Roll>{open ? 'Close' : 'Menu'}</Roll>
            <span className="ev-pillbtn__ic" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div id="ev-menu" className="ev-menu" role="dialog" aria-modal="true" aria-label="Site menu"
            initial={{ clipPath: shut }} animate={{ clipPath: full }} exit={{ clipPath: shut }} transition={{ duration: 0.85, ease: IRIS }}>
            <div className="ev-menu__grid">
              <nav aria-label="Sections">
                <ul className={`ev-menu__list ${hover !== null ? 'has-hover' : ''}`} onMouseLeave={() => setHover(null)}>
                  {ITEMS.map((x, k) => (
                    <li key={x.i}>
                      <span className="ev-menu__mask">
                        <motion.button ref={k === 0 ? firstItem : undefined}
                          className={`ev-menu__item ${x.i === cur ? 'is-cur' : ''} ${x.i === hover ? 'is-hover' : ''}`}
                          onClick={() => pick(x.i)} onMouseEnter={() => setHover(x.i)} onBlur={() => setHover(null)}
                          onFocus={(e) => { if (e.currentTarget.matches(':focus-visible')) setHover(x.i); }}   /* keyboard focus only, not the opening focus after a click/tap */
                          aria-current={x.i === cur ? 'page' : undefined}
                          initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 0.8, ease: E, delay: 0.25 + k * 0.05 }}>
                          <span className="ev-menu__num">{num(x.i)}</span>
                          <span className="ev-menu__title">{x.title}</span>
                        </motion.button>
                      </span>
                    </li>
                  ))}
                </ul>
              </nav>
              <motion.aside className="ev-menu__side" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: E, delay: 0.55 }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={shownItem.i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <p className="ev-menu__label">{num(shownItem.i)} / {shownItem.title}</p>
                    <p className="ev-menu__text">{shownItem.text}</p>
                  </motion.div>
                </AnimatePresence>
                <button className="ev-menu__join" onClick={() => { close(); onJoin(); }}>Join our waiting list<ArrowUpRight aria-hidden="true" /></button>
              </motion.aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
