import { motion, useReducedMotion } from 'framer-motion';
import { Camera, FileText, Pill, ScanLine, Lock, FlaskConical } from 'lucide-react';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import LiveImage, { Depth, useSeen } from './LiveImage.jsx';
import { Counter } from './ui.jsx';
import { ease, inView } from '../lib/motion.js';

const pop = (seen, delay, from = {}) => ({ initial: { opacity: 0, scale: 0.9, ...from }, animate: seen ? { opacity: 1, scale: 1, x: 0, y: 0 } : {}, transition: { duration: 1, ease, delay } });
// "whileInView" for pieces inside a LiveImage, driven by the image itself
const show = (seen, from, to, transition) => ({ initial: from, animate: seen ? to : {}, transition });

export function BloodArt() {
  const reduce = useReducedMotion();
  return (
    <LiveImage id="blood" layers={{
      logo: { from: 'up', delay: 0.4, depth: 3, float: 6 }, chartTile: { from: 'up', delay: 0.55, depth: 3, float: 8 },
      plus: { from: 'right', delay: 0.7, depth: 2.5, float: 7 }, wave: { from: 'left', delay: 0.6, depth: 2.5, float: 6 },
      bigChart: { from: 'down', delay: 0.75, depth: 2, float: 5 }, result: { from: 'right', delay: 0.95, depth: 3.5, float: 8 },
    }}>
      {!reduce && (
        <>
          <span className="pulse" style={{ left: '51.3%', top: '50.8%' }} aria-hidden="true"><i /><i /><i /></span>
          {[31, 71].map((x) => (
            <span key={x} className="chev" style={{ left: `${x}%`, top: '52.3%' }} aria-hidden="true">
              {[0, 1, 2].map((k) => <motion.i key={k} animate={{ opacity: [0.15, 1, 0.15], x: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity, delay: k * 0.18 }} />)}
            </span>
          ))}
        </>
      )}
    </LiveImage>
  );
}

export function BodyArt() {
  return <LiveImage id="body" layers={{ muscle: { depth: 3, float: 7 }, fat: { depth: 2.5, float: 9 }, list: { depth: 2, float: 6 } }} />;
}

export function SkinArt() {
  const reduce = useReducedMotion();
  const chip = (d) => ({ depth: 2 + d, float: 5 });
  return (
    <LiveImage id="skin" layers={{ dark: chip(0.5), moist: chip(1), wrinkle: chip(0.8), acne: chip(1.2), texture: chip(0.6) }}>
      {!reduce && <motion.span className="skin__sweep" aria-hidden="true" animate={{ top: ['-10%', '105%'] }} transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }} />}
      <Depth depth={3.5} className="skin__card-wrap" style={{ left: '64.3%', top: '13.2%', width: '31%', height: '23%' }}>
        <SkinCard />
      </Depth>
    </LiveImage>
  );
}

function SkinCard() {
  const seen = useSeen();
  return (
        <motion.div className="skin__card" {...pop(seen, 0.6, { x: 60 })}>
          <div>
            <p className="skin__label">Latest Skin Analysis</p>
            <p className="skin__score"><Counter to={95} delay={1} /><small>/100</small></p>
            <p className="skin__meta">combination • Skin Age: 22</p>
          </div>
          <span className="skin__cam"><Camera aria-hidden="true" /></span>
        </motion.div>
  );
}

export function MealArt() {
  const macros = [['Protein', 40, 103, '#3b82f6'], ['Carbs', 57.7, 185, '#f59e0b'], ['Fats', 16, 43, '#a855f7']];
  const tiles = [['40g', 'Protein', '#e8f0ff'], ['57.7g', 'Carbs', '#fff4e0'], ['16g', 'Fats', '#f4ecff'], ['1.3g', 'Fiber', '#e6f8ee'], ['6.5g', 'Sugar', '#fdecef'], ['4.3g', 'Sat. Fat', '#fff4e0']];
  return <LiveImage id="meal" className="meal"><MealCards macros={macros} tiles={tiles} /></LiveImage>;
}

