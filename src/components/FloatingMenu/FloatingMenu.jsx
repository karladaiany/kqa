import React, { useState } from 'react';
import './FloatingMenu.css';

export const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="floating-menu">
      <button className="menu-toggle" onClick={toggleMenu}>
        <i className={`fas fa-${isOpen ? 'times' : 'bars'}`}></i>
      </button>
      <nav className={`menu-items ${isOpen ? 'active' : ''}`}>
        <a href="#dados-pessoais">
          <i className="fas fa-user"></i> Dados Pessoais
        </a>
        <a href="#cartao-credito">
          <i className="fas fa-credit-card"></i> Cartão de Crédito
        </a>
        <a href="#documentos">
          <i className="fas fa-id-card"></i> Documentos
        </a>
        <a href="#cursos">
          <i className="fas fa-graduation-cap"></i> Cursos
        </a>
        <a href="#contador-caracteres">
          <i className="fas fa-text-width"></i> Contador
        </a>
        <a href="#bug-report">
          <i className="fas fa-bug"></i> Bug Report
        </a>
        <a href="#qa-comment">
          <i className="fas fa-comment"></i> QA Comment
        </a>
      </nav>
    </div>
  );
}; 