import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowUpRight, ArrowDown, ArrowLeft, ArrowRight, Upload, TrendingUp, Sparkles, Box, Users, Eye, Activity, Star, Check, Phone, User, Mail, FileText, MessageSquare } from 'lucide-react';
import { useInView } from 'framer-motion';
import f1 from '../assets/face/img1.webp';
import f2 from '../assets/face/img2.webp';
import f3 from '../assets/face/img3.webp';
import f4 from '../assets/face/img4.webp';
import f5 from '../assets/face/img5.webp';
import { img } from '../lib/assets.js';
import { steps, who, features, journey, testimonials, plans, contact, socials } from '../data/landing.js';
import { useSubmit } from '../lib/useSubmit.js';
import LiveUpload from '../components/LiveUpload.jsx';
import ChartArt from '../components/ChartArt.jsx';
import LiveImage from '../components/LiveImage.jsx';
import { BloodArt, BodyArt, SkinArt, MealArt, WalletArt, NutritionArt, OverviewArt } from '../components/FeatureArt.jsx';
import { Socials } from '../components/ui.jsx';
import WaitlistModal from '../components/WaitlistModal.jsx';
import EveraHero from './EveraHero.jsx';
import EveraHeader from './EveraHeader.jsx';
import videoMp4 from '../assets/video/evera-hero.mp4';
import videoWebm from '../assets/video/evera-hero.webm';
import poster from '../assets/video/evera-hero-poster.jpg';
import bg from '../assets/video/evera-bg.jpg';
import whoFull from '../assets/live/who-full.webp';
import landDots from '../assets/globe/land-dots.json';
import './site.css';

const PUSH = [0.77, 0, 0.18, 1];
const isPhone = () => typeof window !== 'undefined' && matchMedia('(max-width: 860px)').matches;
function usePhone() {
  const [m, setM] = useState(isPhone);
  useEffect(() => { const q = matchMedia('(max-width: 860px)'); const f = () => setM(q.matches); q.addEventListener('change', f); return () => q.removeEventListener('change', f); }, []);
  return m;
}
/* phones: a row of cards you swipe sideways (native scroll-snap) with dots below */
function SnapRow({ items, render, label }) {
  const ref = useRef(null);
  const [cur, setCur] = useState(0);
  const onScroll = () => { const el = ref.current; if (!el) return; const w = el.firstElementChild?.getBoundingClientRect().width || 1; setCur(Math.round(el.scrollLeft / (w + 12))); };
  return (
    <div className="fm-snap">
      <div className="fm-snap__row" ref={ref} onScroll={onScroll} role="list" aria-label={label}>
        {items.map((x, n) => <div key={n} className="fm-snap__card" role="listitem">{render(x, n)}</div>)}
      </div>
      <div className="fm-snap__dots" aria-hidden="true">{items.map((x, n) => <i key={n} className={n === cur ? 'is-on' : ''} />)}</div>
    </div>
  );
}   // the section-to-section move
const E = [0.22, 1, 0.36, 1];

/* a line of big type that rises out of a mask when its section becomes active */
const Rise = ({ on, d = 0, children, className = '' }) => (
  <span className={`f-mask ${className}`}><motion.span initial={false} animate={on ? { y: '0%', opacity: 1 } : { y: '105%', opacity: 0 }} transition={{ duration: on ? 0.9 : 0.3, ease: E, delay: on ? d : 0 }}>{children}</motion.span></span>
);
const Fade = ({ on, d = 0, children, className = '', as = 'div' }) => {
  const C = motion[as];
  return <C className={className} initial={false} animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ duration: on ? 0.8 : 0.25, ease: E, delay: on ? d : 0 }}>{children}</C>;
};

function Video({ className = '' }) {
  const ref = useRef(null);
  useEffect(() => { if (!matchMedia('(prefers-reduced-motion: reduce)').matches) ref.current?.play().catch(() => {}); }, []);
  return (
    <video ref={ref} className={`f-media ${className}`} poster={poster} autoPlay muted loop playsInline preload="auto" aria-hidden="true">
      <source src={videoMp4} type="video/mp4" /><source src={videoWebm} type="video/webm" />
    </video>
  );
}
/* Evera's photo as a full-bleed image, scaled slightly while its section enters */
const Photo = ({ on, pos = '50% 25%', className = '' }) => (
  <motion.div className={`f-media f-photo ${className}`} style={{ backgroundImage: `url(${img.doctor}), url(${bg})`, backgroundPosition: `${pos}, center` }}
    initial={false} animate={{ scale: on ? 1 : 1.12 }} transition={{ duration: 1.4, ease: E }} aria-hidden="true" />
);

/* ---------------- sections ---------------- */
/* Home is EveraHero (./EveraHero.jsx) */

/* Built for better care: three typographic designs, no mockups. Each scroll moves one step. */
const STEP_ICONS = [Upload, TrendingUp, Sparkles];
const STEP_WORDS = ['Upload', 'Track', 'Act'];
// the original step images
const STEP_ART = [
  () => <div className="f-artpad"><LiveUpload /></div>,
  () => <div className="f-artpad"><ChartArt /></div>,
  () => <div className="f-artpad"><LiveImage id="ai" zoom={false} layers={{ analysts: { from: 'up', delay: 0.2, depth: 2 }, reco: { from: 'left', delay: 0.35, depth: 3 }, guidance: { from: 'right', delay: 0.5, depth: 2.5 } }} /></div>,
];
const StepImg = ({ n, on, className = '' }) => { const A = STEP_ART[n]; return <div className={`f-stepimg ${className}`}>{on && <A />}</div>; };
const DrawIcon = ({ I, k }) => <I key={k} className="f-draw" strokeWidth={1} aria-hidden="true" />;

