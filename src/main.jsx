import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Importa o App.jsx

// Tratamento global de erros
window.addEventListener('error', event => {
  // Ignorar erros do MobX e service worker
  if (
    event.message.includes('mobx-state-tree') ||
    event.message.includes('runtime.lastError') ||
    event.filename?.includes('sw.js')
  ) {
    event.preventDefault();
    return;
  }
});

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
