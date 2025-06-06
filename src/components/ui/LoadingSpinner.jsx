import React from 'react';

function LoadingSpinner({ size = 'md', text = 'Բեռնվում է...', description = null }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-sky-200`}>
          <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-transparent border-t-sky-600"></div>
        </div>
      </div>
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-600 font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;
