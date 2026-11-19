import { motion } from 'framer-motion';
import { ease } from '../lib/motion.js';

// Success state with a check that draws itself
export default function Done({ title, text, children }) {
  return (
    <div className="done" role="status">
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <motion.circle cx="32" cy="32" r="28" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease }} />
        <motion.path d="M20 33 L29 42 L45 24" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease, delay: 0.55 }} />
      </svg>
      <h3>{title}</h3>
      <p>{text}</p>
      {children}
    </div>
  );
}
