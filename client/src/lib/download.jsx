import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import DownloadModal from '../components/DownloadModal.jsx';
import { appLinks } from '../data/landing.js';

/* One shared "Download the app" action for every former "join" button:
   iPhone / iPad / iPod (or an iPad that reports itself as a Mac with touch) -> the App Store;
   Android -> Google Play; everything else (desktop) -> the "Get the Evera app" modal. */
export function storeForDevice() {
  if (typeof navigator === 'undefined') return null;
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return null;
}

const DownloadCtx = createContext(() => {});
export const useDownload = () => useContext(DownloadCtx);

export function DownloadProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openDownload = useCallback(() => {
    const store = storeForDevice();
    if (store) { window.open(appLinks[store], '_blank', 'noopener,noreferrer'); return; }
    setOpen(true);
  }, []);
  const value = useMemo(() => openDownload, [openDownload]);
  return (
    <DownloadCtx.Provider value={value}>
      {children}
      {open && <DownloadModal onClose={() => setOpen(false)} />}
    </DownloadCtx.Provider>
  );
}
