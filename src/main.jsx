import React from 'react';
import { createRoot } from 'react-dom/client';
import DataGenerator from './components/DataGenerator';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';

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

const App = () => {
  return (
    <div className="app">
      <header>
        <h1>🎲 KQA :: Gerador de Dados para QA ::</h1>
        <button 
          id="theme-toggle" 
          className="theme-toggle" 
          title="Alternar tema"
          onClick={() => document.body.classList.toggle('dark-theme')}
        >
          🌓
        </button>
      </header>
      <main>
        <DataGenerator />
      </main>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

// Garantir que o DOM está pronto
const renderApp = () => {
  const root = document.getElementById('root');
  if (root) {
    createRoot(root).render(
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