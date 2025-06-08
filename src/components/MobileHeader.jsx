import React from 'react';
import PropTypes from 'prop-types';
import {
  FaSun,
  FaMoon,
  FaBars,
  FaArrowUp,
  FaArrowDown,
  FaDice,
} from 'react-icons/fa';

const MobileHeader = ({
  darkMode,
  toggleTheme,
  sidebarOpen,
  setSidebarOpen,
  scrollToTop,
  scrollToBottom,
  canScrollUp,
  canScrollDown,
}) => {
  return (
    <div className='mobile-header'>
      <div className='mobile-header-content'>
        <button
          className='mobile-header-btn theme-btn'
          onClick={toggleTheme}
          aria-label={
            darkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'
          }
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <div className='mobile-header-center'>
          <h1 className='mobile-title'>
            <FaDice className='mobile-title-icon' /> KQA
          </h1>
        </div>

        <div className='mobile-header-actions'>
          <button
            className={`mobile-header-btn scroll-btn ${
              !canScrollUp ? 'disabled' : ''
            }`}
            onClick={scrollToTop}
            disabled={!canScrollUp}
            aria-label='Ir para o início'
          >
            <FaArrowUp />
          </button>

          <button
            className={`mobile-header-btn scroll-btn ${
              !canScrollDown ? 'disabled' : ''
            }`}
            onClick={scrollToBottom}
            disabled={!canScrollDown}
            aria-label='Ir para o fim'
          >
            <FaArrowDown />
          </button>

          <button
            className='mobile-header-btn menu-btn'
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label='Abrir menu'
          >
            <FaBars />
          </button>
        </div>
      </div>
    </div>
  );
};

MobileHeader.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
  scrollToTop: PropTypes.func.isRequired,
  scrollToBottom: PropTypes.func.isRequired,
  canScrollUp: PropTypes.bool.isRequired,
  canScrollDown: PropTypes.bool.isRequired,
};

export default MobileHeader;
