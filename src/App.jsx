import React from 'react';
import { FloatingMenu } from './components/FloatingMenu/FloatingMenu';
import { BackToTop } from './components/BackToTop/BackToTop';
import { ToastProvider } from './context/ToastContext';
import BugReportCard from './components/BugReportCard';
import QACommentCard from './components/QACommentCard';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PersonalData } from './components/PersonalData/PersonalData';
import { CreditCard } from './components/CreditCard/CreditCard';
import { Documents } from './components/Documents/Documents';
import { Products } from './components/Products/Products';
import { CharCounter } from './components/CharCounter/CharCounter';
import { CharacterCounter } from './components/CharacterCounter/CharacterCounter';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <div className="container">
            <header className="page-header">
              <h1>🎲 KQA :: Gerador de Dados para QA ::</h1>
              <p className="lead">Sua ferramenta essencial para dados de teste</p>
            </header>

            <main>
              <section>
                <h2 className="section-title">Geração de Dados</h2>
                <div className="row">
                  <div className="col-6">
                    <div className="card-stack">
                      <PersonalData />
                      <CreditCard />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card-stack">
                      <Documents />
                      <Products />
                      <CharCounter title="Gerador de Caracteres" />
                      <CharacterCounter />
                    </div>
                  </div>
                </div>
              </section>

              <section className="mt-5">
                <h2 className="section-title">Registros de Informações</h2>
                <div className="row">
                  <div className="col-6">
                    <BugReportCard />
                  </div>
                  <div className="col-6">
                    <QACommentCard />
                  </div>
                </div>
              </section>
            </main>
          </div>
          <FloatingMenu />
          <BackToTop />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 