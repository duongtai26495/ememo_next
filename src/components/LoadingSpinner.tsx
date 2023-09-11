import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = 'w-14 h-14' }) => {
  return (
    <div className={`${className} border-t-4 border-pink-600 border-solid rounded-full animate-spin`}
    ></div>
  );
};

export default LoadingSpinner;
