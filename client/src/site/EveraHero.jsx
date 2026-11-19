import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Volume2, Square } from 'lucide-react';
import videoMp4 from '../assets/video/evera-hero.mp4';
import videoWebm from '../assets/video/evera-hero.webm';
import poster from '../assets/video/evera-hero-poster.jpg';
import { img } from '../lib/assets.js';
import './hero.css';

/* Evera hero.
   Intro (once per page load): the preloader hands over its helix dots; they fly into Evera's portrait,
   sampled from the video poster (= frame 0) with the video's own cover maths, so every dot lands on the
   pixel it stands for. A wave then grows from her face, the dots fade and the paused video shows through
   a CSS mask. Only then does the video start. No mouse effects. */

const E = [0.22, 1, 0.36, 1];
const FACE = [0.495, 0.315];                 // Evera's face in the poster, as fractions of 1920 × 1080
const FLIGHT = 1.5, HOLD = 0.35, REVEAL = 1.15, BAND = 90;
const STEPS = 6;                             // colour steps from brand colour to the real colour
let introPlayed = false;                     // once per page load

const TEXTS = {
  hello: 'Hi, I’m Evera 👋 Send me a lab report, a selfie or a photo of your meal, and I’ll tell you what it means for your health.',
  can: 'I read your lab results, skin, body and meals, explain them in plain words, and tell you exactly what to do next.',
  safe: 'Yes. Your records are encrypted, and you decide what to upload. You can delete everything at any time.',
};
const QUESTIONS = { can: 'What can you do?', safe: 'Is my data safe?' };

const isPhoneNow = () => typeof window !== 'undefined' && matchMedia('(max-width: 860px)').matches;
function usePhone() {
  const [m, setM] = useState(isPhoneNow);
  useEffect(() => { const q = matchMedia('(max-width: 860px)'); const f = () => setM(q.matches); q.addEventListener('change', f); return () => q.removeEventListener('change', f); }, []);
  return m;
}

const Rise = ({ on, d = 0, children }) => (
  <span className="f-mask"><motion.span initial={false} animate={on ? { y: '0%', opacity: 1 } : { y: '105%', opacity: 0 }} transition={{ duration: on ? 0.9 : 0.3, ease: E, delay: on ? d : 0 }}>{children}</motion.span></span>
);
const Fade = ({ on, d = 0, children, className = '', as = 'div', ...rest }) => {
  const C = motion[as];
  return <C className={className} initial={false} animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ duration: on ? 0.8 : 0.25, ease: E, delay: on ? d : 0 }} {...rest}>{children}</C>;
};

/* start a muted inline video even where browsers are strict about it */
function startVideo(v) {
  if (!v) return () => {};
  v.muted = true; v.defaultMuted = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
  const KICK = ['pointerdown', 'keydown', 'touchstart', 'wheel'];
  let playing = false, retry;
  const stop = () => {
    playing = true; clearTimeout(retry);
    v.removeEventListener('canplay', go); document.removeEventListener('visibilitychange', go);
    KICK.forEach((t) => window.removeEventListener(t, go, true));
  };
  function go() {
    if (playing) return;
    const p = v.play();
    if (p && p.then) p.then(stop, () => {}); else stop();
  }
  v.addEventListener('canplay', go); document.addEventListener('visibilitychange', go);
  KICK.forEach((t) => window.addEventListener(t, go, { capture: true, passive: true }));
  go();
  retry = setTimeout(go, 1500);
  return stop;
}

/* sample the poster with the same cover maths as the <video> (object-fit: cover + object-position) */
function samplePoster(img, W, H, pos, cap) {
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const sc = Math.max(W / iw, H / ih), dw = iw * sc, dh = ih * sc;
  const ox = (W - dw) * pos[0], oy = (H - dh) * pos[1];
  const c = document.createElement('canvas'); c.width = iw; c.height = ih;
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0);
  const data = g.getImageData(0, 0, iw, ih).data;
  let gap = Math.max(5, W / 280), out = [];
  for (let tries = 0; tries < 10; tries++) {
    out = [];
    for (let y = gap / 2; y < H; y += gap) {
      const iy = Math.floor((y - oy) / sc); if (iy < 0 || iy >= ih) continue;
      for (let x = gap / 2; x < W; x += gap) {
        const ix = Math.floor((x - ox) / sc); if (ix < 0 || ix >= iw) continue;
        const k = (iy * iw + ix) * 4, r = data[k], gg = data[k + 1], b = data[k + 2];
        const lum = 0.2126 * r + 0.7152 * gg + 0.0722 * b;
        if (lum < 20) continue;                                   // dark background: no dot
        out.push(x, y, r, gg, b, lum < 70 ? 0.25 + (0.75 * (lum - 20)) / 50 : 1);   // dim pixels: low alpha
      }
    }
    if (out.length / 6 <= cap) break;
    gap *= 1.12;                                                 // too many dots: widen the grid
  }
  return { pts: out, gap, face: [ox + FACE[0] * dw, oy + FACE[1] * dh] };
}
const parsePos = (s) => { const m = String(s || '').match(/([\d.]+)%\s+([\d.]+)%/); return m ? [+m[1] / 100, +m[2] / 100] : [0.5, 0.5]; };
const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

