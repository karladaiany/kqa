import React from 'react';

const PinIcon = ({ filled = false, size = 18, color = 'currentColor', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17 3l4 4-6.5 6.5M3 21l6.5-6.5M9 15l6-6" />
    {filled && <path d="M17 3l4 4-6.5 6.5M3 21l6.5-6.5M9 15l6-6" fill={color} opacity="0.2" />} 
  </svg>
);

export default PinIcon; 