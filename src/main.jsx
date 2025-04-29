import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import DataGenerator from './components/DataGenerator';
import { ToastContainer } from 'react-toastify';
import { FaSun, FaMoon } from 'react-icons/fa';
import ScrollButtons from './components/ScrollButtons';
import 'react-toastify/dist/ReactToastify.css';
import './styles/theme.css';
import './styles/components.css';

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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <div className="app">
      <header>
        <h1>🎲 KQA :: Gerador de Dados para QA ::</h1>
        <button 
          id="theme-toggle" 
          className="theme-toggle" 
          title={isDarkMode ? "Mudar para tema claro" : "Mudar para tema escuro"}
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </header>
      <main>
        <DataGenerator />
      </main>
      <ScrollButtons />
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
        theme={isDarkMode ? "dark" : "light"}
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