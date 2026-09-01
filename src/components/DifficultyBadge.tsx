import React from 'react';
import { Difficulty } from '../types';

interface Props {
  difficulty: Difficulty;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const DifficultyBadge: React.FC<Props> = ({ difficulty, size = 'md', showIcon = true }) => {
  const configs = {
    BASIC: {
      label: 'Căn bản',
      color: 'bg-green-900/30 text-green-400 border-green-500/30',
      dot: 'bg-green-400',
    },
    MEDIUM: {
      label: 'Trung bình',
      color: 'bg-amber-900/30 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400',
    },
    ADVANCED: {
      label: 'Nâng cao',
      color: 'bg-rose-900/30 text-rose-400 border-rose-500/30',
      dot: 'bg-rose-400',
    },
  };

  const config = configs[difficulty] || configs.BASIC;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-mono uppercase font-bold',
    md: 'text-xs font-mono font-semibold px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs font-mono font-bold px-3 py-1 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded border whitespace-nowrap ${config.color} ${sizeClasses[size]}`}
    >
      {showIcon && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
};