function MealCards({ macros, tiles }) {
  const seen = useSeen();
  return (
    <>
      <Depth depth={3} className="mc" style={{ left: '7.7%', top: '17.7%', width: '26.1%' }}>
        <motion.div className="mc__card" {...pop(seen, 0.3, { x: -50 })}>
          <p className="mc__h">Daily Progress</p>
          <div className="mc__ring">
            <svg viewBox="0 0 60 60" aria-hidden="true">
              <circle cx="30" cy="30" r="24" className="mc__ring-bg" />
              <motion.circle cx="30" cy="30" r="24" className="mc__ring-fg" {...show(seen, { pathLength: 0 }, { pathLength: 0.36 }, { duration: 1.6, ease, delay: 0.8 })} />
            </svg>
            <span><b><Counter to={36} delay={0.8} suffix="%" /></b><small>of 1534 kcal</small></span>
          </div>
          {macros.map(([n, v, max, c], i) => (
            <div key={n} className="mc__macro">
              <span>{n}</span><span>{v}g / {max}g</span>
              <i><motion.b style={{ background: c }} {...show(seen, { scaleX: 0 }, { scaleX: v / max }, { duration: 1.2, ease, delay: 1 + i * 0.12 })} /></i>
            </div>
          ))}
        </motion.div>
      </Depth>
      <Depth depth={2.5} className="mc" style={{ left: '62.8%', top: '17.7%', width: '25%' }}>
        <motion.div className="mc__card mc__row" {...pop(seen, 0.45, { y: -30 })}>
          <div><small>BMR</small><b><Counter to={1278} delay={0.9} /> kcal</b></div>
          <div><small>TDEE</small><b><Counter to={1534} delay={1} /> kcal</b></div>
          <div className="mc__target"><small>Daily Target</small><b><Counter to={1534} delay={1.1} /> kcal</b></div>
        </motion.div>
      </Depth>
      <Depth depth={3.5} className="mc" style={{ left: '69.1%', top: '37%', width: '25.7%' }}>
        <motion.div className="mc__card" {...pop(seen, 0.6, { x: 50 })}>
          <p className="mc__h">Nutrition Summary</p>
          <p className="mc__total"><Counter to={547} delay={1} /><small>Total calories</small></p>
          <div className="mc__tiles">
            {tiles.map(([v, n, bg], i) => (
              <motion.span key={n} style={{ background: bg }} {...show(seen, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1 }, { duration: 0.5, ease, delay: 1.2 + i * 0.07 })}><b>{v}</b>{n}</motion.span>
            ))}
          </div>
        </motion.div>
      </Depth>
      <Depth depth={2} className="mc" style={{ left: '7.7%', top: '73.2%', width: '25%' }}>
        <motion.div className="mc__card mc__prim" {...pop(seen, 0.75, { y: 30 })}>
          <span style={{ color: '#3b82f6' }}><b>103g</b>Protein</span>
          <span style={{ color: '#f59e0b' }}><b>185g</b>Carbs</span>
          <span style={{ color: '#a855f7' }}><b>43g</b>Fats</span>
        </motion.div>
      </Depth>
    </>
  );
}

export function WalletArt() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const docs = [
    { icon: FlaskConical, t: 'Blood test', s: '4 Nov 2025', c: '#9259FF', r: -10, x: -38 },
    { icon: Pill, t: 'Prescription', s: '3 active', c: '#16a34a', r: 0, x: 0 },
    { icon: ScanLine, t: 'MRI scan', s: '12 Oct 2025', c: '#0ea5e9', r: 10, x: 38 },
  ];
  return (
    <div className="wallet" aria-hidden="true" ref={ref}>
      <div className="wallet__glow" />
      {docs.map((d, i) => (
        <motion.div key={d.t} className="wallet__doc" style={{ zIndex: i === 1 ? 3 : 2 }}
          initial={{ opacity: 0, y: 60, rotate: 0, x: '0%' }} animate={seen ? { opacity: 1, y: i === 1 ? -6 : 10, rotate: d.r, x: `${d.x}%` } : {}}
          transition={{ duration: 1.1, ease, delay: 0.3 + i * 0.12 }}>
          <motion.div animate={reduce ? {} : { y: [0, -6, 0] }} transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}>
            <span className="wallet__ic" style={{ background: d.c }}><d.icon /></span>
            <b>{d.t}</b><small>{d.s}</small>
            <i /><i /><i className="short" />
          </motion.div>
        </motion.div>
      ))}
      <motion.span className="wallet__lock" initial={{ scale: 0 }} animate={seen ? { scale: 1 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 1 }}><Lock /> Encrypted</motion.span>
      <motion.span className="wallet__file" animate={reduce ? {} : { y: [-20, 40], opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 0.8] }} transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}><FileText /></motion.span>
    </div>
  );
}

export function NutritionArt() {
  return <LiveImage id="nutrition" layers={{ tracker: { depth: 3, float: 7 }, stats: { depth: 2.5, float: 8 } }} />;
}

export function OverviewArt() {
  const reduce = useReducedMotion();
  return (
    <LiveImage id="overview" layers={{ cut: { from: 'left', delay: 0.3, depth: 2.5, float: 7 }, ideal: { from: 'up', delay: 0.55, depth: 3.5, float: 9 }, stats: { from: 'down', delay: 0.8, depth: 2, float: 5 } }}>
      <Arrows reduce={reduce} />
    </LiveImage>
  );
}

function Arrows({ reduce }) {
  const seen = useSeen();
  return (
      <svg className="ov__arrows" viewBox="0 0 2048 1234" aria-hidden="true">
        <defs>
          <linearGradient id="arrowg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#BCACFF" /><stop offset="1" stopColor="#ec4899" /></linearGradient>
          <marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#ec4899" /></marker>
        </defs>
        {['M 330 660 C 240 720, 250 810, 330 870', 'M 870 820 C 960 760, 950 650, 870 600'].map((d, i) => (
          <motion.path key={i} d={d} stroke="url(#arrowg)" strokeWidth="16" fill="none" strokeLinecap="round" markerEnd="url(#ah)"
            {...show(seen, { pathLength: 0, opacity: 0 }, { pathLength: 1, opacity: 1 }, null)}
            transition={reduce ? { duration: 0 } : { duration: 1.2, ease, delay: 1.1 + i * 0.4, repeat: Infinity, repeatDelay: 2.4, repeatType: 'loop' }} />
        ))}
      </svg>
  );
}
