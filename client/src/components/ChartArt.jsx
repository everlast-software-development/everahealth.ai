import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { img } from '../lib/assets.js';
import { ease } from '../lib/motion.js';

export default function ChartArt() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div className="chartart" ref={ref}>
      <div className="chartart__axis" aria-hidden="true">{[100, 75, 50, 25, 0].map((v) => <span key={v}>{v}</span>)}</div>
      <motion.img src={img.chart} alt="" initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={seen ? { clipPath: 'inset(0 0% 0 0)' } : {}} transition={{ duration: 1.6, ease, delay: 0.2 }} />
      {!reduce && <motion.span className="chartart__scan" animate={{ left: ['8%', '96%'] }} transition={{ duration: 3.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 1.8 }} />}
      <motion.span className="chartart__tip" initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={seen ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.6, ease, delay: 1.6 }}>+18% this quarter</motion.span>
    </div>
  );
}
