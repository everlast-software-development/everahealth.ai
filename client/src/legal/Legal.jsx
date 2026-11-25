import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUp, ArrowUpRight, Check, ChevronDown, MapPin, Phone } from 'lucide-react';
import { legal, UPDATED } from '../data/legal.js';
import { contact } from '../data/landing.js';

/* The Privacy Policy and Terms & Conditions pages (/privacy-policy, /terms-and-conditions).
   A normal scrolling document, outside the one-screen slider of the home page. The text is in data/legal.js.
   Wide screens: the contents list stays beside the text. Narrow screens: it becomes a bar under the header that
   shows the current section and opens the list. Styles: legal.css. */

const num = (n) => String(n + 1).padStart(2, '0');
const ORDER = ['privacy', 'terms'];

// a mention of the other document by its name ("Privacy Policy", "Terms & Conditions") becomes a link to it
const NAMES = new RegExp(`(${ORDER.map((k) => legal[k].label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`);
function rich(text, page) {
  return text.split(NAMES).map((part, k) => {
    const key = ORDER.find((x) => legal[x].label === part);
    return key && key !== page ? <a key={k} href={legal[key].path}>{part}</a> : part;
  });
}

function Block({ b, page }) {
  if (typeof b === 'string') return <p>{rich(b, page)}</p>;
  if (b.sub) return <h3>{b.sub}</h3>;
  if (b.note) return <p className="lg-note" role="note">{b.title && <b>{b.title} </b>}{rich(b.note, page)}</p>;
  if (b.list) return <ul>{b.list.map((x, k) => <li key={k}>{Array.isArray(x) ? <><b>{x[0]}</b> {rich(x[1], page)}</> : rich(x, page)}</li>)}</ul>;
  if (b.contact) return (
    <ul className="lg-contact">
      <li><ArrowUpRight aria-hidden="true" /><span>Send us a message through the <a href="/#contact">contact form</a> on our website.</span></li>
      <li><Phone aria-hidden="true" /><span>Call us on <a href={contact.phoneHref}>{contact.phone}</a>.</span></li>
      <li><MapPin aria-hidden="true" /><span>Evera AI, {contact.address}.</span></li>
    </ul>
  );
  return null;
}

export default function Legal({ page }) {
  const doc = legal[page];
  const [active, setActive] = useState(doc.sections[0].id);       // the section being read
  const [open, setOpen] = useState(false);                         // narrow screens: the contents list
  const [far, setFar] = useState(false);                           // scrolled well down: show "back to top"
  const toc = useRef(null);

  // the page's own background and scrolling; title, description and canonical address for this document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('is-legal');
    document.title = `${doc.label} | Evera AI`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', doc.description);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = `${window.location.origin}${doc.path}`;
    return () => root.classList.remove('is-legal');
  }, [doc]);

  // the current section: the last one whose top has passed the upper part of the screen (the last section at the page's end)
  useEffect(() => {
    const els = doc.sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    let raf = 0;
    const read = () => {
      raf = 0;
      setFar(window.scrollY > window.innerHeight * 0.9);
      const line = Math.max(window.innerHeight * 0.3, 170);
      let cur = els[0];
      for (const el of els) { if (el.getBoundingClientRect().top <= line) cur = el; else break; }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = els[els.length - 1];
      if (cur) setActive(cur.id);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    // (the page's height changes when the web fonts arrive: read again then)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onScroll) : null;
    ro?.observe(document.documentElement);
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); read();
    return () => { cancelAnimationFrame(raf); ro?.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [doc]);

  // the open contents list closes on Escape and on a tap outside it
  useEffect(() => {
    if (!open) return undefined;
    const key = (e) => { if (e.key === 'Escape') setOpen(false); };
    const tap = (e) => { if (!toc.current?.contains(e.target)) setOpen(false); };
    window.addEventListener('keydown', key); window.addEventListener('pointerdown', tap);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', tap); };
  }, [open]);

  const at = Math.max(0, doc.sections.findIndex((s) => s.id === active));
  const other = legal[ORDER.find((k) => k !== page)];

  return (
    <div className="lg">
      <a className="lg-skip" href="#lg-main">Skip to the text</a>

      <header className="lg-nav">
        <div className="lg-wrap lg-nav__in">
          <a className="lg-nav__logo" href="/" aria-label="Evera home"><img src="/brand/evera-wordmark.webp" alt="EVERA" /></a>
          <a className="lg-nav__back" href="/"><ArrowLeft aria-hidden="true" /><span>Back to site</span></a>
        </div>
      </header>

      <main id="lg-main" className="lg-wrap">
        <div className="lg-hero">
          <p className="lg-kicker">Legal</p>
          <h1>{doc.title[0]} <span>{doc.title[1]}</span></h1>
          <p className="lg-updated"><i aria-hidden="true" />Last updated {UPDATED}</p>
          <nav className="lg-switch" aria-label="Legal documents">
            {ORDER.map((k) => <a key={k} href={legal[k].path} className={k === page ? 'is-on' : ''} aria-current={k === page ? 'page' : undefined}>{legal[k].label}</a>)}
          </nav>
        </div>

        <div className="lg-body">
          <nav className={`lg-toc ${open ? 'is-open' : ''}`} aria-label="On this page" ref={toc}>
            <button className="lg-toc__bar" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="lg-toc-list">
              <span className="lg-toc__n">{num(at)}</span>
              <span className="lg-toc__cur"><small>On this page</small><b>{doc.sections[at].title}</b></span>
              <ChevronDown aria-hidden="true" />
            </button>
            <p className="lg-toc__h">On this page</p>
            <ol id="lg-toc-list" className="lg-toc__list">
              {doc.sections.map((s, n) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={s.id === active ? 'is-on' : ''} aria-current={s.id === active ? 'location' : undefined} onClick={() => setOpen(false)}>
                    <span>{num(n)}</span>{s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="lg-doc">
            <p className="lg-intro">{doc.intro}</p>

            <section className="lg-sum" aria-labelledby="lg-sum-h">
              <h2 id="lg-sum-h">In short</h2>
              <ul>{doc.summary.map((x) => <li key={x}><Check aria-hidden="true" /><span>{x}</span></li>)}</ul>
              <p>This summary is here to help. The full text below is what applies.</p>
            </section>

            {doc.sections.map((s, n) => (
              <section key={s.id} id={s.id} className="lg-sec" aria-labelledby={`${s.id}-h`}>
                <h2 id={`${s.id}-h`}><span aria-hidden="true">{num(n)}</span>{s.title}</h2>
                {s.blocks.map((b, k) => <Block key={k} b={b} page={page} />)}
              </section>
            ))}

            <aside className="lg-next">
              <p><small>Read next</small><b>{other.label}</b></p>
              <a className="lg-btn" href={other.path}>Open<ArrowUpRight aria-hidden="true" /></a>
            </aside>
          </article>
        </div>
      </main>

      <footer className="lg-foot">
        <div className="lg-wrap lg-foot__in">
          <p>© 2026 Evera AI · {contact.address}</p>
          <nav aria-label="Footer">
            <a href="/">Home</a>
            {ORDER.map((k) => <a key={k} href={legal[k].path} aria-current={k === page ? 'page' : undefined}>{legal[k].label}</a>)}
          </nav>
        </div>
      </footer>

      <button className={`lg-top ${far ? 'is-on' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" tabIndex={far ? 0 : -1}><ArrowUp aria-hidden="true" /></button>
    </div>
  );
}