/* 2 — panels sliding sideways like a film strip */
function CarePanels({ on, i }) {
  return (
    <div className="f-pan">
      <motion.div className="f-pan__track" initial={false} animate={{ x: `${-i * 100}%`, opacity: on ? 1 : 0 }} transition={{ duration: 0.9, ease: [0.77, 0, 0.18, 1] }}>
        {steps.map((x, n) => (
          <div key={x.title} className="f-pan__panel" aria-hidden={n !== i}>
            <StepImg n={n} on={on && Math.abs(n - i) <= 1} className="f-pan__img" />
            <div className="f-pan__txt">
              <span className="f-pan__num">0{n + 1}</span>
              <p className="f-pan__word">Step {n + 1} · {STEP_WORDS[n]}</p>
              <h3>{x.title}</h3>
              <p className="f-pan__text">{x.text}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}


function Care({ on, register, enteredFrom }) {
  const phone = usePhone();
  const { i, dir, pick, iRef } = useSteps(on, phone ? null : register, enteredFrom, steps.length);
  if (phone) return (
    <div className="fm-sec">
      <Fade on={on} d={0.1} className="f-kicker" as="p">How Evera works</Fade>
      <h2 className="f-big f-big--m"><Rise on={on} d={0.15}>Built for better care,</Rise><Rise on={on} d={0.2}><span className="f-grad">powered by AI</span></Rise></h2>
      <SnapRow label="Steps" items={steps} render={(x, n) => (<>
        <StepImg n={n} on={on} className="fm-card__img" />
        <span className="fm-card__num">0{n + 1}</span><h3>{x.title}</h3><p>{x.text}</p>
      </>)} />
    </div>
  );
  return (
    <div className="f-sec f-care2" {...swipe(pick, iRef)}>
      <div className="f-bgimg" style={{ backgroundImage: `url(${bg})` }} /><div className="f-shade f-shade--deep" />
      <div className="f-fx__head">
        <Fade on={on} d={0.1} className="f-kicker" as="p">How Evera works</Fade>
        <h2 className="f-big f-big--l f-big--m"><Rise on={on} d={0.15}>Built for better care, <span className="f-grad">powered by AI</span></Rise></h2>
      </div>
      <CarePanels on={on} i={i} />
      <StepBar items={steps} i={i} pick={pick} />
    </div>
  );
}

/* Who we are: a plain section (no scroll steps), three designs to compare */
const WhoImg = ({ on, className = '' }) => <div className={`f-who__img ${className}`}>{on && <LiveImage id="who" zoom={false} />}</div>;

/* 1 — bento */
function WhoBento({ on }) {
  return (
    <div className="f-bento">
      <div className="f-bento__head">
        <Fade on={on} d={0.1} className="f-kicker" as="p">About</Fade>
        <h2 className="f-big f-big--l f-big--m"><Rise on={on} d={0.15}>Who <span className="f-grad">we are</span></Rise></h2>
      </div>
      <div className="f-bento__grid">
        <Fade on={on} d={0.25} className="f-bento__photo">
          <img src={whoFull} alt="The Evera app: health metrics, blood tests, body and skin analysis, calorie tracker, medical wallet and personalised plans" />
        </Fade>
        {who.map((w, n) => (
          <Fade key={w.title} on={on} d={0.3 + n * 0.08} className={`f-bento__t f-bento__w f-bento__w--${n}`}>
            <span className="f-bento__n">0{n + 1}</span><h3>{w.title}</h3><p>{w.text}</p>
          </Fade>
        ))}
      </div>
    </div>
  );
}

function About({ on }) {
  return (
    <div className="f-sec f-who">
      <div className="f-bgimg" style={{ backgroundImage: `url(${bg})` }} /><div className="f-shade f-shade--deep" />
      <WhoBento on={on} />
    </div>
  );
}

/* Track your health: seven features with their images */
const FEATS = [['blood', BloodArt], ['body', BodyArt], ['skin', SkinArt], ['meal', MealArt], ['wallet', WalletArt], ['nutrition', NutritionArt], ['overview', OverviewArt]];
/* Sections that turn through their items with the scroll, then let the page move on */
function useSteps(on, register, enteredFrom, N) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const iRef = useRef(0); iRef.current = i;
  useEffect(() => { if (on) setI(enteredFrom > 0 ? N - 1 : 0); }, [on, enteredFrom, N]);
  useEffect(() => {
    if (!on || !register) return;
    register((d) => { const n = iRef.current + d; if (n < 0 || n >= N) return false; setDir(d); setI(n); return true; });
    return () => register(null);
  }, [on, register, N]);
  const pick = (n) => { setDir(n >= iRef.current ? 1 : -1); setI(Math.max(0, Math.min(N - 1, n))); };
  return { i, dir, pick, iRef };
}
const swipe = (pick, iRef) => {
  let x = null;
  return {
    onTouchStart: (e) => { x = e.touches[0].clientX; },
    onTouchEnd: (e) => { if (x == null) return; const dx = x - e.changedTouches[0].clientX; if (Math.abs(dx) > 40) { e.stopPropagation(); pick(iRef.current + (dx > 0 ? 1 : -1)); } x = null; },
  };
};
const StepBar = ({ items, i, pick }) => <div className="f-fx__bar">{items.map((x, n) => <button key={x.title} className={n <= i ? 'is-on' : ''} onClick={() => pick(n)} aria-label={x.title} />)}</div>;

/* the text block used beside a visual: big outlined number, title, description */
function StepText({ items, i, dir }) {
  const x = items[i];
  return (
    <AnimatePresence mode="wait">
      <motion.div key={i} className="f-ft" initial={{ opacity: 0, y: dir * 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: dir * -20 }} transition={{ duration: 0.5, ease: E }}>
        <p className="f-ft__num">0{i + 1}</p>
        <h3 className="f-ft__title">{x.title}</h3>
        <p className="f-ft__text">{x.text}</p>
      </motion.div>
    </AnimatePresence>
  );
}

/* Deck: each scroll throws the top card away (used for Features) */
function Deck({ on, items, i, dir }) {
  return (
    <div className="f-deck">
      <div className="f-deck__text"><StepText items={items} i={i} dir={dir} /></div>
      <div className="f-deck__pile">
        {items.map((x, n) => {
          const k = n - i, gone = k < 0, show = k >= 0 && k <= 3;
          const Art = x.Art;
          return (
            <motion.div key={x.title} className="f-deck__card" style={{ zIndex: 20 - Math.abs(k) }} initial={false}
              animate={gone ? { y: '-120%', rotate: -14, opacity: 0, scale: 0.9 }
                : { y: k * 16, x: k * 10, rotate: k === 0 ? 0 : (k % 2 ? 4 : -3) * Math.min(k, 2), scale: 1 - k * 0.05, opacity: !on || !show ? 0 : 1 }}
              transition={{ duration: 0.8, ease: E }}>
              <div className="f-deck__art">{on && Math.abs(k) <= 1 && <Art />}</div>
              <p className="f-deck__cap"><span className="f-num">0{n + 1}</span>{x.title}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* Big title: a giant word with the image card flipping in front */
function BigTitle({ on, items, i, dir }) {
  const x = items[i], Art = x.Art;
  return (
    <div className="f-tt">
      <div className="f-tt__word" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={i} initial={{ y: dir > 0 ? '100%' : '-100%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} exit={{ y: dir > 0 ? '-100%' : '100%', opacity: 0 }} transition={{ duration: 0.8, ease: E }}>{x.short}</motion.span>
        </AnimatePresence>
      </div>
      <div className="f-tt__card">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={i} className="f-tt__flip" initial={{ rotateY: dir * 80, opacity: 0 }} animate={{ rotateY: 0, opacity: on ? 1 : 0 }} exit={{ rotateY: dir * -80, opacity: 0 }} transition={{ duration: 0.5, ease: E }}>
            {on && <Art />}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="f-tt__info">
        <AnimatePresence mode="wait"><motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <b>{x.title}</b><p>{x.text}</p>
        </motion.div></AnimatePresence>
      </div>
      <div className="f-tt__count"><b>0{i + 1}</b><span>/ 0{items.length}</span></div>
    </div>
  );
}

/* Wheel: the names on an arc; the active one comes to the centre */
function Wheel({ on, items, i, pick, aside }) {
  const x = items[i];
  return (
    <div className="f-wh">
      <div className="f-wh__wheel">
        {items.map((it, n) => {
          const a = (n - i) * 17, rad = (a * Math.PI) / 180, R = 440;
          return (
            <motion.button key={it.title} className={`f-wh__name ${n === i ? 'is-on' : ''}`} initial={false}
              animate={{ x: Math.cos(rad) * R - R, y: Math.sin(rad) * R, rotate: a, opacity: !on ? 0 : Math.abs(n - i) > 2 ? 0 : 1 - Math.abs(n - i) * 0.3, scale: n === i ? 1 : 0.72 }}
              transition={{ duration: 0.8, ease: E }} onClick={() => pick(n)} tabIndex={on && Math.abs(n - i) <= 2 ? 0 : -1}>
              <span className="f-num">0{n + 1}</span>{it.short}
            </motion.button>
          );
        })}
      </div>
      <div className="f-wh__show">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, x: 40 }} animate={{ opacity: on ? 1 : 0, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.55, ease: E }}>
            {aside ? aside(i) : <div className="f-wh__art">{on && <x.Art />}</div>}
            <h3>{x.title}</h3><p>{x.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* Features: the deck */
const FEAT_ITEMS = FEATS.map(([key, Art]) => ({ title: features[key].title, text: features[key].text, Art }));
function Features({ on, register, enteredFrom }) {
  const phone = usePhone();
  const { i, dir, pick, iRef } = useSteps(on, phone ? null : register, enteredFrom, FEAT_ITEMS.length);
  if (phone) return (
    <div className="fm-sec">
      <Fade on={on} d={0.1} className="f-kicker" as="p">Features</Fade>
      <h2 className="f-big f-big--m"><Rise on={on} d={0.15}>Track your health</Rise><Rise on={on} d={0.2}>by <span className="f-grad">Evera AI</span></Rise></h2>
      <SnapRow label="Features" items={FEAT_ITEMS} render={(x, n) => { const A = x.Art; return (<>
        <div className="fm-card__img f-stepimg">{on && <A />}</div>
        <span className="fm-card__num">0{n + 1}</span><h3>{x.title}</h3><p>{x.text}</p>
      </>); }} />
    </div>
  );
  return (
    <div className="f-sec f-fx" {...swipe(pick, iRef)}>
      <div className="f-bgimg" style={{ backgroundImage: `url(${bg})` }} /><div className="f-shade f-shade--deep" />
      <div className="f-fx__head">
        <Fade on={on} d={0.1} className="f-kicker" as="p">Features</Fade>
        <h2 className="f-big f-big--l f-big--m"><Rise on={on} d={0.15}>Track your health by <span className="f-grad">Evera AI</span></Rise></h2>
      </div>
      <Deck on={on} items={FEAT_ITEMS} i={i} dir={dir} />
      <StepBar items={FEAT_ITEMS} i={i} pick={pick} />
    </div>
  );
}

/* Get your free AI test analysis: all six steps at once, as one connected path
   (left to right, down, then right to left). A lime line draws along it on entry. */
const PATH_POS = [[1, 1], [2, 1], [3, 1], [3, 2], [2, 2], [1, 2]];   // [column, row] for each step
function Analysis({ on, onJoin }) {
  return (
    <div className="f-sec f-jp">
      <div className="f-bgimg" style={{ backgroundImage: `url(${bg})` }} /><div className="f-shade f-shade--deep" />
      <div className="f-fx__head">
        <Fade on={on} d={0.1} className="f-kicker" as="p">How it works</Fade>
        <h2 className="f-big f-big--l f-big--m"><Rise on={on} d={0.15}><span className="f-grad">Get your free</span> AI test analysis</Rise></h2>
      </div>
      <div className="f-jp__grid">
        <Fade on={on} d={0.2} className="f-jp__card">
          <div className="f-jp__photo" style={{ backgroundImage: `url(${img.doctor})` }} aria-hidden="true" />
          <div className="f-jp__cardtxt">
            <p className="f-big f-big--s">Evera AI</p>
            <p>Upload a report and get a full AI analysis, free.</p>
            <button className="f-btn f-btn--sm" onClick={onJoin}>Start free<ArrowUpRight /></button>
          </div>
        </Fade>
        <div className="f-path">
          <i className="f-path__l f-path__l--1"><motion.em initial={false} animate={{ scaleX: on ? 1 : 0 }} transition={{ duration: 0.9, ease: 'easeInOut', delay: on ? 0.4 : 0 }} /></i>
          <i className="f-path__l f-path__l--v"><motion.em initial={false} animate={{ scaleY: on ? 1 : 0 }} transition={{ duration: 0.5, ease: 'easeInOut', delay: on ? 1.3 : 0 }} /></i>
          <i className="f-path__l f-path__l--2"><motion.em initial={false} animate={{ scaleX: on ? 1 : 0 }} transition={{ duration: 0.9, ease: 'easeInOut', delay: on ? 1.8 : 0 }} /></i>
          {journey.map((x, n) => {
            const [c, r] = PATH_POS[n];
            const reach = [0.4, 0.85, 1.3, 1.8, 2.25, 2.7][n];      // when the line arrives at this step
            return (
              <motion.div key={x.title} className="f-path__step" style={{ gridColumn: c, gridRow: r }} initial={false}
                animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ duration: 0.6, ease: E, delay: on ? reach : 0 }}>
                <span className="f-path__node">0{n + 1}</span>
                <h3>{x.title}</h3>
                <p>{x.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const DWELL = 4200;   // how long each analysis stays before the next

/* the four face-scan analyses and their images */
const CAPS = [
  { Icon: Box, title: 'Precise measurement', text: 'Creates a unique 3D model of your face for accurate health measurements.', img: f5 },
  { Icon: Users, title: 'Detailed facial data', text: 'Reveals detailed facial data for more accurate health monitoring.', img: f2 },
  { Icon: Eye, title: 'Micro-movement detection', text: 'Detects tiny facial movements that go unnoticed by the human eye.', img: f3 },
  { Icon: Activity, title: 'Tracking the pulse', text: 'Tracks the flow and pulses of blood beneath your skin.', img: f4 },
];

function useCycle(on) {
  const [st, setSt] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => { if (on) setSt(0); }, [on]);
  useEffect(() => {
    if (!on || hold || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setSt((v) => (v + 1) % CAPS.length), DWELL);
    return () => clearTimeout(t);
  }, [on, hold, st]);
  return { st, pick: (k) => { setSt(k); setHold(true); }, release: () => setHold(false) };
}

// the face: all four images stacked in one box that keeps the image's proportions
function Face({ st, children, className = '' }) {
  return (
    <div className={`f-face ${className}`}>
      {CAPS.map((c, k) => (
        <motion.img key={k} src={c.img} alt={st === k ? `The face as Evera AI sees it: ${c.title}` : ''} initial={false}
          animate={{ opacity: st === k ? 1 : 0 }} transition={{ duration: 0.8, ease: 'easeInOut' }} />
      ))}
      {children}
    </div>
  );
}

/* Face scan: the face in the centre; the current analysis large on the left; the list on the right.
   No scan line: the face softly fades to each analysis. */
function Scan({ on, register, enteredFrom }) {
  const phone = usePhone();
  // phones: the analyses change on their own; desktop: each scroll turns to the next analysis,
  // and after the fourth the page moves on to the next section
  const cycle = useCycle(on && phone);
  const steps4 = useSteps(on, phone ? null : register, enteredFrom, CAPS.length);
  const st = phone ? cycle.st : steps4.i;
  const pick = phone ? cycle.pick : steps4.pick;
  const release = phone ? cycle.release : () => {};
  const c = CAPS[st];
  if (phone) return (
    <div className="fm-sec fm-scan">
      <Fade on={on} d={0.1} className="f-kicker" as="p">Face scan</Fade>
      <h2 className="f-big f-big--m"><Rise on={on} d={0.15}>What you see vs</Rise><Rise on={on} d={0.2}>what <span className="f-grad">Evera AI</span> sees</Rise></h2>
      <div className="fm-scan__face"><Face st={st} className="fm-face" /></div>
      <div className="fm-scan__tabs" role="tablist">
        {CAPS.map((x, k) => <button key={x.title} role="tab" aria-selected={st === k} className={st === k ? 'is-on' : ''} onClick={() => pick(k)}>0{k + 1} · {x.title}</button>)}
      </div>
      <AnimatePresence mode="wait"><motion.p key={st} className="fm-scan__text" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>{c.text}</motion.p></AnimatePresence>
    </div>
  );
  return (
    <div className="f-sec f-sc" onMouseLeave={release}>
      <div className="f-bgimg" style={{ backgroundImage: `url(${bg})` }} />
      <div className="f-shade f-shade--deep" />
      <div className="f-sc__glow" aria-hidden="true" />

      <div className="f-sc__left">
        <Fade on={on} d={0.1} className="f-kicker" as="p">Face scan</Fade>
        <Fade on={on} d={0.15}><h2 className="f-sc__head">What you see vs what <span className="f-grad">Evera AI</span> sees</h2></Fade>
        <AnimatePresence mode="wait">
          <motion.div key={st} initial={{ opacity: 0, y: 24 }} animate={{ opacity: on ? 1 : 0, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5, ease: E }}>
            <p className="f-sc__num">0{st + 1}</p>
            <p className="f-sc__title">{c.title}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="f-sc__stage">
        <Face st={st} className="f-face--sc" />
        <AnimatePresence mode="wait">
          <motion.p key={st} className="f-sc__tag" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}><i />What Evera sees</motion.p>
        </AnimatePresence>
      </div>

      <ol className="f-sc__list">
        {CAPS.map((x, k) => (
          <Fade key={x.title} as="li" on={on} d={0.3 + k * 0.06}>
            <button className={st === k ? 'is-on' : ''} onMouseEnter={() => pick(k)} onFocus={() => pick(k)} onClick={() => pick(k)} aria-pressed={st === k}>
              <span className="f-sc__n">0{k + 1}</span>
              <span className="f-sc__t"><b>{x.title}</b><em>{x.text}</em></span>
            </button>
          </Fade>
        ))}
      </ol>

      {/* phones: the description under the title */}
      <AnimatePresence mode="wait"><motion.p key={st} className="f-sc__mtext" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{c.text}</motion.p></AnimatePresence>

      <div className="f-sc__bar">{CAPS.map((x, k) => <button key={x.title} onClick={() => pick(k)} aria-label={x.title}><motion.em animate={{ scaleX: st >= k ? 1 : 0 }} transition={{ duration: 0.8, ease: E }} /></button>)}</div>
    </div>
  );
}

/* Testimonials: three compact quotes side by side (one column on phones); no scroll steps.
   Entrance: cards rise, numerals draw, words appear, stars pop. One card is "active" at a time and the
   focus moves every 5 s; hovering or focusing a card picks it and pauses the cycle (resumes 2 s after
   the pointer leaves). Desktop pointers also get a spotlight and a slight 3D tilt. */
const initials = (n) => n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const VOICE_MS = 5000;
const NUM_DASH = 400;     // longer than any one glyph outline of the numerals, so each draws completely
const STARS = [0, 1, 2, 3, 4];
const finePointer = () => typeof window !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches;

function VoiceCard({ x, k, on, active, hold, run, reduced, tilt, pick }) {
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const base = 0.3 + k * 0.12;                 // when this card starts its entrance
  const words = x.quote.split(' ');
  const move = (e) => {
    if (!tilt || e.pointerType !== 'mouse') return;
    const el = e.currentTarget, r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`); el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    ry.set((px - 0.5) * 10); rx.set((0.5 - py) * 10);        // at most 5° each way
  };
  const leave = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div className="f-tm__card" initial={false} animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: on ? 0.8 : 0.25, ease: E, delay: on ? base : 0 }}>
      <motion.figure className={`f-tm__item ${active ? 'is-on' : ''}`} tabIndex={0} style={tilt ? { rotateX: rx, rotateY: ry } : undefined}
        initial={false} animate={{ y: active && !reduced ? -8 : 0 }} transition={{ duration: 0.5, ease: E }}
        onPointerEnter={() => pick(k)} onPointerMove={move} onPointerLeave={leave} onFocus={() => pick(k)}>
        <svg className="f-tm__num" viewBox="0 0 74 60" aria-hidden="true">
          <motion.text x="1" y="54" strokeDasharray={NUM_DASH} initial={false} animate={{ strokeDashoffset: on || reduced ? 0 : NUM_DASH }}
            transition={{ duration: on && !reduced ? 1 : 0, ease: 'easeInOut', delay: on ? base + 0.1 : 0 }}>0{k + 1}</motion.text>
        </svg>
        <span className="f-tm__stars" role="img" aria-label="Rated 5 out of 5">
          {STARS.map((s) => (
            <motion.span key={s} className="f-tm__star" initial={false} animate={{ scale: on ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18, delay: on ? base + 0.35 + s * 0.05 : 0 }}>
              <motion.span key={active ? 'a' : 'i'} className="f-tm__star" initial={{ scale: 1 }} animate={{ scale: active ? [1, 1.25, 1] : 1 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 + s * 0.06 }}>
                <Star aria-hidden="true" />
              </motion.span>
            </motion.span>
          ))}
        </span>
        <blockquote>
          {reduced ? `“${x.quote}”` : words.map((w, i) => (
            <Fragment key={i}>
              <motion.span className="f-tm__w" initial={false} animate={on ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 8, filter: 'blur(4px)' }}
                transition={{ duration: 0.5, ease: E, delay: on ? base + 0.2 + i * 0.02 : 0 }}>
                {i === 0 && '“'}{w}{i === words.length - 1 && '”'}
              </motion.span>
              {i < words.length - 1 && ' '}
            </Fragment>
          ))}
        </blockquote>
        <figcaption>
          <span className="f-tm__av" aria-hidden="true">{initials(x.name)}</span>
          <span className="f-tm__who"><b>{x.name}</b><em>Evera AI user</em></span>
        </figcaption>
        {/* progress to the next card; full and still while the cycle is paused */}
        {active && on && <motion.i key={`${run}-${hold}`} className="f-tm__bar" aria-hidden="true" initial={{ scaleX: hold ? 1 : 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: hold ? 0 : VOICE_MS / 1000, ease: 'linear' }} />}
      </motion.figure>
    </motion.div>
  );
}

function Voices({ on }) {
  const phone = usePhone();
  const reduced = useReducedMotion();
  const [act, setAct] = useState(0);
  const [hold, setHold] = useState(false);
  const [run, setRun] = useState(0);          // restarts the progress line after a pause
  const resume = useRef(null);
  const tilt = !phone && !reduced && finePointer();
  // leaving the section resets it; the cycle only runs while it is on screen and not paused
  useEffect(() => { if (!on) { clearTimeout(resume.current); setAct(0); setHold(false); } }, [on]);
  useEffect(() => {
    if (!on || hold) return;
    const t = setTimeout(() => setAct((a) => (a + 1) % testimonials.length), VOICE_MS);
    return () => clearTimeout(t);
  }, [on, hold, act, run]);
  useEffect(() => () => clearTimeout(resume.current), []);
  const pick = (k) => { clearTimeout(resume.current); setHold(true); setAct(k); };
  const release = () => { clearTimeout(resume.current); resume.current = setTimeout(() => { setHold(false); setRun((r) => r + 1); }, 2000); };
  return (
    <div className={phone ? 'f-tm is-m' : 'f-sec f-tm'}>
      <div className="f-bgimg" style={{ backgroundImage: `url(${bg})` }} /><div className="f-shade f-shade--deep" />
      <div className="f-tm__in">
        {phone ? (
          <div>
            <Fade on={on} d={0.1} className="f-kicker" as="p">Testimonials</Fade>
            <h2 className="f-big f-big--m"><Rise on={on} d={0.15}>Success stories</Rise><Rise on={on} d={0.2}>from <span className="f-grad">happy clients</span></Rise></h2>
          </div>
        ) : (
          <div className="f-fx__head">
            <Fade on={on} d={0.1} className="f-kicker" as="p">Testimonials</Fade>
            <h2 className="f-big f-big--l f-big--m"><Rise on={on} d={0.15}>Success stories from <span className="f-grad">happy clients</span></Rise></h2>
          </div>
        )}
        <ol className="f-tm__list" aria-label="Client testimonials" onPointerLeave={release}
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) release(); }}>
          {testimonials.map((x, k) => (
            <li key={x.name}>
              <VoiceCard x={x} k={k} on={on} active={act === k} hold={hold} run={run} reduced={reduced} tilt={tilt} pick={pick} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* Pricing: three equal cards, a huge price that counts to the new value when billing changes */
function CountUp({ to }) {
  const [v, setV] = useState(to);
  const from = useRef(to);
  useEffect(() => {
    const start = performance.now(), a = from.current, b = to, dur = 700;
    if (a === b || matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(b); from.current = b; return; }
    let raf;
    const tick = (t) => { const k = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - k, 3); setV(Math.round(a + (b - a) * e)); if (k < 1) raf = requestAnimationFrame(tick); else from.current = b; };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{v}</>;
}
function PlanCard({ p, yearly, onJoin }) {
  const price = Number(String(yearly ? p.yearly : p.monthly).replace(/[^0-9]/g, '')) || 0;
  return (
    <div className={`f-pc ${p.featured ? 'is-feat' : ''}`}>
      <div className="f-pc__top"><p className="f-pc__name">{p.name}</p>{p.featured && <em>Most popular</em>}</div>
      <p className="f-pc__price"><b><CountUp to={price} /></b><span>AED<br />/ {yearly ? 'year' : 'month'}</span></p>
      <ul className="f-pc__list">{p.features.map((x) => <li key={x}><Check aria-hidden="true" />{x}</li>)}</ul>
      <button className={`f-btn f-btn--block ${p.featured ? '' : 'f-btn--ghost'}`} onClick={onJoin}>Start free trial<ArrowUpRight /></button>
    </div>
  );
}
function Pricing({ on, onJoin }) {
  const phone = usePhone();
  const [yearly, setYearly] = useState(false);
  const seg = (
    <div className="f-pr__seg" role="radiogroup" aria-label="Billing period">
      {['Monthly', 'Yearly'].map((l) => { const sel = (l === 'Yearly') === yearly; return <button key={l} role="radio" aria-checked={sel} className={sel ? 'is-on' : ''} onClick={() => setYearly(l === 'Yearly')}>{sel && <motion.i layoutId="prseg" className="f-pr__pill" />}<span>{l}</span></button>; })}
    </div>
  );
  if (phone) {
    const order = [...plans].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return (
      <div className="fm-sec">
        <Fade on={on} d={0.1} className="f-kicker" as="p">Pricing</Fade>
        <h2 className="f-big f-big--m"><Rise on={on} d={0.15}><span className="f-grad">Smart plans</span></Rise><Rise on={on} d={0.2}>for every journey</Rise></h2>
        <div className="fm-pr__seg">{seg}</div>
        <SnapRow label="Plans" items={order} render={(p) => <PlanCard p={p} yearly={yearly} onJoin={onJoin} />} />
      </div>
    );
  }
  return (
    <div className="f-sec f-pr">
      <div className="f-bgimg" style={{ backgroundImage: `url(${bg})` }} /><div className="f-shade f-shade--deep" />
      <div className="f-pr__head">
        <div>
          <Fade on={on} d={0.1} className="f-kicker" as="p">Pricing</Fade>
          <h2 className="f-big f-big--l f-big--m"><Rise on={on} d={0.15}><span className="f-grad">Smart plans</span> for every wellness journey</Rise></h2>
        </div>
        <Fade on={on} d={0.3}>{seg}</Fade>
      </div>
      <div className="f-pr__row">
        {plans.map((p, k) => <Fade key={p.name} on={on} d={0.3 + k * 0.1} className="f-pr__cell"><PlanCard p={p} yearly={yearly} onJoin={onJoin} /></Fade>)}
      </div>
    </div>
  );
}

/* ---------------- Contact: a dotted globe centred on Abu Dhabi beside the form ---------------- */
const D2R = Math.PI / 180;
const HQ = [54.37, 24.45];            // Abu Dhabi [lon, lat]
const TILT = 16;                      // the view looks at latitude 16 so Abu Dhabi sits a little above centre
const CITIES = [['London', -0.13, 51.51], ['Cairo', 31.24, 30.04], ['New Delhi', 77.21, 28.61], ['Singapore', 103.82, 1.35]];
const v3 = (lon, lat) => { const l = lon * D2R, p = lat * D2R, c = Math.cos(p); return [c * Math.cos(l), c * Math.sin(l), Math.sin(p)]; };
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const HQV = v3(...HQ);
// each land dot with how close it is to Abu Dhabi (1 = on it, 0 = 20° or more away)
const LAND = landDots.map(([lo, la]) => { const v = v3(lo, la); return [v, Math.max(0, 1 - Math.acos(Math.min(1, dot3(v, HQV))) / D2R / 20)]; });
const GRAT = [];
for (let la = -60; la <= 60; la += 30) for (let lo = -180; lo < 180; lo += 3) GRAT.push(v3(lo, la));
for (let lo = -180; lo < 180; lo += 30) for (let la = -84; la <= 84; la += 3) GRAT.push(v3(lo, la));
const CITYV = CITIES.map(([n, lo, la]) => ({ n, v: v3(lo, la) }));
// a point on the great-circle arc from a city to Abu Dhabi, lifted up to 22% above the surface mid-way
const arcAt = (a, t) => {
  const w = Math.acos(Math.min(1, dot3(a, HQV))), s = Math.sin(w), ka = Math.sin((1 - t) * w) / s, kb = Math.sin(t * w) / s, h = 1 + 0.22 * Math.sin(Math.PI * t);
  return [(a[0] * ka + HQV[0] * kb) * h, (a[1] * ka + HQV[1] * kb) * h, (a[2] * ka + HQV[2] * kb) * h];
};
const clampLat = (v) => Math.max(-70, Math.min(70, v));
const normLon = (l) => ((((l + 180) % 360) + 360) % 360) - 180;

function drawGlobe(ctx, W, H, lonOff, latOff, t) {
  const R = Math.min(W, H) * 0.42, cx = W / 2, cy = H / 2;
  if (R < 4) return;                                   // no room yet (box not laid out)
  const l0 = (HQ[0] + lonOff) * D2R, p0 = (TILT + latOff) * D2R;
  const sl = Math.sin(l0), cl = Math.cos(l0), sp = Math.sin(p0), cp = Math.cos(p0);
  // orthographic projection; z > 0 is the near side
  const P = (v) => { const x = -v[0] * sl + v[1] * cl, c = v[0] * cl + v[1] * sl, y = cp * v[2] - sp * c, z = sp * v[2] + cp * c; return { x: cx + x * R, y: cy - y * R, z, d2: x * x + y * y }; };
  const seen = (q) => q.z > 0 || q.d2 > 1;           // lifted points stay visible outside the disc
  const disc = (x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill(); };
  // text with a dark halo so it stays legible over the land dots
  const label = (s, x, y, fill) => { ctx.lineJoin = 'round'; ctx.lineWidth = 3.5; ctx.strokeStyle = 'rgba(16,7,40,.85)'; ctx.strokeText(s, x, y); ctx.fillStyle = fill; ctx.fillText(s, x, y); };
  const rot = -18 * D2R, oa = 1.17 * R, ob = 0.30 * R, sat = t * 0.4, satFar = Math.sin(sat) < 0;
  const orbit = (from, alpha) => { ctx.save(); ctx.setLineDash([3, 6]); ctx.lineWidth = 1; ctx.strokeStyle = `rgba(188,172,255,${alpha})`; ctx.beginPath(); ctx.ellipse(cx, cy, oa, ob, rot, from, from + Math.PI); ctx.stroke(); ctx.restore(); };
  const satellite = () => {
    const ex = oa * Math.cos(sat), ey = ob * Math.sin(sat), x = cx + ex * Math.cos(rot) - ey * Math.sin(rot), y = cy + ex * Math.sin(rot) + ey * Math.cos(rot);
    const g = ctx.createRadialGradient(x, y, 0, x, y, 11); g.addColorStop(0, 'rgba(202,231,81,.55)'); g.addColorStop(1, 'rgba(202,231,81,0)');
    ctx.fillStyle = g; disc(x, y, 11); ctx.fillStyle = '#fff'; disc(x, y, 2.4);
  };
  ctx.clearRect(0, 0, W, H);
  // 1 far half of the orbit (and the satellite when it is behind)
  orbit(Math.PI, 0.14); if (satFar) satellite();
  // 2 atmosphere
  let g = ctx.createRadialGradient(cx, cy, 0.92 * R, cx, cy, 1.17 * R); g.addColorStop(0, 'rgba(146,89,255,.35)'); g.addColorStop(1, 'rgba(146,89,255,0)');
  ctx.fillStyle = g; disc(cx, cy, 1.17 * R);
  // 3 sphere, lit from the top left, with a faint rim
  ctx.fillStyle = '#160a36'; disc(cx, cy, R);
  g = ctx.createRadialGradient(cx - 0.4 * R, cy - 0.45 * R, 0, cx - 0.2 * R, cy - 0.2 * R, 1.3 * R);
  g.addColorStop(0, 'rgba(146,89,255,.42)'); g.addColorStop(0.55, 'rgba(86,25,204,.2)'); g.addColorStop(1, 'rgba(42,15,79,0)');
  ctx.fillStyle = g; disc(cx, cy, R);
  ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(188,172,255,.3)'; ctx.beginPath(); ctx.arc(cx, cy, R - 0.5, 0, 2 * Math.PI); ctx.stroke();
  // 4 graticule
  ctx.fillStyle = 'rgba(188,172,255,.16)';
  for (const v of GRAT) { const q = P(v); if (q.z > 0) ctx.fillRect(q.x - 0.5, q.y - 0.5, 1, 1); }
  // 5 land: lilac, turning lime close to Abu Dhabi
  for (const [v, k] of LAND) {
    const q = P(v); if (q.z <= 0) continue;
    ctx.fillStyle = `rgba(${(188 + 14 * k) | 0},${(172 + 59 * k) | 0},${(255 - 174 * k) | 0},${(0.22 + q.z * 0.62).toFixed(3)})`;
    disc(q.x, q.y, (0.8 + q.z * 1.15) * (1 + 0.45 * k));
  }
  // 6 arcs with comets flying to Abu Dhabi; a ripple when each one lands
  const hq = P(HQV);
  CITYV.forEach(({ v }, i) => {
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(188,172,255,.28)'; ctx.beginPath();
    let pen = false;
    for (let s = 0; s <= 48; s++) { const q = P(arcAt(v, s / 48)); if (!seen(q)) { pen = false; continue; } if (pen) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); pen = true; }
    ctx.stroke();
    const ph = ((t + i * 1.3) / 5.2) % 1, T = 0.66;
    if (ph < T) {
      const u = ph / T, e = u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u);
      for (let j = 14; j >= 1; j--) {
        const tt = e - j * 0.016; if (tt <= 0) continue;
        const q = P(arcAt(v, tt)); if (!seen(q)) continue;
        ctx.fillStyle = `rgba(202,231,81,${(0.75 * (1 - j / 15)).toFixed(3)})`; disc(q.x, q.y, 0.6 + 1.6 * (1 - j / 15));
      }
      const q = P(arcAt(v, e)); if (seen(q)) { ctx.fillStyle = '#fff'; disc(q.x, q.y, 2.3); }
    } else if (hq.z > 0) {
      const r = (ph - T) / (1 - T);
      ctx.strokeStyle = `rgba(255,255,255,${(0.8 * (1 - r)).toFixed(3)})`; ctx.beginPath(); ctx.arc(hq.x, hq.y, 5 + r * 30, 0, 2 * Math.PI); ctx.stroke();
    }
  });
  // 7 cities, fading toward the edge
  ctx.font = '500 11px Sora, sans-serif'; ctx.textBaseline = 'middle';
  for (const { n, v } of CITYV) {
    const q = P(v); if (q.z <= 0) continue;
    const a = Math.min(1, q.z / 0.35);
    ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`; disc(q.x, q.y, 2.2);
    ctx.globalAlpha = a; label(n, q.x + 7, q.y, 'rgba(255,255,255,.85)'); ctx.globalAlpha = 1;
  }
  // 8 Abu Dhabi: beam, pulse rings, glow, dot and label
  if (hq.z > 0) {
    ctx.globalAlpha = Math.min(1, hq.z / 0.3);
    const bh = 0.2 * R;
    g = ctx.createLinearGradient(0, hq.y, 0, hq.y - bh); g.addColorStop(0, 'rgba(202,231,81,.85)'); g.addColorStop(1, 'rgba(202,231,81,0)');
    ctx.fillStyle = g; ctx.fillRect(hq.x - 1, hq.y - bh, 2, bh);
    ctx.lineWidth = 1.5;
    for (let k = 0; k < 2; k++) { const r = (t / 2.4 + k * 0.5) % 1; ctx.strokeStyle = `rgba(202,231,81,${(0.7 * (1 - r)).toFixed(3)})`; ctx.beginPath(); ctx.arc(hq.x, hq.y, 4 + r * 22, 0, 2 * Math.PI); ctx.stroke(); }
    g = ctx.createRadialGradient(hq.x, hq.y, 0, hq.x, hq.y, 18); g.addColorStop(0, 'rgba(202,231,81,.4)'); g.addColorStop(1, 'rgba(202,231,81,0)');
    ctx.fillStyle = g; disc(hq.x, hq.y, 18);
    ctx.fillStyle = '#cae751'; disc(hq.x, hq.y, 4);
    ctx.font = '700 12px Sora, sans-serif'; label('Abu Dhabi', hq.x + 10, hq.y + 14, '#cae751');
    ctx.globalAlpha = 1;
  }
  // 9 near half of the orbit (and the satellite when it is in front)
  orbit(0, 0.35); if (!satFar) satellite();
}

function Globe({ on }) {
  const ref = useRef(null);
  const st = useRef({ lon: 0, lat: 0, vl: 0, vp: 0, drag: null, idle: 0, W: 0, H: 0, dpr: 1, t: 1.6 });
  const [vis, setVis] = useState(false);
  const reduced = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const paint = useCallback(() => {
    const c = ref.current, s = st.current; if (!c || !s.W) return;
    const ctx = c.getContext('2d'); ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0); drawGlobe(ctx, s.W, s.H, s.lon, s.lat, s.t);
  }, []);
  // size the canvas to its box; know when it is on screen
  useEffect(() => {
    const c = ref.current;
    const ro = new ResizeObserver(() => {
      const r = c.getBoundingClientRect(), s = st.current;
      s.dpr = Math.min(2, window.devicePixelRatio || 1); s.W = r.width; s.H = r.height;
      c.width = Math.round(r.width * s.dpr); c.height = Math.round(r.height * s.dpr); paint();
    });
    const io = new IntersectionObserver(([e]) => setVis(e.isIntersecting));
    ro.observe(c); io.observe(c); document.fonts?.ready.then(paint);
    return () => { ro.disconnect(); io.disconnect(); };
  }, [paint]);
  // the frame loop runs only while the section is active and visible
  useEffect(() => {
    if (!on || !vis || reduced) return;
    let raf, last = performance.now();
    const tick = (now) => {
      const s = st.current; s.t += Math.min(0.05, (now - last) / 1000); last = now;
      if (!s.drag) {
        s.lon = normLon(s.lon + s.vl); s.lat = clampLat(s.lat + s.vp); s.vl *= 0.94; s.vp *= 0.94;
        if (now - s.idle > 3500) { s.lon -= s.lon * 0.025; s.lat -= s.lat * 0.025; }   // ease back to Abu Dhabi
      }
      paint(); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, vis, reduced, paint]);

  const k = () => 180 / (Math.PI * Math.min(st.current.W, st.current.H) * 0.42);   // pixels → degrees
  const down = (e) => { const s = st.current; s.drag = { x: e.clientX, y: e.clientY }; s.vl = s.vp = 0; s.idle = performance.now(); e.currentTarget.setPointerCapture(e.pointerId); e.currentTarget.classList.add('is-drag'); };
  const move = (e) => {
    const s = st.current; if (!s.drag) return;
    const f = k(), dx = e.clientX - s.drag.x, dy = e.clientY - s.drag.y; s.drag = { x: e.clientX, y: e.clientY };
    s.vl = -dx * f; s.vp = dy * f; s.lon = normLon(s.lon + s.vl); s.lat = clampLat(s.lat + s.vp); s.idle = performance.now();
    if (reduced) paint();
  };
  const up = (e) => {
    const s = st.current; if (!s.drag) return;
    s.drag = null; e.currentTarget.classList.remove('is-drag');
    if (reduced || performance.now() - s.idle > 80) s.vl = s.vp = 0;     // no coasting after a pause
    s.idle = performance.now();
  };
  const stop = (e) => e.stopPropagation();       // a drag here never turns the page to another section
  return (
    <canvas ref={ref} role="img" aria-label="Globe centred on Evera’s home in Abu Dhabi. Drag to spin it."
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onTouchStart={stop} onTouchEnd={stop} />
  );
}

function CField({ id, label, Icon, type = 'text', area, req, err, auto, children, ...rest }) {
  const eid = `fc-${id}-err`;
  const p = { id: `fc-${id}`, name: id, placeholder: ' ', autoComplete: auto, 'aria-invalid': err ? 'true' : undefined, 'aria-describedby': err ? eid : undefined, 'aria-required': req || undefined, ...rest };
  return (
    <div className={`f-cf ${area ? 'f-cf--area' : ''} ${err ? 'is-err' : ''}`}>
      <div className="f-cf__box">
        <Icon className="f-cf__icon" aria-hidden="true" />
        {area ? <textarea rows="4" {...p} /> : <input type={type} {...p} />}
        <label htmlFor={`fc-${id}`}>{label}{req && ' *'}</label>
        {children}
      </div>
      {err && <em id={eid} className="f-cf__err" role="alert">{err}</em>}
    </div>
  );
}

function Contact({ on }) {
  const phone = usePhone();
  const { status, error, fields, submit } = useSubmit('/api/contact');
  const [count, setCount] = useState(0);
  const onSubmit = (e) => { e.preventDefault(); submit(Object.fromEntries(new FormData(e.currentTarget))); };
  const fieldErrors = Object.keys(fields).length > 0;

  const head = (
    <div className="f-ct__head">
      <Fade on={on} d={0.1} className="f-kicker" as="p">Contact us</Fade>
      <h2 className="f-big f-ct__title"><Rise on={on} d={0.15}>Let’s get <span className="f-grad">in touch</span></Rise></h2>
    </div>
  );
  const panel = (
    <Fade on={on} d={0.3} className="f-ct__panel">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'done' ? (
          <motion.div key="done" className="f-ct__done" role="status" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: E }}>
            <span className="f-ct__tick"><Check aria-hidden="true" /></span>
            <p className="f-ct__doneT">Message sent</p>
            <p>Thanks for reaching out. We’ll get back to you by email.</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate aria-label="Contact form" exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, ease: E }}>
            <div className="f-ct__ph"><h3>Send us a message</h3><p>We’ll get back to you by email.</p></div>
            <div className="f-ct__fields">
              <CField id="name" label="Full name" Icon={User} req auto="name" err={fields.name} />
              <CField id="email" label="Email address" Icon={Mail} type="email" req auto="email" err={fields.email} />
              <CField id="phone" label="Phone (optional)" Icon={Phone} type="tel" auto="tel" err={fields.phone} />
              <CField id="subject" label="Subject" Icon={FileText} err={fields.subject} />
              <CField id="message" label="Your message" Icon={MessageSquare} area req maxLength={1000} err={fields.message} onInput={(e) => setCount(e.currentTarget.value.length)}>
                <span className="f-cf__count" aria-hidden="true">{count}/1000</span>
              </CField>
            </div>
            <input type="text" name="website" tabIndex="-1" autoComplete="off" className="hp" aria-hidden="true" />
            {error && !fieldErrors && <p className="f-ct__err" role="alert">{error}</p>}
            <button className="f-ct__send" type="submit" disabled={status === 'sending'}>
              <span>{status === 'sending' ? 'Sending…' : 'Send message'}</span><ArrowUpRight aria-hidden="true" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </Fade>
  );
  const follow = <Fade on={on} d={0.45} className="f-ct__follow"><span>Follow Evera</span><Socials items={socials} className="f-socials" /></Fade>;
  const hq = (
    <Fade on={on} d={0.5} className="f-ct__hqrow">
      <div className="f-ct__hq">
        <p><i aria-hidden="true" />Evera HQ · {contact.address}</p>
        <a href={contact.phoneHref}><Phone aria-hidden="true" />{contact.phone}</a>
      </div>
    </Fade>
  );
  const globe = (<>
    <Fade on={on} d={0.2} className="f-ct__globe"><Globe on={on} /></Fade>
    <p className="f-ct__hint" aria-hidden="true">Drag to spin</p>
  </>);

  if (phone) return (
    <div className="f-ct is-m">
      <div className="f-bgimg" style={{ backgroundImage: `url(${bg})` }} /><div className="f-shade f-shade--deep" />
      <div className="f-ct__m">{head}{panel}{follow}{hq}{globe}</div>
    </div>
  );
  return (
    <div className="f-sec f-ct">
      <div className="f-bgimg" style={{ backgroundImage: `url(${bg})` }} /><div className="f-shade f-shade--deep" />
      <div className="f-ct__cols">
        <div className="f-ct__left">{globe}{hq}</div>
        <div className="f-ct__right">{head}{panel}{follow}</div>
      </div>
    </div>
  );
}

function Final({ on, onJoin }) {
  return (
    <div className="f-sec f-final">
      <Video />
      <div className="f-shade f-shade--final" />
      <div className="f-final__in">
        <h2 className="f-big f-big--l f-big--m"><Rise on={on} d={0.15}>Track your health</Rise><Rise on={on} d={0.22}>smarter with</Rise><Rise on={on} d={0.29}><span className="f-grad">Evera AI</span></Rise></h2>
        <Fade on={on} d={0.5} className="f-final__text" as="p">Stay empowered every day with data that works for you, helping you reach your healthiest, most confident self.</Fade>
        <Fade on={on} d={0.6}><button className="f-btn" onClick={onJoin}>Join the waitlist<ArrowUpRight /></button></Fade>
        <Fade on={on} d={0.7} className="f-final__logo"><img src={img['logo-wordmark']} alt="EVERA" /><p>Your AI Medical Assistant</p></Fade>
      </div>
      <Fade on={on} d={0.8} className="f-final__foot"><Socials items={socials} className="f-socials" /><p>© 2026 Evera AI · <a href="#privacy">Privacy policy</a> · <a href="#terms">Terms and conditions</a></p></Fade>
    </div>
  );
}

const SECTIONS = [['Home', EveraHero], ['How it works', Care], ['About', About], ['Face scan', Scan], ['Features', Features], ['Free analysis', Analysis], ['Testimonials', Voices], ['Pricing', Pricing], ['Contact', Contact], ['Join', Final]];

/* phones: a normal scrolling page; each section plays its entrance when it comes into view */
function MobileSection({ label, C, onJoin, go, ready }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.25 });
  return <section ref={ref} id={`m-${label}`} className="f-mslot" aria-label={label}><C on={seen && ready} go={go} onJoin={onJoin} register={() => {}} enteredFrom={-1} /></section>;
}

export default function App() {
  const [mobile, setMobile] = useState(() => matchMedia('(max-width: 860px)').matches);
  useEffect(() => { const m = matchMedia('(max-width: 860px)'); const f = () => setMobile(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  const [cur, setCur] = useState(0);
  const [modal, setModal] = useState(false);
  // false while the preloader in index.html covers the page; it fires "evera:loaded" when it hands over
  const [ready, setReady] = useState(() => !window.__evera?.loading);
  useEffect(() => {
    if (ready) return;
    const f = () => setReady(true);
    window.addEventListener('evera:loaded', f);
    if (!window.__evera?.loading) f();
    return () => window.removeEventListener('evera:loaded', f);
  }, [ready]);
  const busy = useRef(false);
  const stepper = useRef(null);                 // the active section's own scroll steps, if any
  const register = useCallback((fn) => { stepper.current = fn; }, []);
  const [entered, setEntered] = useState(1);   // direction we arrived from
  const curRef = useRef(0); curRef.current = cur;
  useEffect(() => { document.documentElement.classList.add('is-f', 'talk-dark'); }, []);

  // one gesture = one section, with a smooth push; nothing else scrolls
  const go = useCallback((i, fromGesture = false) => {
    if (busy.current) return;
    const d = Math.sign(i - curRef.current);
    // a gesture inside a section with its own steps moves those first
    if (fromGesture && stepper.current && d !== 0 && stepper.current(d)) { busy.current = true; setTimeout(() => { busy.current = false; }, 1000); return; }
    const n = Math.max(0, Math.min(SECTIONS.length - 1, i));
    if (n === curRef.current) return;
    busy.current = true; setEntered(n > curRef.current ? -1 : 1); setCur(n);
    setTimeout(() => { busy.current = false; }, 1150);
  }, []);
  useEffect(() => {
    if (modal || mobile || !ready) return;
    let acc = 0, last = 0;
    const onWheel = (e) => {
      e.preventDefault();
      const now = performance.now();
      if (now - last > 220) acc = 0;           // a new gesture
      last = now; acc += e.deltaY;
      if (Math.abs(acc) > 40) { go(curRef.current + (acc > 0 ? 1 : -1), true); acc = 0; }
    };
    let ty = null;
    const onTs = (e) => { ty = e.touches[0].clientY; };
    const onTe = (e) => { if (ty == null) return; const dy = ty - e.changedTouches[0].clientY; if (Math.abs(dy) > 50) go(curRef.current + (dy > 0 ? 1 : -1), true); ty = null; };
    const onKey = (e) => {
      if (e.target.closest('input,textarea')) return;
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(curRef.current + 1, true); }
      if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(curRef.current - 1, true); }
      if (e.key === 'Home') go(0); if (e.key === 'End') go(SECTIONS.length - 1);
    };
    addEventListener('wheel', onWheel, { passive: false });
    addEventListener('touchstart', onTs, { passive: true }); addEventListener('touchend', onTe, { passive: true });
    addEventListener('keydown', onKey);
    return () => { removeEventListener('wheel', onWheel); removeEventListener('touchstart', onTs); removeEventListener('touchend', onTe); removeEventListener('keydown', onKey); };
  }, [go, modal, mobile, ready]);
  useEffect(() => { document.documentElement.classList.toggle('is-f-m', mobile); }, [mobile]);

  const join = () => setModal(true);
  const hidden = ready ? undefined : '';          // nothing behind the preloader can be reached
  // phones scroll to a section; desktop slides to it
  const goTo = useCallback((i) => {
    if (!mobile) { go(i); return; }
    document.getElementById(`m-${SECTIONS[Math.max(0, Math.min(SECTIONS.length - 1, i))][0]}`)?.scrollIntoView({ behavior: 'smooth' });
  }, [mobile, go]);
  return (
    <MotionConfig reducedMotion="user">
      <EveraHeader cur={cur} go={goTo} onJoin={join} logo={img['logo-wordmark']} inert={!ready} />

      {mobile ? (
        <main className="f-mpage" id="main" inert={hidden}>
          {SECTIONS.map(([label, C]) => <MobileSection key={label} label={label} C={C} onJoin={join} ready={ready} go={(i) => document.getElementById(`m-${SECTIONS[Math.max(0, Math.min(SECTIONS.length - 1, i))][0]}`)?.scrollIntoView({ behavior: 'smooth' })} />)}
        </main>
      ) : (
      <main className="f-viewport" id="main" inert={hidden}>
        <motion.div className="f-track" animate={{ y: `${-cur * 100}vh` }} transition={{ duration: 1.05, ease: PUSH }}>
          {SECTIONS.map(([label, C], i) => (
            <section key={label} className="f-slot" aria-label={label} aria-hidden={i !== cur} inert={i !== cur ? '' : undefined}>
              <C on={ready && i === cur} go={go} onJoin={join} register={register} enteredFrom={entered} />
            </section>
          ))}
        </motion.div>
      </main>
      )}

      {/* left: progress; right: dots */}
      <div className="f-progress" aria-hidden="true"><span>{String(cur + 1).padStart(2, '0')}</span><i><motion.em animate={{ scaleY: (cur + 1) / SECTIONS.length }} transition={{ duration: 1, ease: PUSH }} /></i><span>{String(SECTIONS.length).padStart(2, '0')}</span></div>
      <nav className="f-dots" aria-label="Sections" inert={hidden}>{SECTIONS.map(([l], i) => <button key={l} onClick={() => go(i)} className={i === cur ? 'is-on' : ''} aria-label={l} aria-current={i === cur ? 'true' : undefined}><span>{l}</span></button>)}</nav>
      <AnimatePresence>{ready && cur < SECTIONS.length - 1 && <motion.button className="f-next" onClick={() => go(cur + 1, true)} aria-label="Next section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ArrowDown /></motion.button>}</AnimatePresence>

      {modal && <WaitlistModal onClose={() => setModal(false)} />}
    </MotionConfig>
  );
}
