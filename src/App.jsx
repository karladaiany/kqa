import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { DataGenerator } from './components/DataGenerator';
import { FaSun, FaMoon, FaBars, FaDatabase, FaClipboardList } from 'react-icons/fa';
import ScrollButtons from './components/ScrollButtons';
import TestStatusCard from './components/TestStatus/TestStatusCard';
import BugRegistrationCard from './components/BugRegistration/BugRegistrationCard';
import DeployCard from './components/Deploy/DeployCard';
import 'react-toastify/dist/ReactToastify.css';
import './styles/theme.css';
import './styles/components.css';
import './styles.css';
import './App.css';
import SidebarMenu from './components/SidebarMenu';
import { Container, Typography, Box } from '@mui/material';

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
        <h1>🎲 KQA :: Gerador de Dados para QA ::</h1>
      </header>

      <div className="content-wrapper">
        <h2 className="section-title"><FaDatabase className="section-icon" /> Geração de dados</h2>
        <main>
          <DataGenerator />
        </main>

        <h2 className="section-title"><FaClipboardList className="section-icon" /> Registros de dados</h2>
        <main>
          {/* Dividir os cards de BUG e Comentário QA em duas colunas para melhor visualização
              BugRegistrationCard à esquerda e TestStatusCard à direita */}
          <div className="row">
            <div className="col-6">
              <BugRegistrationCard />
            </div>
            <div className="col-6">
              <TestStatusCard />
            </div>
          </div>
          <DeployCard />
        </main>
      </div>
      
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