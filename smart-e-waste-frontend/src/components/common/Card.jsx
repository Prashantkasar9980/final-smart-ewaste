import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100 p-6
        
        /* MOBILE SAFE FIXES */
        w-full max-w-full
        overflow-hidden
        break-words
        hyphens-auto
        card-safe step-column

        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
