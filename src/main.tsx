import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Intercept and prevent browser extension injected errors (e.g., MetaMask, web3)
// from bubbling and crashing the application inside sandboxed iframes.
if (typeof window !== 'undefined') {
  const isExtensionError = (msg?: string, filename?: string) => {
    const str = `${msg || ''} ${filename || ''}`.toLowerCase();
    return (
      str.includes('metamask') ||
      str.includes('ethereum') ||
      str.includes('web3') ||
      str.includes('chrome-extension') ||
      str.includes('moz-extension') ||
      str.includes('safari-extension') ||
      str.includes('evm')
    );
  };

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const reason = event.reason;
      const message = typeof reason === 'string' ? reason : reason?.message || '';
      if (isExtensionError(message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  window.addEventListener(
    'error',
    (event) => {
      const message = event.message || event.error?.message || '';
      const filename = event.filename || '';
      if (isExtensionError(message, filename)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}

