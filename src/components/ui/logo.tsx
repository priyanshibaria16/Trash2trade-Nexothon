import React from 'react';
import { ArrowRightLeft, Recycle } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  showText = true, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon with Trade Vectors */}
      <div className="relative">
        {/* Main recycling symbol */}
        <Recycle className={`${sizeClasses[size]} text-primary relative z-10`} />
        
        {/* Trade arrows overlay */}
        <div className="absolute insets-0 flex items-center justify-center">
          <ArrowRightLeft className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-6 w-6'} text-success opacity-80 transform rotate-12`} />
        </div>
        
        {/* Small trade indicators */}
        <div className="absolute -top-1 -right-1">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
        </div>
        <div className="absolute -bottom-1 -left-1">
          <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-ping"></div>
        </div>
      </div>
      
      {/* Text */}
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]} bg-gradient-eco bg-clip-text text-transparent`}>
          Trash2Trade
        </span>
      )}
    </div>
  );
};

export default Logo;