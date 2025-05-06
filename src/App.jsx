import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { DataGenerator } from './components/DataGenerator';
import { FaSun, FaMoon, FaBars } from 'react-icons/fa';
import ScrollButtons from './components/ScrollButtons';
import TestStatusCard from './components/TestStatus/TestStatusCard';
import 'react-toastify/dist/ReactToastify.css';
import './styles/theme.css';
import './styles/components.css';
import './styles.css';
import SidebarMenu from './components/SidebarMenu';

const App = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  React.useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    document.body.classList.toggle('dark-theme', isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.body.classList.toggle('dark-theme', newDarkMode);
  };

  return (
    <div className="app">
      <button
        id="menu-toggle"
        className="icon-button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Abrir menu"
        type="button"
      >
        <FaBars />
      </button>
      <SidebarMenu open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <header>
        <h1>🎲 KQA :: Gerador de Dados para QA</h1>
      </header>

      <main>
        <DataGenerator />
        <div className="qa-section">
          <TestStatusCard />
        </div>
      </main>

      <ScrollButtons />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
      />
    </div>
  );
};

export default App; 