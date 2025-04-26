import React from 'react';
import { FloatingMenu } from './components/FloatingMenu/FloatingMenu';
import { BackToTop } from './components/BackToTop/BackToTop';
import { ToastProvider } from './context/ToastContext';
import BugReportCard from './components/BugReportCard/BugReportCard';
import QACommentCard from './components/QACommentCard';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PersonalData } from './components/PersonalData/PersonalData';
import { CreditCard } from './components/CreditCard/CreditCard';
import { Documents } from './components/Documents/Documents';
import { Products } from './components/Products/Products';
import { CharCounter } from './components/CharCounter/CharCounter';
import { ScrollButtons } from './components/ScrollButtons';
import './App.css';

function AppContent() {
  const { isDarkMode } = useTheme();

  return (
    <div className="app-container">
      <header className="page-header">
        <div className="header-content">
          <h1>🎲 KQA :: Gerador de Dados para QA ::</h1>
        </div>
        <p className="lead">Sua ferramenta essencial para dados de teste</p>
      </header>

      <main>
        <section className="content-section">
          <h2 className="records-title">
            <i className="fas fa-random"></i>
            Geração de Dados
          </h2>
          <div className="data-generation-container">
            <div className="data-generation-column left-column">
              <div id="personal-data"><PersonalData /></div>
              <div id="credit-card"><CreditCard /></div>
            </div>
            <div className="data-generation-column right-column">
              <div id="documents"><Documents /></div>
              <div id="products"><Products /></div>
              <div id="char-generator"><CharCounter /></div>
              <div id="char-counter"><CharCounter /></div>
            </div>
          </div>
        </section>

        <div className="mt-5">
          <h2 className="records-title">
            <i className="fas fa-database"></i>
            Registros de Informações
          </h2>
          <div className="storage-warning">
            <i className="fas fa-info-circle"></i>
            <span>Os dados são salvos localmente no seu navegador. Dados sensíveis são criptografados. Use "Limpar tudo" para removê-los.</span>
          </div>
          <div className="row">
            <div className="col-6">
              <div id="bug-report"><BugReportCard /></div>
            </div>
            <div className="col-6">
              <div id="qa-comment"><QACommentCard /></div>
            </div>
          </div>
        </div>
      </main>
      <FloatingMenu />
      <ScrollButtons />
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 