import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import QRCode from 'qrcode';
import { img } from '../lib/assets.js';
import { STORES, StoreButton } from './StoreButtons.jsx';

/* "Get the Evera app" (desktop): the two store buttons, each with a QR code of its store link.
   A native <dialog>: modal, focus kept inside, Escape and outside click close it, focus returns to the opener. */
function QR({ url }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    let live = true;
    QRCode.toString(url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#0e0e25', light: '#ffffff' } })
      .then((s) => { if (live) setSvg(s); }).catch(() => {});
    return () => { live = false; };
  }, [url]);
  // the svg comes from the qrcode library, built from our own fixed store link
  return <span className="dl-qr__code" role="img" aria-label={`QR code for ${url}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default function DownloadModal({ onClose }) {
  const ref = useRef(null);
  const opener = useRef(typeof document !== 'undefined' ? document.activeElement : null);
  useEffect(() => {
    ref.current.showModal();
    const back = opener.current;
    return () => { if (back && typeof back.focus === 'function') back.focus({ preventScroll: true }); };
  }, []);
  const close = () => ref.current.close();

  return (
    <dialog ref={ref} className="modal dl-modal" aria-modal="true" aria-labelledby="dl-title" aria-describedby="dl-text"
      onClose={onClose} onClick={(e) => e.target === ref.current && close()}>
      <div className="modal__in">
        <button className="modal__x" onClick={close} aria-label="Close"><X /></button>
        <img className="dl-modal__mark" src={img['logo-dna-white']} alt="" aria-hidden="true" />
        <h2 id="dl-title" className="modal__title">Get the Evera app</h2>
        <p id="dl-text" className="modal__text">Available on iPhone and Android.</p>
        <div className="dl-grid">
          {STORES.map((s) => (
            <div key={s.key} className="dl-col">
              <StoreButton store={s} />
              <div className="dl-qr"><QR url={s.href} /><span>Scan with your phone</span></div>
            </div>
          ))}
        </div>
      </div>
    </dialog>
  );
}
