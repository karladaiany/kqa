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
import { useSettings, AVAILABLE_FEATURES } from '../../contexts/SettingsContext';

const SidebarMenu = ({ open = true, onClose, onSettingsClick }) => {
  const menuRef = useRef(null);
  const { isFeatureVisible } = useSettings();

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
          {isFeatureVisible(AVAILABLE_FEATURES.DOCUMENTOS) && (
            <div
              className='floating-nav-item'
              onClick={() => scrollToSection('documentos')}
            >
              <FaIdCard /> Documentos
            </div>
          )}
          {isFeatureVisible(AVAILABLE_FEATURES.DADOS_PESSOAIS) && (
            <div
              className='floating-nav-item'
              onClick={() => scrollToSection('dados-pessoais')}
            >
              <FaUserAlt /> Dados pessoais
            </div>
          )}
          {isFeatureVisible(AVAILABLE_FEATURES.PRODUTO) && (
            <div
              className='floating-nav-item'
              onClick={() => scrollToSection('produto')}
            >
              <FaGraduationCap /> Produtos
            </div>
          )}
          {isFeatureVisible(AVAILABLE_FEATURES.CARTAO) && (
            <div
              className='floating-nav-item'
              onClick={() => scrollToSection('cartao')}
            >
              <FaCreditCard /> Cartão
            </div>
          )}
          {isFeatureVisible(AVAILABLE_FEATURES.CARACTERES) && (
            <div
              className='floating-nav-item'
              onClick={() => scrollToSection('caracteres')}
            >
              <FaRandom /> Gerador de caracteres
            </div>
          )}
          {isFeatureVisible(AVAILABLE_FEATURES.CONTADOR) && (
            <div
              className='floating-nav-item'
              onClick={() => scrollToSection('contador')}
            >
              <FaCalculator /> Contador de caracteres
            </div>
          )}
          {isFeatureVisible(AVAILABLE_FEATURES.DADOS_COMPLEMENTARES) && (
            <div
              className='floating-nav-item'
              onClick={() => scrollToSection('dados-complementares')}
            >
              <FaBriefcase /> Dados complementares
            </div>
          )}
          {isFeatureVisible(AVAILABLE_FEATURES.FILE_GENERATOR) && (
            <div
              className='floating-nav-item'
              onClick={() => scrollToSection('file-generator')}
            >
              <FaFileExport /> Geração de arquivo
            </div>
          )}
          {isFeatureVisible(AVAILABLE_FEATURES.BUG) && (
            <div
              className='floating-nav-item'
              onClick={() => scrollToSection('bug')}
            >
              <FaBug /> Registro de BUG
            </div>
          )}
          {isFeatureVisible(AVAILABLE_FEATURES.TEST_STATUS) && (
            <div
              className='floating-nav-item'
              onClick={() => scrollToSection('test-status')}
            >
              <FaComment /> Comentário QA
            </div>
          )}
          {isFeatureVisible(AVAILABLE_FEATURES.DEPLOY) && (
            <div
              className='floating-nav-item'
              onClick={() => scrollToSection('deploy')}
            >
              <FaRocket /> Deploy
            </div>
          )}
          {isFeatureVisible(AVAILABLE_FEATURES.ACTIVITY_IMPORT) && (
            <div
              className='floating-nav-item'
              onClick={() => scrollToSection('activity-import')}
            >
              <FaFileImport /> Importar atividades
            </div>
          )}
          {isFeatureVisible(AVAILABLE_FEATURES.QUICK_ANNOTATIONS) && (
            <div
              className='floating-nav-item'
              onClick={() => scrollToSection('quick-annotations')}
            >
              <FaBolt /> Anotações rápidas
            </div>
          )}
          {isFeatureVisible(AVAILABLE_FEATURES.CUSTOM_ANNOTATIONS) && (
            <div
              className='floating-nav-item'
              onClick={() => scrollToSection('custom-annotations')}
            >
              <FaEdit /> Anotações personalizadas
            </div>
          )}
          {isFeatureVisible(AVAILABLE_FEATURES.MY_ENVIRONMENTS) && (
            <div
              className='floating-nav-item'
              onClick={() => scrollToSection('my-environments')}
            >
              <FaGlobe /> Meus ambientes
            </div>
          )}

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