function useChat(active) {
  const [key, setKey] = useState('hello');
  const [phase, setPhase] = useState('idle');     // idle → think → type → done
  const [shown, setShown] = useState('');
  const first = useRef(true);
  useEffect(() => {
    if (!active) return;
    setPhase('think'); setShown('');
    const t = setTimeout(() => setPhase('type'), 900 + (first.current ? 500 : 0));
    first.current = false;
    return () => clearTimeout(t);
  }, [key, active]);
  useEffect(() => {
    if (phase !== 'type') return;
    const chars = Array.from(TEXTS[key]);           // whole characters, so the emoji never splits
    let n = 0;
    const iv = setInterval(() => { n += 2; setShown(chars.slice(0, n).join('')); if (n >= chars.length) { clearInterval(iv); setPhase('done'); } }, 26);
    return () => clearInterval(iv);
  }, [phase, key]);
  return { key, ask: setKey, phase, shown };
}

function useSpeech(text) {
  const ok = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => () => { if (ok) speechSynthesis.cancel(); }, [ok]);
  useEffect(() => { if (ok) { speechSynthesis.cancel(); setSpeaking(false); } }, [text, ok]);
  const toggle = () => {
    if (!ok) return;
    if (speaking) { speechSynthesis.cancel(); setSpeaking(false); return; }
    const u = new SpeechSynthesisUtterance(text.replace(/\p{Extended_Pictographic}/gu, ''));
    u.onend = u.onerror = () => setSpeaking(false);
    speechSynthesis.speak(u); setSpeaking(true);
  };
  return { ok, speaking, toggle };
}

