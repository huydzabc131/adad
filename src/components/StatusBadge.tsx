import React from 'react';
import { SubmissionStatus } from '../types';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Cpu, Wrench } from 'lucide-react';

interface Props {
  status: SubmissionStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const configs: Record<SubmissionStatus, { label: string; icon: React.ReactNode; color: string }> = {
    ACCEPTED: {
      label: 'Accepted',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />,
      color: 'bg-green-900/30 text-green-400 border-green-500/30',
    },
    WRONG_ANSWER: {
      label: 'Wrong Answer',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
      color: 'bg-rose-900/30 text-rose-400 border-rose-500/30',
    },
    TIME_LIMIT_EXCEEDED: {
      label: 'Time Limit Exceeded',
      icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
      color: 'bg-amber-900/30 text-amber-400 border-amber-500/30',
    },
    MEMORY_LIMIT_EXCEEDED: {
      label: 'Memory Limit Exceeded',
      icon: <Cpu className="w-3.5 h-3.5 text-purple-400" />,
      color: 'bg-purple-900/30 text-purple-400 border-purple-500/30',
    },
    RUNTIME_ERROR: {
      label: 'Runtime Error',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />,
      color: 'bg-orange-900/30 text-orange-400 border-orange-500/30',
    },
    COMPILATION_ERROR: {
      label: 'Compilation Error',
      icon: <Wrench className="w-3.5 h-3.5 text-red-400" />,
      color: 'bg-red-900/30 text-red-400 border-red-500/30',
    },
    RUNNING: {
      label: 'Đang chấm...',
      icon: <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />,
      color: 'bg-blue-900/30 text-blue-400 border-blue-500/30',
    },
    PENDING: {
      label: 'Chờ chấm...',
      icon: <Clock className="w-3.5 h-3.5 animate-spin text-[#8B949E]" />,
      color: 'bg-[#21262D] text-[#8B949E] border-[#30363D]',
    },
  };

  const config = configs[status] || configs.PENDING;
  const sizeClasses = size === 'sm' ? 'text-[11px] font-mono px-2 py-0.5 gap-1 rounded' : 'text-xs font-mono font-semibold px-2.5 py-0.5 gap-1.5 rounded';

  return (
    <span
      className={`inline-flex items-center border whitespace-nowrap ${config.color} ${sizeClasses}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
