import React from 'react';

export const BootScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#001e3c] via-[#001020] to-black z-[100] flex flex-col items-center justify-center font-sans select-none overflow-hidden">
      
      {/* Ambient Light/Water Surface Effect */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
      
      {/* Animated Bubbles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-400/20 backdrop-blur-sm animate-float"
            style={{
              width: Math.random() * 15 + 5 + 'px',
              height: Math.random() * 15 + 5 + 'px',
              left: Math.random() * 100 + '%',
              bottom: -50 + 'px',
              animationDuration: Math.random() * 10 + 5 + 's',
              animationDelay: Math.random() * 5 + 's',
            }}
          />
        ))}
      </div>

      {/* Main Shark Visual */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 animate-hover">
            {/* Glow effect behind shark */}
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            
            {/* Porthole/Shark Container */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-cyan-900/50 shadow-[0_0_50px_rgba(8,145,178,0.3)] ring-1 ring-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1560275619-4662e36fa65c?q=80&w=1000&auto=format&fit=crop" 
                  alt="Blue Shark Swimming" 
                  className="w-full h-full object-cover scale-110"
                />
                {/* Overlay gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-blue-500/10"></div>
            </div>
        </div>
        
        <div className="space-y-4 text-center">
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-400 to-cyan-200 tracking-tighter drop-shadow-lg animate-shimmer bg-[length:200%_auto]">
            BLUE SHARK OS
            </h1>
            
            <div className="flex flex-col items-center gap-3">
                <div className="w-64 h-1.5 bg-blue-900/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-loading-bar w-full rounded-full relative" />
                </div>
                <p className="text-[10px] text-cyan-300/60 font-mono tracking-[0.3em] uppercase animate-pulse">Initializing Neural Network...</p>
            </div>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-120vh) translateX(20px); opacity: 0; }
        }
        @keyframes hover {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-float { animation: float linear infinite; }
        .animate-hover { animation: hover 4s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
        .animate-loading-bar { animation: loading-bar 3.5s ease-out forwards; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};