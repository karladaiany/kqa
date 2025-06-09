import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Importa o App.jsx
import { cleanupSecurityData } from './utils/security';

// Tratamento global de erros
window.addEventListener('error', event => {
  // Ignorar erros conhecidos e não críticos
  if (
    event.message.includes('mobx-state-tree') ||
    event.message.includes('runtime.lastError') ||
    event.message.includes('PureComponent') ||
    event.filename?.includes('sw.js') ||
    event.filename?.includes('extensions/') ||
    event.message.includes('Non-Error promise rejection')
  ) {
    event.preventDefault();
    return;
  }

  // Log apenas erros críticos em produção
  if (import.meta.env.PROD) {
    console.error('[KQA] Critical error:', event.error || event.message);
  }
});

// Desabilitar Service Worker temporariamente para debug
// TODO: Reabilitar após resolver problemas de CSP
/*
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('[Main] SW registered successfully:', registration.scope);
        cleanupSecurityData();
      })
      .catch(error => {
        console.warn('[Main] SW registration failed:', error);
      });
  });
}
*/

// Limpeza de dados de segurança na inicialização
cleanupSecurityData();

// Verificar se React está disponível antes de tentar renderizar
function initializeApp() {
  // Verificar se React e ReactDOM estão carregados
  if (typeof React === 'undefined' || typeof createRoot === 'undefined') {
    console.warn('[KQA] React not loaded yet, retrying...');
    setTimeout(initializeApp, 100);
    return;
  }

  const root = document.getElementById('root');
  if (!root) {
    console.error('[KQA] Root element not found');
    return;
  }

  try {
    createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('[KQA] App rendered successfully');
  } catch (error) {
    console.error('[KQA] Failed to render app:', error);
    // Fallback simples se React falhar
    root.innerHTML = `
      <div style="
        display: flex; 
        align-items: center; 
        justify-content: center; 
        height: 100vh; 
        font-family: system-ui; 
        text-align: center;
        background: #1a1a1a;
        color: #fff;
      ">
        <div>
          <h1>KQA - Gerador de Dados</h1>
          <p>Erro ao carregar aplicação</p>
          <p style="color: #888; font-size: 0.9em;">
            Recarregando automaticamente...
          </p>
          <button onclick="window.location.reload()" style="
            background: #785DC8; 
            color: white; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 5px; 
            cursor: pointer;
            margin-top: 20px;
          ">
            Recarregar Agora
          </button>
        </div>
      </div>
    `;

    // Tentar recarregar após 5 segundos
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
