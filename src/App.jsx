import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { DataGenerator } from './components/DataGenerator';
import {
  FaSun,
  FaMoon,
  FaBars,
  FaDatabase,
  FaClipboardList,
  FaDice,
  FaStickyNote,
} from 'react-icons/fa';
import ScrollButtons from './components/ScrollButtons';
import MobileHeader from './components/MobileHeader';
import TestStatusCard from './components/TestStatus/TestStatusCard';
import BugRegistrationCard from './components/BugRegistration/BugRegistrationCard';
import DeployCard from './components/Deploy/DeployCard';
import AnnotationsCard from './components/Annotations/AnnotationsCard';
import Footer from './components/Footer';
import 'react-toastify/dist/ReactToastify.css';
import './styles/theme.css';
import './styles/components.css';
import './styles/annotations.css';
import './styles/quick-notes-badges.css';
import './styles.css';
import './App.css';
import SidebarMenu from './components/SidebarMenu';

// Importações das constantes centralizadas
import { CONFIG_TOAST } from './constants';
import {
  CONFIG_SCROLL,
  CONFIG_ACESSIBILIDADE,
  inicializarTema,
  alternarTema,
} from './config/theme';

// Utilitários de debug removidos - código limpo para produção

const App = () => {
  const [darkMode, setDarkMode] = useState(() => inicializarTema());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      setCanScrollUp(scrollTop > CONFIG_SCROLL.offsetMinimo);
      setCanScrollDown(
        scrollTop < scrollHeight - clientHeight - CONFIG_SCROLL.offsetMaximo
      );
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = alternarTema(darkMode);
    setDarkMode(newDarkMode);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: CONFIG_SCROLL.comportamento });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: CONFIG_SCROLL.comportamento,
    });
  };

  return (
    <div className='app'>
      <MobileHeader
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        scrollToTop={scrollToTop}
        scrollToBottom={scrollToBottom}
        canScrollUp={canScrollUp}
        canScrollDown={canScrollDown}
      />

      <button
        id='menu-toggle'
        className='icon-button'
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={CONFIG_ACESSIBILIDADE.ariaLabels.menuToggle}
        type='button'
      >
        <FaBars />
      </button>
      <SidebarMenu open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <button
        className='theme-toggle'
        onClick={toggleTheme}
        aria-label={
          darkMode
            ? CONFIG_ACESSIBILIDADE.ariaLabels.themeToLight
            : CONFIG_ACESSIBILIDADE.ariaLabels.themeToDark
        }
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <header>
        <h1>
          <FaDice className='title-icon' /> KQA :: Gerador de Dados para QA ::
        </h1>
      </header>

      <div className='content-wrapper'>
        <h2 className='section-title'>
          <FaDatabase className='section-icon' /> Geração de dados
        </h2>
        <main>
          <DataGenerator />
        </main>

        <h2 className='section-title'>
          <FaClipboardList className='section-icon' /> Registros de dados
        </h2>
        <main>
          {/* Dividir os cards de BUG e Comentário QA em duas colunas para melhor visualização
              BugRegistrationCard à esquerda e TestStatusCard à direita */}
          <div className='row'>
            <div className='col-6'>
              <BugRegistrationCard />
            </div>
            <div className='col-6'>
              <TestStatusCard />
            </div>
          </div>
          <DeployCard />
        </main>

        <h2 className='section-title'>
          <FaStickyNote className='section-icon' /> Anotações
        </h2>
        <main>
          <AnnotationsCard />
        </main>
      </div>

      <Footer />

      <ScrollButtons />
      <ToastContainer {...CONFIG_TOAST} theme={darkMode ? 'dark' : 'light'} />
    </div>
  );
};

export default App;
