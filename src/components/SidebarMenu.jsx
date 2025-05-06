import React, { useEffect, useRef } from 'react';
import {
  FaIdCard, FaUserAlt, FaGraduationCap, FaCreditCard, FaRandom,
  FaCalculator, FaBug, FaComment, FaRocket
} from 'react-icons/fa';

const SidebarMenu = ({ open = true, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose && onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    if (onClose) onClose();
  };

  return (
    <nav
      id="sidebar-menu"
      ref={menuRef}
      className={`sidebar-menu${open ? '' : ' closed'}`}
    >
      {open && (
        <>
          <div className="floating-nav-item" onClick={() => scrollToSection('documentos')}>
            <FaIdCard /> Documentos
          </div>
          <div className="floating-nav-item" onClick={() => scrollToSection('dados-pessoais')}>
            <FaUserAlt /> Dados Pessoais
          </div>
          <div className="floating-nav-item" onClick={() => scrollToSection('produto')}>
            <FaGraduationCap /> Produtos
          </div>
          <div className="floating-nav-item" onClick={() => scrollToSection('cartao')}>
            <FaCreditCard /> Cartão
          </div>
          <div className="floating-nav-item" onClick={() => scrollToSection('caracteres')}>
            <FaRandom /> Gerador de Caracteres
          </div>
          <div className="floating-nav-item" onClick={() => scrollToSection('contador')}>
            <FaCalculator /> Contador de Caracteres
          </div>
          <div className="floating-nav-item" onClick={() => scrollToSection('bug')}>
            <FaBug /> Registro de BUG
          </div>
          <div className="floating-nav-item" onClick={() => scrollToSection('test-status')}>
            <FaComment /> Comentário QA
          </div>
          <div className="floating-nav-item" onClick={() => scrollToSection('deploy')}>
            <FaRocket /> Deploy
          </div>
        </>
      )}
    </nav>
  );
};

export default SidebarMenu; 