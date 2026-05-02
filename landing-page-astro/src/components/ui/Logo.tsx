import React from 'react';

export function RailsLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <g transform="rotate(-25 12 12)">
        <ellipse cx="12" cy="12" rx="11" ry="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 6" opacity="0.3"/>
        <path d="M 23 12 A 11 4 0 0 1 8 15.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M 4 14.7 A 11 4 0 0 1 1 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="23" cy="12" r="2" fill="currentColor" />
      </g>
    </svg>
  );
}