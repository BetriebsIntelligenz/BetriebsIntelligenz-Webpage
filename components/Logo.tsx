import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Side Profile Outline */}
      <path d="M9.5 3C5 3 3.5 6 3.5 9c0 2.5 2 5 4.5 6 0 2.5 2.5 4 5 4 3.5 0 6-2 7-6 0-2-1-3.5-2.5-4 1-2.5-.5-5-3-6-1.5-.5-3-.5-5 0z" />
      
      {/* Internal Network Nodes (The "Intelligence" part) */}
      <circle cx="10" cy="8" r="1.5" />
      <circle cx="15" cy="11" r="1.5" />
      <circle cx="9" cy="13" r="1.5" />
      
      {/* Connections (Synapses) */}
      <path d="M11.2 8.8l2.6 1.5" />
      <path d="M13.8 11.5l-3.6 1.2" />
      <path d="M10 9.5v2" />
    </svg>
  );
};