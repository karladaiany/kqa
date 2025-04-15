import React, { useState, useEffect } from 'react';
import './BackToTop.css';

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button 
      id="back-to-top" 
      className={`btn btn-primary ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      title="Voltar ao topo"
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  );
}; 