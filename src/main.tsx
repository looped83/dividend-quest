import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

function showFatalError(message: string) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:32px;text-align:center;font-family:system-ui,sans-serif;color:#f8fafc;background:#0f172a;">
        <h1 style="color:#ef4444;font-size:1.5rem;margin-bottom:12px;">Fehler beim Starten</h1>
        <p style="color:#94a3b8;max-width:480px;margin-bottom:24px;">${message}</p>
        <button onclick="location.reload()" style="background:#10b981;color:#fff;border:none;padding:10px 24px;border-radius:8px;font-size:1rem;cursor:pointer;">Seite neu laden</button>
      </div>`;
  }
}

window.addEventListener('error', (event) => {
  showFatalError(event.message || 'Ein unbekannter Fehler ist aufgetreten.');
});

window.addEventListener('unhandledrejection', (event) => {
  showFatalError(
    event.reason instanceof Error
      ? event.reason.message
      : 'Ein unbekannter Fehler ist aufgetreten.'
  );
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  showFatalError('Root-Element #root nicht gefunden.');
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}
