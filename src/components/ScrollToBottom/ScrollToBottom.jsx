import React from 'react';
import './ScrollToBottom.css';

export const ScrollToBottom = () => {
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <button 
      className="scroll-to-bottom"
      onClick={scrollToBottom}
      title="Ir para o final"
    >
      <i className="fas fa-arrow-down"></i>
    </button>
  );
}; 