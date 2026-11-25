import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import App from './site/App.jsx';
import { legalPage } from './legal/route.js';
import './styles/landing.css';
import './styles/v5.css';
import './legal/legal.css';

// /privacy-policy and /terms-and-conditions are their own pages (loaded on demand); every other address is the site
const page = legalPage();
const Legal = page ? lazy(() => import('./legal/Legal.jsx')) : null;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {page ? <Suspense fallback={null}><Legal page={page} /></Suspense> : <App />}
  </React.StrictMode>
);
