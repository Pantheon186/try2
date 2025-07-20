import React from 'react';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className = '',
  hover = true,
  gradient = false,
  padding = 'md',
  onClick
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = `
    bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg
    ${hover ? 'card-hover' : ''}
    ${gradient ? 'bg-gradient-to-br from-white/70 to-blue-50/70' : ''}
    ${paddingClasses[padding]}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default ModernCard;