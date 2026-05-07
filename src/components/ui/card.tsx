import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated';
}

export function Card({ className = '', variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-bg-secondary border border-border',
    elevated: 'bg-bg-elevated border border-border',
  };

  return (
    <div className={`rounded-lg p-4 ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
