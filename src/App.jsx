import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer } from 'react-toastify';
import {
  FaSun,
  FaMoon,
  FaBars,
  FaDatabase,
  FaClipboardList,
  FaDice,
  FaStickyNote,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

// Importações organizadas por categoria
import { DataGenerator } from './components/ui';
import {
  Footer,
  MobileHeader,
  SidebarMenu,
  ScrollButtons,
} from './components/layout';
import { SettingsModal } from './components/modals';
import { SettingsModal } from './components/modals';
import {
  BugRegistrationCard,
  DeployCard,
  TestStatusCard,
  ActivityImportCard,
} from './components/cards';
import AnnotationsCard from './components/Annotations/AnnotationsCard';

// Estilos
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.css';
import './App.css';

// Importações das constantes centralizadas
import { CONFIG_TOAST } from './constants';
import {
  CONFIG_SCROLL,
  CONFIG_ACESSIBILIDADE,
  inicializarTema,
  alternarTema,
} from './config/theme';

// Usar o novo contexto de configurações
import { useSettings, AVAILABLE_FEATURES } from './contexts/SettingsContext';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => inicializarTema());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const { isFeatureVisible, forceUpdateCounter } = useSettings();

  // Função para verificar se a seção "Geração de dados" deve ser exibida
  const shouldShowDataGenerationSection = useCallback(() => {
    return (
      isFeatureVisible(AVAILABLE_FEATURES.DOCUMENTOS) ||
      isFeatureVisible(AVAILABLE_FEATURES.DADOS_PESSOAIS) ||
      isFeatureVisible(AVAILABLE_FEATURES.PRODUTO) ||
      isFeatureVisible(AVAILABLE_FEATURES.CARTAO) ||
      isFeatureVisible(AVAILABLE_FEATURES.CARACTERES) ||
      isFeatureVisible(AVAILABLE_FEATURES.CONTADOR) ||
      isFeatureVisible(AVAILABLE_FEATURES.DADOS_COMPLEMENTARES) ||
      isFeatureVisible(AVAILABLE_FEATURES.FILE_GENERATOR)
    );
  }, [isFeatureVisible, forceUpdateCounter]);

  // Função para verificar se a seção "Registros de dados" deve ser exibida
  const shouldShowDataRecordsSection = useCallback(() => {
    return (
      isFeatureVisible(AVAILABLE_FEATURES.BUG) ||
      isFeatureVisible(AVAILABLE_FEATURES.TEST_STATUS) ||
      isFeatureVisible(AVAILABLE_FEATURES.DEPLOY) ||
      isFeatureVisible(AVAILABLE_FEATURES.ACTIVITY_IMPORT)
    );
  }, [isFeatureVisible, forceUpdateCounter]);

  // Função para verificar se a seção "Anotações" deve ser exibida
  const shouldShowAnnotationsSection = useCallback(() => {
    return (
      isFeatureVisible(AVAILABLE_FEATURES.QUICK_ANNOTATIONS) ||
      isFeatureVisible(AVAILABLE_FEATURES.CUSTOM_ANNOTATIONS) ||
      isFeatureVisible(AVAILABLE_FEATURES.MY_ENVIRONMENTS)
    );
  }, [isFeatureVisible, forceUpdateCounter]);

  // Função para fechar o modal de configurações
  const handleCloseSettingsModal = useCallback(() => {
    setShowSettingsModal(false);
  }, []);

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
    <div className='app' key={`app-${forceUpdateCounter}`}>
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
      <SidebarMenu
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSettingsClick={() => setShowSettingsModal(true)}
      />
      <SidebarMenu
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSettingsClick={() => setShowSettingsModal(true)}
      />
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
        {shouldShowDataGenerationSection() && (
          <>
            <h2 className='section-title'>
              <FaDatabase className='section-icon' /> Geração de dados
            </h2>
            <main>
              <DataGenerator />
            </main>
          </>
        )}

        {shouldShowDataRecordsSection() && (
          <>
            <h2 className='section-title'>
              <FaClipboardList className='section-icon' /> Registros de dados
            </h2>
            <main>
              {/* Dividir os cards de BUG e Comentário QA em duas colunas para melhor visualização
                  BugRegistrationCard à esquerda e TestStatusCard à direita */}
              <div className='row'>
                {isFeatureVisible(AVAILABLE_FEATURES.BUG) && (
                  <div className='col-6'>
                    <BugRegistrationCard />
                  </div>
                )}
                {isFeatureVisible(AVAILABLE_FEATURES.TEST_STATUS) && (
                  <div className='col-6'>
                    <TestStatusCard />
                  </div>
                )}
              </div>
              {isFeatureVisible(AVAILABLE_FEATURES.DEPLOY) && <DeployCard />}
              {isFeatureVisible(AVAILABLE_FEATURES.ACTIVITY_IMPORT) && (
                /* Card de Importação de Atividades - movido para depois do Deploy */
                <ActivityImportCard />
              )}
            </main>
          </>
        )}

        {shouldShowAnnotationsSection() && (
          <>
            <h2 className='section-title'>
              <FaStickyNote className='section-icon' /> Anotações
            </h2>
            <main>
              <AnnotationsCard />
            </main>
          </>
        )}
      </div>

      <Footer />

      <ScrollButtons />

      {/* Modal de Configurações */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={handleCloseSettingsModal}
      />

      <ToastContainer {...CONFIG_TOAST} theme={darkMode ? 'dark' : 'light'} />
    </div>
  );
};

export default App;