export default function EveraHero({ on, onJoin, go }) {
  const phone = usePhone();
  const reduced = useReducedMotion();
  const stageRef = useRef(null), videoRef = useRef(null), canvasRef = useRef(null), rootRef = useRef(null);
  const [mode, setMode] = useState(() => (introPlayed || reduced ? 'live' : 'wait'));   // wait → fly → reveal → live
  const [entered, setEntered] = useState(() => introPlayed || !!reduced);
  const show = on && entered;
  const chat = useChat(show);
  const speech = useSpeech(TEXTS[chat.key]);

  // the intro: prepare particles, then wait for the preloader's handoff
  useEffect(() => {
    const ev = window.__evera || {};
    const video = videoRef.current;
    let stopVideo = () => {}, raf = 0, safety = 0, enterT = 0, finished = false;
    const goLive = () => {
      if (finished) return; finished = true; introPlayed = true;
      cancelAnimationFrame(raf); clearTimeout(safety);
      const c = canvasRef.current; if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
      setMode('live'); setEntered(true);
      if (!reduced) stopVideo = startVideo(video);
    };
    if (introPlayed || reduced || !ev.loading) {
      ev.heroReady?.(); goLive();
      return () => stopVideo();
    }
    // (introPlayed is set when the intro starts or finishes, not here: React's dev StrictMode
    //  mounts every component twice, and the intro must survive that)

    const img = new Image(); img.decoding = 'async'; img.src = poster;
    let cancelled = false;
    img.decode().then(() => {
      if (cancelled) return;
      if (!window.__evera?.loading) { goLive(); return; }           // the preloader already gave up waiting
      const stage = stageRef.current, rect = stage.getBoundingClientRect(), W = rect.width, H = rect.height;
      const S = samplePoster(img, W, H, parsePos(getComputedStyle(video).objectPosition), isPhoneNow() ? 6500 : 15000);
      ev.handoff = (from) => start(from, S, W, H);
      ev.heroReady?.();
    }).catch(() => { ev.heroReady?.(); goLive(); });

    function start(from, S, W, H) {
      if (cancelled) return;
      introPlayed = true;
      const c = canvasRef.current, rect = stageRef.current.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      const ctx = c.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = S.pts.length / 6, src = from.length ? from : [{ x: rect.left + W / 2, y: rect.top + H * 0.44, r: 188, g: 172, b: 255, a: 1, s: 2 }];
      const [fx, fy] = S.face;
      const sx = new Float32Array(n), sy = new Float32Array(n), tx = new Float32Array(n), ty = new Float32Array(n);
      const cx = new Float32Array(n), cy = new Float32Array(n), dl = new Float32Array(n), dist = new Float32Array(n), ss = new Float32Array(n);
      const cols = new Array(n), glow = [];
      const dot = Math.max(1.4, S.gap * 0.5);
      let maxD = 1;
      for (let i = 0; i < n; i++) { const dx = S.pts[i * 6] - fx, dy = S.pts[i * 6 + 1] - fy; dist[i] = Math.hypot(dx, dy); if (dist[i] > maxD) maxD = dist[i]; }
      for (let i = 0; i < n; i++) {
        const q = src[i % src.length];
        sx[i] = q.x - rect.left + (Math.random() - 0.5) * 10; sy[i] = q.y - rect.top + (Math.random() - 0.5) * 10; ss[i] = q.s || 2;
        tx[i] = S.pts[i * 6]; ty[i] = S.pts[i * 6 + 1];
        const mx = (sx[i] + tx[i]) / 2, my = (sy[i] + ty[i]) / 2, len = Math.hypot(tx[i] - sx[i], ty[i] - sy[i]), bend = (Math.random() - 0.5) * 0.7 * len;
        const nx = -(ty[i] - sy[i]) / (len || 1), ny = (tx[i] - sx[i]) / (len || 1);
        cx[i] = mx + nx * bend; cy[i] = my + ny * bend;
        dl[i] = (dist[i] / maxD) * 0.45;                         // dots near her face arrive first
        const r = S.pts[i * 6 + 2], g = S.pts[i * 6 + 3], b = S.pts[i * 6 + 4], a = S.pts[i * 6 + 5];
        cols[i] = Array.from({ length: STEPS + 1 }, (_, k) => { const f = k / STEPS; return `rgba(${(q.r + (r - q.r) * f) | 0},${(q.g + (g - q.g) * f) | 0},${(q.b + (b - q.b) * f) | 0},${((q.a ?? 1) + (a - (q.a ?? 1)) * f).toFixed(3)})`; });
      }
      for (let k = 0; k <= STEPS; k++) glow.push(`rgba(242,255,214,${(0.9 * (1 - k / STEPS)).toFixed(3)})`);
      const maxR = Math.max(Math.hypot(fx, fy), Math.hypot(W - fx, fy), Math.hypot(fx, H - fy), Math.hypot(W - fx, H - fy)) + BAND;
      video.style.setProperty('--fx', `${fx}px`); video.style.setProperty('--fy', `${fy}px`); video.style.setProperty('--band', `${BAND}px`); video.style.setProperty('--rv', '0px');
      setMode('fly');
      enterT = setTimeout(() => setEntered(true), FLIGHT * 0.55 * 1000);
      safety = setTimeout(goLive, (FLIGHT + HOLD + REVEAL) * 1000 + 2500);   // background tab: finish anyway
      const t0 = performance.now(), DUR = FLIGHT - 0.45;
      let revealing = false;
      const frame = (now) => {
        const t = (now - t0) / 1000;
        ctx.clearRect(0, 0, W, H);
        if (t < FLIGHT + HOLD) {
          for (let i = 0; i < n; i++) {
            const k = Math.min(1, Math.max(0, (t - dl[i]) / DUR)), e = ease(k), u = 1 - e;
            const x = u * u * sx[i] + 2 * u * e * cx[i] + e * e * tx[i], y = u * u * sy[i] + 2 * u * e * cy[i] + e * e * ty[i];
            const s = ss[i] + (dot - ss[i]) * e;
            ctx.fillStyle = cols[i][Math.round(e * STEPS)]; ctx.fillRect(x - s / 2, y - s / 2, s, s);
          }
        } else {
          if (!revealing) { revealing = true; setMode('reveal'); }
          const rk = Math.min(1, (t - FLIGHT - HOLD) / REVEAL), R = ease(rk) * maxR;
          video.style.setProperty('--rv', `${R.toFixed(1)}px`);
          for (let i = 0; i < n; i++) {
            const d = dist[i];
            if (d < R - BAND) continue;                           // inside the wave: the video shows here
            if (d < R) { const k = (R - d) / BAND; ctx.fillStyle = glow[Math.min(STEPS, Math.round(k * STEPS))]; ctx.fillRect(tx[i] - dot / 2, ty[i] - dot / 2, dot * 1.2, dot * 1.2); }
            else { ctx.fillStyle = cols[i][STEPS]; ctx.fillRect(tx[i] - dot / 2, ty[i] - dot / 2, dot, dot); }
          }
          if (rk >= 1) { goLive(); return; }
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    }
    return () => { cancelled = true; cancelAnimationFrame(raf); clearTimeout(safety); clearTimeout(enterT); stopVideo(); if (window.__evera?.handoff) window.__evera.handoff = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const others = Object.keys(QUESTIONS).filter((k) => k !== chat.key);
  const talking = chat.phase === 'think' || chat.phase === 'type' || speech.speaking;

  return (
    <div ref={rootRef} className={`f-sec h-pa ev-hero ${phone ? 'is-m' : ''} is-${mode}`}>
      <div className="ev-hero__stage" ref={stageRef}>
        <video ref={videoRef} className="ev-hero__video" poster={poster} muted playsInline loop preload="auto" aria-hidden="true">
          <source src={videoMp4} type="video/mp4" /><source src={videoWebm} type="video/webm" />
        </video>
        <canvas ref={canvasRef} className="ev-hero__canvas" aria-hidden="true" />
      </div>
      <div className="h-pa__shade" />

      <div className="h-pa__head ev-head">
        <div className={`ev-hi ${show ? 'is-in' : ''}`}>
          <span className="ev-hi__dna" aria-hidden="true"><img src={img['logo-dna-white']} alt="" /></span>
          <span className="ev-hi__t">
            <span className="ev-hi__w"><em>Welcome to</em></span>{' '}
            <span className="ev-hi__w"><b>Evera AI</b></span>
          </span>
        </div>
        <h1 className="h-pa__title ev-title">
          <Rise on={show} d={0.12}>The missing</Rise>
          <Rise on={show} d={0.2}><span className="ev-grad">Link in personal</span></Rise>
          <Rise on={show} d={0.28}><span className="ev-grad">Health</span></Rise>
        </h1>
        <Fade on={show} d={0.4} className="ev-lede" as="p">Track your health smarter with clear, personalised insights that guide your best decisions.</Fade>
        <Fade on={show} d={0.5}><button className="ev-btn" onClick={onJoin}>Join our waiting list<ArrowUpRight aria-hidden="true" /></button></Fade>
      </div>

      <motion.aside className="h-pa__dock ev-dock" aria-label="Talk to Evera" initial={false}
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.8, ease: E, delay: show ? 0.7 : 0 }}>
        <div className="h-pa__card">
          <p className="h-pa__who">
            <i aria-hidden="true" />Evera<span>AI medical assistant</span>
            <span className={`f-ec__wave ${talking ? 'is-on' : ''}`} aria-hidden="true"><i /><i /><i /><i /><i /></span>
            {speech.ok && (
              <button className={`h-listen ${speech.speaking ? 'is-on' : ''}`} onClick={speech.toggle} disabled={chat.phase !== 'done'}
                aria-label={speech.speaking ? 'Stop reading' : 'Read the answer aloud'}>
                {speech.speaking ? <Square aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
              </button>
            )}
          </p>
          <AnimatePresence mode="wait" initial={false}>
            {chat.key !== 'hello' && (
              <motion.p key={chat.key} className="h-pa__q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>{QUESTIONS[chat.key]}</motion.p>
            )}
          </AnimatePresence>
          <p className="h-pa__text" aria-live="polite">
            {chat.phase === 'think' || chat.phase === 'idle'
              ? <span className="h-think" aria-label="Evera is typing"><i /><i /><i /></span>
              : <>{chat.shown}{chat.phase === 'type' && <span className="h-caret" aria-hidden="true" />}</>}
          </p>
        </div>
        <div className="h-pa__chips">
          {chat.phase === 'done' && [
            ...others.map((k) => ({ k, label: QUESTIONS[k], act: () => chat.ask(k) })),
            { k: 'scan', label: 'See the face scan', act: () => go?.(3) },
          ].map((c, i) => (
            <motion.button key={`${chat.key}-${c.k}`} className="h-pa__chip" onClick={c.act}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: E, delay: i * 0.06 }}>{c.label}</motion.button>
          ))}
        </div>
      </motion.aside>
    </div>
  );
}
