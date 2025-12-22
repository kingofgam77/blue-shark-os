import React, { useState } from 'react';
import { Icon } from '../components/Icon';

export const Google: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#202124] text-gray-200 font-sans select-none">
      {/* Browser Toolbar (Fake) */}
      <div className="h-10 bg-[#292a2d] flex items-center px-2 space-x-2 border-b border-[#3e4042]">
        <div className="flex space-x-1">
             <div className="p-1 hover:bg-[#3e4042] rounded-full text-gray-400"><Icon name="SkipBack" size={14} /></div>
             <div className="p-1 hover:bg-[#3e4042] rounded-full text-gray-400"><Icon name="SkipForward" size={14} /></div>
             <div className="p-1 hover:bg-[#3e4042] rounded-full text-gray-400"><Icon name="RotateCw" size={14} /></div>
        </div>
        <div className="flex-1 bg-[#202124] rounded-full px-4 py-1 text-xs text-gray-400 border border-[#3e4042] flex items-center">
            <Icon name="Globe" size={12} className="mr-2" />
            https://www.google.com
        </div>
        <div className="p-1 hover:bg-[#3e4042] rounded-full text-gray-400"><Icon name="Settings" size={14} /></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center w-full max-w-lg space-y-8 -mt-20">
            {/* Logo */}
            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter select-none">
                <span className="text-[#8ab4f8]">G</span>
                <span className="text-[#ea4335]">o</span>
                <span className="text-[#fbbc04]">o</span>
                <span className="text-[#8ab4f8]">g</span>
                <span className="text-[#34a853]">l</span>
                <span className="text-[#ea4335]">e</span>
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Icon name="Search" size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-[#303134] hover:bg-[#303134] focus:bg-[#303134] border border-[#5f6368] hover:border-gray-500 focus:border-gray-500 rounded-full py-3 pl-12 pr-12 text-white outline-none shadow-sm hover:shadow-md transition-shadow"
                  autoFocus
                />
                 {query && (
                    <button 
                        type="button"
                        onClick={() => setQuery('')}
                        className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white"
                    >
                        <Icon name="X" size={18} />
                    </button>
                )}
            </form>

            {/* Buttons */}
            <div className="flex space-x-4">
                <button onClick={handleSearch} className="px-6 py-2 bg-[#303134] border border-transparent hover:border-[#5f6368] rounded text-sm text-[#e8eaed]">
                    Google Search
                </button>
                <button className="px-6 py-2 bg-[#303134] border border-transparent hover:border-[#5f6368] rounded text-sm text-[#e8eaed]">
                    I'm Feeling Lucky
                </button>
            </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-[#171717] text-[#9aa0a6] text-xs">
          <div className="px-6 py-3 border-b border-[#3e4042]">Blue Shark OS Region</div>
          <div className="flex flex-wrap justify-between px-6 py-3">
              <div className="flex space-x-6">
                  <span className="hover:underline cursor-pointer">About</span>
                  <span className="hover:underline cursor-pointer">Advertising</span>
                  <span className="hover:underline cursor-pointer">Business</span>
              </div>
              <div className="flex space-x-6 mt-2 md:mt-0">
                  <span className="hover:underline cursor-pointer">Privacy</span>
                  <span className="hover:underline cursor-pointer">Terms</span>
                  <span className="hover:underline cursor-pointer">Settings</span>
              </div>
          </div>
      </div>
    </div>
  );
};