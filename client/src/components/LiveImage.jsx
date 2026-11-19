import { createContext, useContext, useRef } from 'react';
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { img, manifest } from '../lib/assets.js';
import { ease } from '../lib/motion.js';

const Ctx = createContext(null);
const OFFSETS = { left: { x: -90 }, right: { x: 90 }, up: { y: -70 }, down: { y: 70 }, none: {} };

// True once the image has scrolled into view; pieces inside animate from this
export const useSeen = () => useContext(Ctx).seen;

// Wrap anything inside a LiveImage to give it mouse-depth: deeper = moves more
export function Depth({ depth = 1, className = '', style, children }) {
  const { mx, my } = useContext(Ctx);
  const x = useTransform(mx, (v) => v * depth * 7);
  const y = useTransform(my, (v) => v * depth * 7);
  return <motion.div className={className} style={{ ...style, x, y }}>{children}</motion.div>;
}

// A photo rebuilt from a clean background plus the UI cards cut out of it.
// layers: { name: { from, delay, float, depth } }   from: left | right | up | down | none
export default function LiveImage({ id, layers = {}, children, className = '', zoom = true }) {
  const m = manifest[id];
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.25 });
  const reduce = useReducedMotion();
  const mx = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const rx = useTransform(my, (v) => v * -3);
  const ry = useTransform(mx, (v) => v * 3);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], zoom ? [1.12, 1] : [1, 1]);
  const baseY = useTransform(scrollYProgress, [0, 1], zoom ? ['-3%', '3%'] : ['0%', '0%']);

  const move = (e) => {
    if (e.pointerType !== 'mouse' || reduce) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const leave = () => { mx.set(0); my.set(0); };

  return (
    <Ctx.Provider value={{ mx, my, seen }}>
      <motion.div
        ref={ref}
        className={`live ${className}`}
        style={{ aspectRatio: m.ratio, rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
        onPointerMove={move}
        onPointerLeave={leave}
      >
        {m.base && (
          <div className="live__base">
            <motion.img src={img[m.base]} alt="" style={{ scale, y: baseY }} draggable="false" />
          </div>
        )}
        {Object.entries(m.layers || {}).map(([name, box]) => {
          const cfg = { from: 'none', delay: 0, float: 6, depth: 1.5, ...(layers[name] || {}) };
          if (cfg.hidden) return null;
          return (
            <Depth key={name} depth={cfg.depth} className="live__layer" style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%` }}>
              <motion.div
                className="live__enter"
                initial={{ opacity: cfg.from === 'none' ? 1 : 0, ...OFFSETS[cfg.from] }}
                animate={seen ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ duration: 1.1, ease, delay: cfg.delay }}
              >
                <motion.img
                  src={img[`${id}-${name}`]}
                  alt=""
                  draggable="false"
                  className={cfg.lift ? 'is-lift' : ''}
                  animate={reduce ? {} : { y: [0, -cfg.float, 0] }}
                  transition={{ duration: 4 + (name.length % 3), repeat: Infinity, ease: 'easeInOut', delay: cfg.delay + 1.1 }}
                />
              </motion.div>
            </Depth>
          );
        })}
        {children}
      </motion.div>
    </Ctx.Provider>
  );
}
