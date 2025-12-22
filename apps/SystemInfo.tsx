import React from 'react';
import { Icon } from '../components/Icon';
import { AppID } from '../types';

export const SystemInfo: React.FC = () => {
  return (
    <div className="h-full bg-slate-900 text-slate-200 p-8 flex flex-col items-center justify-center space-y-6 select-none">
      <div className="relative">
        <div className="absolute -inset-4 bg-blue-500/20 blur-xl rounded-full"></div>
        <Icon name="Cpu" size={64} className="text-blue-400 relative z-10" />
      </div>
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
          Blue Shark OS
        </h1>
        <p className="text-slate-500 text-sm">Version 2.5 (Deep Dive)</p>
      </div>

      <div className="w-full max-w-xs bg-slate-800/50 rounded-lg p-4 space-y-3 border border-white/5">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Processor</span>
          <span className="font-mono text-cyan-400">GenAI Neural Core</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Memory</span>
          <span className="font-mono text-cyan-400">Infinite Fluid RAM</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Graphics</span>
          <span className="font-mono text-cyan-400">Bioluminescent GPU</span>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-xs text-slate-600">
          Designed for explorers of the digital abyss.
        </p>
      </div>
    </div>
  );
};