
import React from 'react';
import { Player } from '../types';

interface SquareProps {
  value: Player;
  onClick: () => void;
  isWinningSquare: boolean;
  disabled: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinningSquare, disabled }) => {
  const getIconClass = () => {
    if (value === 'X') return 'fa-xmark text-cyan-400 scale-110 mark-pop';
    if (value === 'O') return 'fa-circle text-rose-400 scale-90 mark-pop';
    return '';
  };

  const isPlayable = !value && !disabled;

  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== null}
      className={`
        relative h-24 w-24 sm:h-32 sm:w-32 rounded-2xl text-4xl sm:text-5xl font-bold flex items-center justify-center
        transition-all duration-300 transform square-inner
        ${isPlayable ? 'hover:bg-slate-700/60 hover:scale-105 hover:border-slate-500/50 hover:shadow-xl hover:shadow-cyan-500/5 active:scale-95' : ''}
        ${isWinningSquare ? 'winning-line border-indigo-400/50' : 'bg-slate-800/40 border-slate-700/50'}
        border backdrop-blur-md
        group
      `}
    >
      {/* Subtle background glow on hover for empty squares */}
      {isPlayable && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 to-indigo-500/0 group-hover:from-cyan-500/5 group-hover:to-indigo-500/5 transition-all duration-500" />
      )}
      
      <i className={`fa-solid ${getIconClass()} transition-transform duration-300`}></i>
    </button>
  );
};

export default Square;
