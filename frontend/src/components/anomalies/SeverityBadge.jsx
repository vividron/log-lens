import React from 'react';
import { getSeverityConfig } from '../../utils/formatters';

export function SeverityBadge({ severity = 'NORMAL', size = 'md', showDot = true, className = '' }) {
  const config = getSeverityConfig(severity);

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 tracking-wider gap-1',
    md: 'text-xs px-2 py-0.5 tracking-wide gap-1.5',
    lg: 'text-xs px-2.5 py-1 tracking-wide gap-2 font-semibold',
  };

  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md font-mono font-medium uppercase border select-none ${config.badgeBg} ${config.badgeBorder} ${config.badgeText} ${sizeClasses[size]} ${className}`}
      title={`Severity level: ${config.label}`}
    >
      {showDot && (
        <span
          className={`rounded-full shrink-0 ${config.dotColor} ${dotSizes[size]} ${
            config.label === 'CRITICAL' ? 'animate-pulse' : ''
          }`}
        />
      )}
      <span>{config.label}</span>
    </span>
  );
}
