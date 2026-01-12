import React from 'react';

type BadgeTone = 'primary' | 'secondary' | 'accent' | 'neutral';
type BadgeVariant = 'solid' | 'soft' | 'outline';

export interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  variant?: BadgeVariant;
  className?: string;
}

const toneClasses: Record<BadgeTone, Record<BadgeVariant, string>> = {
  primary: {
    solid: 'bg-primary-500 text-white',
    soft: 'bg-primary-500/15 text-primary-600 border border-primary-500/30',
    outline: 'border border-primary-500 text-primary-600',
  },
  secondary: {
    solid: 'bg-secondary-500 text-white',
    soft: 'bg-secondary-500/15 text-secondary-600 border border-secondary-500/30',
    outline: 'border border-secondary-500 text-secondary-600',
  },
  accent: {
    solid: 'bg-accent-500 text-white',
    soft: 'bg-accent-500/15 text-accent-500 border border-accent-500/30',
    outline: 'border border-accent-500 text-accent-500',
  },
  neutral: {
    solid: 'bg-foreground text-background',
    soft: 'bg-surface-highlight text-foreground border border-border',
    outline: 'border border-border text-foreground',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  tone = 'neutral',
  variant = 'soft',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses[tone][variant]} ${className}`}
    >
      {children}
    </span>
  );
};
