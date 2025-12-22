import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../components/Icon';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string; // Display format "3:45"
  durationSec: number;
  cover: string;
}

const SONGS: Song[] = [
  { 
    id: '1', 
    title: 'Deep Ocean Echoes', 
    artist: 'Marine Lo-Fi', 
    album: 'Blue Depths', 
    duration: '3:24', 
    durationSec: 204,
    cover: 'https://images.unsplash.com/photo-1498931299472-f7a63a02f63a?q=80&w=600&auto=format&fit=crop' 
  },
  { 
    id: '2', 
    title: 'Coral Reef Drift', 
    artist: 'Tidal Waves', 
    album: 'Currents', 
    duration: '4:12', 
    durationSec: 252,
    cover: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=600&auto=format&fit=crop' 
  },
  { 
    id: '3', 
    title: 'Midnight Trench', 
    artist: 'Abyss Walker', 
    album: 'The Zone', 
    duration: '2:58', 
    durationSec: 178,
    cover: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=600&auto=format&fit=crop' 
  },
  { 
    id: '4', 
    title: 'Bioluminescence', 
    artist: 'Glow Plankton', 
    album: 'Night Dive', 
    duration: '3:45', 
    durationSec: 225,
    cover: 'https://images.unsplash.com/photo-1518118014377-ce94f39feb4c?q=80&w=600&auto=format&fit=crop' 
  },
  { 
    id: '5', 
    title: 'Shark Patrol', 
    artist: 'Predator', 
    album: 'Hunter', 
    duration: '3:10', 
    durationSec: 190,
    cover: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?q=80&w=600&auto=format&fit=crop' 
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<Song>(SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  
  // Animation ref for visualizer bars
  const [visualizerHeights, setVisualizerHeights] = useState<number[]>(new Array(12).fill(20));

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentSong.durationSec) {
             // Song finished
             if (repeat) return 0;
             handleNext();
             return 0;
          }
          return prev + 1;
        });

        // Update visualizer
        setVisualizerHeights(prev => prev.map(() => Math.random() * 80 + 10));

      }, 1000);
    } else {
      // Reset visualizer when paused
      setVisualizerHeights(new Array(12).fill(10));
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentSong, repeat]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    const currentIndex = SONGS.findIndex(s => s.id === currentSong.id);
    if (shuffle) {
        let nextIndex = Math.floor(Math.random() * SONGS.length);
        while (nextIndex === currentIndex && SONGS.length > 1) {
            nextIndex = Math.floor(Math.random() * SONGS.length);
        }
        setCurrentSong(SONGS[nextIndex]);
    } else {
        const nextIndex = (currentIndex + 1) % SONGS.length;
        setCurrentSong(SONGS[nextIndex]);
    }
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const currentIndex = SONGS.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + SONGS.length) % SONGS.length;
    setCurrentSong(SONGS[prevIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  return (
    <div className="flex h-full bg-[#121212] text-white font-sans select-none">
      {/* Sidebar - Playlist */}
      <div className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <Icon name="Music" size={20} className="text-cyan-400" />
            <span className="font-bold tracking-tight">Library</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {SONGS.map((song) => (
                <button
                    key={song.id}
                    onClick={() => { setCurrentSong(song); setIsPlaying(true); setCurrentTime(0); }}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors group text-left ${currentSong.id === song.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                        <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                        {currentSong.id === song.id && isPlaying && (
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                 <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse" />
                             </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${currentSong.id === song.id ? 'text-cyan-400' : 'text-gray-200'}`}>{song.title}</div>
                        <div className="text-xs text-gray-500 truncate">{song.artist}</div>
                    </div>
                    <div className="text-xs text-gray-600 font-mono">{song.duration}</div>
                </button>
            ))}
        </div>
      </div>

      {/* Main Player Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
         {/* Background Blur */}
         <div className="absolute inset-0 z-0">
             <img src={currentSong.cover} alt="Background" className="w-full h-full object-cover opacity-20 blur-3xl scale-125" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent" />
         </div>

         {/* Content */}
         <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 space-y-8">
             {/* Visualizer & Art */}
             <div className="relative group">
                 <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10 relative">
                     <img src={currentSong.cover} alt={currentSong.title} className="w-full h-full object-cover" />
                     {/* Overlay Shine */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 
                 {/* Visualizer Bars */}
                 <div className="absolute -bottom-4 left-0 right-0 h-12 flex items-end justify-center gap-1 opacity-60">
                     {visualizerHeights.map((h, i) => (
                         <div 
                            key={i} 
                            className="w-2 bg-cyan-400/80 rounded-t-sm transition-all duration-300 ease-out" 
                            style={{ height: `${h}%` }}
                         />
                     ))}
                 </div>
             </div>

             {/* Info */}
             <div className="text-center space-y-1">
                 <h2 className="text-2xl font-bold text-white drop-shadow-md">{currentSong.title}</h2>
                 <p className="text-lg text-gray-400 font-medium">{currentSong.artist}</p>
                 <p className="text-xs text-gray-600 uppercase tracking-widest">{currentSong.album}</p>
             </div>
         </div>

         {/* Controls Bar */}
         <div className="relative z-10 bg-[#181818]/90 backdrop-blur-md border-t border-white/5 p-4 flex flex-col gap-4">
             {/* Progress */}
             <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                 <span>{formatTime(currentTime)}</span>
                 <input 
                    type="range" 
                    min="0" 
                    max={currentSong.durationSec} 
                    value={currentTime} 
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                 />
                 <span>{currentSong.duration}</span>
             </div>

             <div className="flex items-center justify-between">
                 {/* Volume (Hidden on small screens) */}
                 <div className="hidden md:flex items-center gap-2 w-32">
                     <Icon name="Volume2" size={16} className="text-gray-400" />
                     <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-gray-400 [&::-webkit-slider-thumb]:rounded-full"
                     />
                 </div>

                 {/* Main Controls */}
                 <div className="flex items-center gap-6 mx-auto md:mx-0">
                     <button 
                        onClick={() => setShuffle(!shuffle)}
                        className={`p-2 rounded-full transition-colors ${shuffle ? 'text-cyan-400' : 'text-gray-500 hover:text-white'}`}
                     >
                         <Icon name="RotateCw" size={18} className="rotate-90" /> {/* Simulate shuffle icon with rotate if specific icon missing */}
                     </button>

                     <button onClick={handlePrev} className="text-gray-300 hover:text-white transition-colors">
                         <Icon name="SkipBack" size={28} className="fill-current" />
                     </button>

                     <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cyan-900/20"
                     >
                         <Icon name={isPlaying ? "Pause" : "Play"} size={28} className="fill-current" />
                     </button>

                     <button onClick={handleNext} className="text-gray-300 hover:text-white transition-colors">
                         <Icon name="SkipForward" size={28} className="fill-current" />
                     </button>

                     <button 
                        onClick={() => setRepeat(!repeat)}
                        className={`p-2 rounded-full transition-colors ${repeat ? 'text-cyan-400' : 'text-gray-500 hover:text-white'}`}
                     >
                         <Icon name="RotateCw" size={18} />
                     </button>
                 </div>

                 {/* Playlist Toggle (Visible only on mobile usually, or placeholder) */}
                 <div className="w-32 flex justify-end">
                     <button className="text-gray-400 hover:text-white">
                         <Icon name="MessageCircle" size={20} /> {/* Lyrics placeholder */}
                     </button>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};