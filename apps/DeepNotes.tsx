import React, { useState, useEffect } from 'react';

export const DeepNotes: React.FC = () => {
  const [note, setNote] = useState(() => localStorage.getItem('blue-shark-notes') || '');

  useEffect(() => {
    localStorage.setItem('blue-shark-notes', note);
  }, [note]);

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-[#d4d4d4]">
      <div className="p-2 text-xs bg-[#252526] text-[#858585] flex gap-4 select-none">
        <span className="hover:text-white cursor-pointer">File</span>
        <span className="hover:text-white cursor-pointer">Edit</span>
        <span className="hover:text-white cursor-pointer">View</span>
      </div>
      <textarea
        className="flex-1 w-full bg-transparent resize-none outline-none p-4 font-mono text-sm leading-6"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="// Dive into your thoughts..."
        spellCheck={false}
      />
      <div className="h-6 bg-[#007acc] text-white text-[10px] flex items-center px-2 gap-4 select-none">
        <span>Ln {note.split('\n').length}, Col {note.length}</span>
        <span>UTF-8</span>
        <span>TypeScript React</span>
      </div>
    </div>
  );
};