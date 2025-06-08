import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Importa o App.jsx
import { cleanupSecurityData } from './utils/security';

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

// Registrar Service Worker para cache e performance
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('[Main] SW registered successfully:', registration.scope);

        // Limpa dados de segurança expirados
        cleanupSecurityData();
      })
      .catch(error => {
        console.warn('[Main] SW registration failed:', error);
      });
  });
}

// Limpeza de dados de segurança na inicialização
cleanupSecurityData();

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
