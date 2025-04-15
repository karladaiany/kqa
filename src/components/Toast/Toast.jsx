import React, { useState, useEffect } from 'react';
import './Toast.css';

export const Toast = ({ message, duration = 2000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="toast show">
      {message}
    </div>
  );
}; 