import { siApple, siGoogleplay } from 'simple-icons';
import { appLinks } from '../data/landing.js';

/* "Download on the App Store" / "Get it on Google Play": black store buttons with the store's logo.
   Used in the download modal, the full-screen menu and the footer. size: 'md' (48px) or 'sm' (40px). */
export const STORES = [
  { key: 'ios', href: appLinks.ios, top: 'Download on the', name: 'App Store', icon: siApple, label: 'Download Evera AI on the App Store' },
  { key: 'android', href: appLinks.android, top: 'GET IT ON', name: 'Google Play', icon: siGoogleplay, label: 'Get Evera AI on Google Play' },
];

export function StoreButton({ store, size = 'md' }) {
  return (
    <a className={`store-btn store-btn--${size}`} href={store.href} target="_blank" rel="noopener noreferrer" aria-label={`${store.label} (opens in a new tab)`}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={store.icon.path} /></svg>
      <span><small>{store.top}</small><b>{store.name}</b></span>
    </a>
  );
}

export default function StoreButtons({ size = 'md', className = '' }) {
  return (
    <div className={`store-btns ${className}`}>
      {STORES.map((s) => <StoreButton key={s.key} store={s} size={size} />)}
    </div>
  );
}
