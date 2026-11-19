import { motion, useReducedMotion } from 'framer-motion';
import { FileText, Check } from 'lucide-react';
import LiveImage, { Depth } from './LiveImage.jsx';

const T = 5.2; // one upload loop, in seconds
const loop = (times, values, extra = {}) => ({ duration: T, times, repeat: Infinity, ease: 'easeInOut', ...extra });

// Step 1: a cursor walks to "Upload", clicks, and a report uploads
export default function LiveUpload() {
  const reduce = useReducedMotion();
  return (
    <LiveImage id="upload" zoom={false} layers={{
      tilePhone: { from: 'left', delay: 0.2, float: 8, depth: 3 },
      tileDoc: { from: 'left', delay: 0.35, float: 10, depth: 2.5 },
      tileImage: { from: 'right', delay: 0.3, float: 9, depth: 3 },
      tileBrain: { from: 'up', delay: 0.45, float: 7, depth: 2 },
    }}>
      {!reduce && (
        <>
          {/* file row filling the drop zone */}
          <motion.div className="up__file" style={{ left: '22.5%', top: '40%', width: '52.5%' }}
            animate={{ opacity: [0, 0, 1, 1, 0], y: [8, 8, 0, 0, 0] }} transition={loop([0, 0.46, 0.52, 0.94, 1])}>
            <FileText aria-hidden="true" />
            <div className="up__meta">
              <span>blood-test.pdf</span>
              <div className="up__bar"><motion.i animate={{ scaleX: [0, 0, 0, 1, 1] }} transition={loop([0, 0.46, 0.52, 0.82, 1])} /></div>
            </div>
            <motion.b className="up__ok" animate={{ scale: [0, 0, 0, 1.25, 1, 1], opacity: [0, 0, 0, 1, 1, 0] }} transition={loop([0, 0.8, 0.83, 0.87, 0.9, 1])}><Check /></motion.b>
          </motion.div>
          {/* button press */}
          <motion.div className="up__press" style={{ left: '20.05%', top: '65.2%', width: '57.8%', height: '10.2%' }}
            animate={{ opacity: [0, 0, 0.45, 0], scale: [1, 1, 0.97, 1] }} transition={loop([0, 0.4, 0.44, 0.56])} />
          {/* cursor */}
          <Depth depth={1} className="up__cursor-wrap">
            <motion.svg className="up__cursor" viewBox="0 0 24 24" aria-hidden="true"
              animate={{ left: ['86%', '86%', '50%', '50%', '50%', '86%'], top: ['92%', '92%', '68%', '68%', '68%', '92%'], scale: [1, 1, 1, 0.8, 1, 1] }}
              transition={loop([0, 0.1, 0.38, 0.43, 0.5, 1])}>
              <path d="M4 2 L20 12 L12.5 13.5 L9 21 Z" fill="#0E0E25" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
            </motion.svg>
          </Depth>
        </>
      )}
    </LiveImage>
  );
}
