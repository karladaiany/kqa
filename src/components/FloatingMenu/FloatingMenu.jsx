import React from 'react';
import './FloatingMenu.css';

export const FloatingMenu = () => {
  const menuItems = [
    { id: 'personal-data', icon: 'fas fa-user', label: 'Dados pessoais' },
    { id: 'credit-card', icon: 'fas fa-credit-card', label: 'Cartão de crédito' },
    { id: 'documents', icon: 'fas fa-file-alt', label: 'Documentos' },
    { id: 'products', icon: 'fas fa-box', label: 'Produtos' },
    { id: 'char-generator', icon: 'fas fa-font', label: 'Gerador de caracteres' },
    { id: 'char-counter', icon: 'fas fa-text-width', label: 'Contador de caracteres' },
    { id: 'bug-report', icon: 'fas fa-bug', label: 'Registro de BUG' },
    { id: 'qa-comment', icon: 'fas fa-comment', label: 'Comentário de QA' }
  ];

  const scrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="floating-menu">
      {menuItems.map(item => (
        <button
          key={item.id}
          className="menu-item"
          onClick={() => scrollToElement(item.id)}
          title={item.label}
        >
          <i className={item.icon}></i>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}; 