import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  FaIdCard,
  FaUserAlt,
  FaGraduationCap,
  FaCreditCard,
  FaRandom,
  FaCalculator,
  FaBug,
  FaComment,
  FaRocket,
  FaBriefcase,
  FaFileExport, // Added icons for new cards
  FaFileImport, // Icon for Activity Import
  FaStickyNote,
  FaCog, // Icon for Settings
  FaBolt, // Ícone para Anotações rápidas
  FaEdit, // Ícone para Anotações personalizadas
  FaGlobe, // Ícone para Meus ambientes
} from 'react-icons/fa';

const SidebarMenu = ({ open = true, onClose, onSettingsClick }) => {
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

  const scrollToSection = id => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    if (onClose) onClose();
  };

  return (
    <nav
      id='sidebar-menu'
      ref={menuRef}
      className={`sidebar-menu${open ? '' : ' closed'}`}
    >
      {open && (
        <>
          <div
            className='floating-nav-item'
            onClick={() => scrollToSection('documentos')}
          >
            <FaIdCard /> Documentos
          </div>
          <div
            className='floating-nav-item'
            onClick={() => scrollToSection('dados-pessoais')}
          >
            <FaUserAlt /> Dados pessoais
          </div>
          <div
            className='floating-nav-item'
            onClick={() => scrollToSection('produto')}
          >
            <FaGraduationCap /> Produtos
          </div>
          <div
            className='floating-nav-item'
            onClick={() => scrollToSection('cartao')}
          >
            <FaCreditCard /> Cartão
          </div>
          <div
            className='floating-nav-item'
            onClick={() => scrollToSection('caracteres')}
          >
            <FaRandom /> Gerador de caracteres
          </div>
          <div
            className='floating-nav-item'
            onClick={() => scrollToSection('contador')}
          >
            <FaCalculator /> Contador de caracteres
          </div>
          <div
            className='floating-nav-item'
            onClick={() => scrollToSection('dados-complementares')}
          >
            <FaBriefcase /> Dados complementares
          </div>
          <div
            className='floating-nav-item'
            onClick={() => scrollToSection('file-generator')}
          >
            <FaFileExport /> Geração de arquivo
          </div>
          <div
            className='floating-nav-item'
            onClick={() => scrollToSection('bug')}
          >
            <FaBug /> Registro de BUG
          </div>
          <div
            className='floating-nav-item'
            onClick={() => scrollToSection('test-status')}
          >
            <FaComment /> Comentário QA
          </div>
          <div
            className='floating-nav-item'
            onClick={() => scrollToSection('deploy')}
          >
            <FaRocket /> Deploy
          </div>
          <div
            className='floating-nav-item'
            onClick={() => scrollToSection('activity-import')}
          >
            <FaFileImport /> Importar atividades
          </div>
          <div
            className='floating-nav-item'
            onClick={() => scrollToSection('quick-annotations')}
          >
            <FaBolt /> Anotações rápidas
          </div>
          <div
            className='floating-nav-item'
            onClick={() => scrollToSection('custom-annotations')}
          >
            <FaEdit /> Anotações personalizadas
          </div>
          <div
            className='floating-nav-item'
            onClick={() => scrollToSection('my-environments')}
          >
            <FaGlobe /> Meus ambientes
          </div>

          {/* Separador visual */}
          <div className='sidebar-separator'></div>

          {/* Botão de configurações */}
          <div
            className='floating-nav-item settings-item'
            onClick={onSettingsClick}
            title='Configurações'
          >
            <FaCog /> Configurações
          </div>
        </>
      )}
    </nav>
  );
};

SidebarMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSettingsClick: PropTypes.func,
};

export default SidebarMenu;
