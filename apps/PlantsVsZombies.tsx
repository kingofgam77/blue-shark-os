import React, { useState } from 'react';

export const PlantsVsZombies: React.FC = () => {
  const [started, setStarted] = useState(false);

  return (
    <div className="h-full w-full bg-black relative overflow-hidden select-none font-mono">
      {!started ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900">
           <div className="mb-8 relative">
              <h1 className="text-5xl md:text-7xl font-black text-lime-500 tracking-tighter drop-shadow-[0_4px_0_rgba(0,0,0,1)] z-10 relative">
                PLANTS
              </h1>
              <div className="text-2xl font-bold text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] bg-slate-800 px-2 border-2 border-white shadow-lg z-20">
                VS.
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-purple-600 tracking-tighter drop-shadow-[0_4px_0_rgba(0,0,0,1)] z-10 relative mt-2">
                ZOMBIES
              </h1>
           </div>
           
           <button 
             onClick={() => setStarted(true)}
             className="px-8 py-4 bg-lime-600 hover:bg-lime-500 text-black font-bold text-xl rounded-lg border-b-4 border-lime-800 active:border-b-0 active:translate-y-1 transition-all shadow-xl"
           >
             CLICK TO START
           </button>
           
           <p className="absolute bottom-4 text-xs text-zinc-600">Blue Shark OS Port v1.0</p>
        </div>
      ) : (
        <div className="absolute inset-0 bg-green-800 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="text-6xl animate-bounce">🧟‍♂️ 🌻 🧟‍♀️</div>
                <div className="bg-black/50 p-6 rounded-xl border-2 border-lime-500/50 backdrop-blur-sm max-w-md mx-4">
                    <h2 className="text-2xl font-bold text-lime-400 mb-2">Game Loaded</h2>
                    <p className="text-lime-100">The zombies are coming... eventually.</p>
                    <p className="text-sm text-lime-100/60 mt-4">(This is a simulated application demo)</p>
                </div>
                <button 
                   onClick={() => setStarted(false)}
                   className="text-lime-300 hover:text-white underline text-sm"
                >
                    Return to Menu
                </button>
            </div>
        </div>
      )}
    </div>
  );
};