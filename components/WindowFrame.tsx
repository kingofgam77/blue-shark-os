import React, { useState, useRef, useEffect } from 'react';
import { WindowState } from '../types';
import { Icon } from './Icon';

interface WindowFrameProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const titleBarRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (titleBarRef.current && titleBarRef.current.contains(e.target as Node)) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - window.x,
        y: e.clientY - window.y
      });
      onFocus(window.id);
    } else {
        // Just focus if clicking content
        onFocus(window.id);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onMove(window.id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, window.id, onMove]);

  if (window.isMinimized) return null;

  return (
    <div
      className={`absolute flex flex-col bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl overflow-hidden transition-shadow duration-200 ${
        isDragging ? 'select-none cursor-grabbing' : ''
      }`}
      style={{
        left: window.x,
        top: window.y,
        width: window.width,
        height: window.height,
        zIndex: window.zIndex,
        boxShadow: window.zIndex === 100 ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)' : '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Title Bar */}
      <div
        ref={titleBarRef}
        className="h-9 flex items-center justify-between px-3 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-white/5 cursor-default select-none group"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-600/50 group-hover:bg-cyan-500/50 transition-colors" />
          <span className="text-xs font-medium text-slate-300 tracking-wide">{window.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(window.id); }}
            className="p-1 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors"
          >
            <Icon name="Minus" size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize(window.id); }}
            className="p-1 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors"
          >
            <Icon name="Square" size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(window.id); }}
            className="p-1 hover:bg-red-500/80 rounded-md text-slate-400 hover:text-white transition-colors"
          >
            <Icon name="X" size={14} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-slate-950/50 relative">
        {children}
      </div>
    </div>
  );
};