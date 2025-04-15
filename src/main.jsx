import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Tratamento global de erros
window.addEventListener('error', (event) => {
  // Ignorar erros do MobX e service worker
  if (event.message.includes('mobx-state-tree') || 
      event.message.includes('runtime.lastError') ||
      event.filename?.includes('sw.js')) {
    event.preventDefault();
    return;
  }
});

// Garantir que o DOM está pronto
const renderApp = () => {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
} 