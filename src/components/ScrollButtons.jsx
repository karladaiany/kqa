import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const ScrollButtons = () => {
  const [canScrollTop, setCanScrollTop] = useState(false);
  const [canScrollBottom, setCanScrollBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Habilita o botão de início se houver qualquer scroll para cima
      setCanScrollTop(scrollTop > 0);
      
      // Habilita o botão de fim se não estiver no final do documento
      // Considera uma pequena margem para evitar problemas com arredondamento
      const isAtBottom = Math.abs((scrollTop + windowHeight) - documentHeight) < 5;
      setCanScrollBottom(!isAtBottom);
    };

    // Executa a verificação inicial
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (canScrollTop) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const scrollToBottom = () => {
    if (canScrollBottom) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <button
        className={`scroll-button top ${!canScrollTop ? 'disabled' : ''}`}
        onClick={scrollToTop}
        title={canScrollTop ? "Ir para o início" : "Já está no início"}
        disabled={!canScrollTop}
      >
        <FaArrowUp />
      </button>
      <button
        className={`scroll-button bottom ${!canScrollBottom ? 'disabled' : ''}`}
        onClick={scrollToBottom}
        title={canScrollBottom ? "Ir para o fim" : "Já está no fim"}
        disabled={!canScrollBottom}
      >
        <FaArrowDown />
      </button>
    </>
  );
};

export default ScrollButtons; 