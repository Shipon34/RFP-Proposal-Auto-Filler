import React from 'react';
import { AGENCY_NAME } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="py-6 px-6 md:px-12 border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="font-bold text-white text-lg">A</span>
        </div>
        <span className="font-bold text-xl tracking-tight text-white">{AGENCY_NAME}</span>
      </div>
      <div className="hidden sm:block">
        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-400 uppercase tracking-wider">
          Internal Tool v1.0
        </span>
      </div>
    </header>
  );
};