import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../components/Icon';

interface VideoFile {
  name: string;
  url: string;
  duration: string;
  size: string;
  thumbnail?: string;
}

const LOCAL_VIDEOS: VideoFile[] = [
  { name: "Big Buck Bunny: Forest Adventure", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", duration: "9:56", size: "128 MB", thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg" },
  { name: "Sintel: A Dragon's Tale", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", duration: "14:48", size: "210 MB", thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Sintel_poster.jpg/800px-Sintel_poster.jpg" },
  { name: "Elephant Dream: Machine World", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", duration: "10:53", size: "145 MB", thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Elephants_Dream_poster_-_01.jpg/800px-Elephants_Dream_poster_-_01.jpg" },
  { name: "Volcano Adventure (Short)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", duration: "0:15", size: "12 MB", thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop" },
  { name: "The Great Escape (Short)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", duration: "0:15", size: "15 MB", thumbnail: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=800&auto=format&fit=crop" },
];

export const VideoPlayer: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState<VideoFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (currentVideo && videoRef.current) {
      setIsPlaying(true);
      setProgress(0);
      
      // Explicitly load to ensure we are ready for the new source
      videoRef.current.load();

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Ignore AbortError which happens when switching videos quickly
          if (error.name !== 'AbortError') {
            console.error("Playback error:", error);
            setIsPlaying(false);
          }
        });
      }
    }
  }, [currentVideo]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((error) => {
              if (error.name !== 'AbortError') {
                console.error("Play toggle error:", error);
                setIsPlaying(false);
              }
            });
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      if (Number.isFinite(duration) && duration > 0) {
        const p = (videoRef.current.currentTime / duration) * 100;
        setProgress(p || 0);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      // Ensure duration is valid before setting currentTime to avoid non-finite errors
      if (Number.isFinite(duration)) {
        const time = (val / 100) * duration;
        videoRef.current.currentTime = time;
        setProgress(val);
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || !Number.isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const totalSize = LOCAL_VIDEOS.reduce((acc, vid) => acc + parseInt(vid.size), 0);

  return (
    <div className="flex h-full bg-zinc-950 text-zinc-100 font-sans select-none">
      {/* Sidebar - File List */}
      <div className="w-64 bg-zinc-900 border-r border-white/10 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <Icon name="Film" size={20} className="text-blue-400" />
          <span className="font-bold tracking-tight">Media Library</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {LOCAL_VIDEOS.map((vid) => (
            <button
              key={vid.name}
              onClick={() => setCurrentVideo(vid)}
              className={`w-full text-left p-3 rounded-lg text-sm flex items-center gap-3 transition-colors ${
                currentVideo?.name === vid.name 
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20' 
                  : 'hover:bg-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="w-8 h-8 rounded bg-black/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {vid.thumbnail ? (
                    <img src={vid.thumbnail} className="w-full h-full object-cover opacity-70" alt="" />
                ) : (
                    <Icon name="Play" size={14} className="fill-current" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium">{vid.name}</div>
                <div className="text-xs opacity-60 flex justify-between">
                  <span>{vid.duration}</span>
                  <span>{vid.size}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-white/10 text-xs text-center text-zinc-500">
          {LOCAL_VIDEOS.length} Videos • {totalSize} MB Used
        </div>
      </div>

      {/* Main Player Area */}
      <div className="flex-1 flex flex-col bg-black relative group overflow-hidden">
        {currentVideo ? (
          <>
            <div className="flex-1 relative flex items-center justify-center overflow-hidden" onClick={togglePlay}>
              <video
                ref={videoRef}
                src={currentVideo.url}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                crossOrigin="anonymous"
                playsInline
              />
              
              {/* Back Button Overlay */}
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentVideo(null); }}
                className="absolute top-4 left-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:text-white hover:bg-black/70 transition-all z-20"
              >
                <Icon name="SkipBack" size={20} />
              </button>

              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                   <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl hover:scale-110 transition-transform cursor-pointer">
                      <Icon name="Play" size={40} className="ml-2 fill-white text-white" />
                   </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="h-20 bg-gradient-to-t from-zinc-900 via-zinc-900 to-transparent px-6 pb-4 flex flex-col justify-end gap-2 z-20">
              <div className="flex items-center gap-3 text-xs font-medium text-zinc-400">
                 <span>{formatTime(videoRef.current?.currentTime || 0)}</span>
                 <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={progress} 
                  onChange={handleSeek}
                  className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                 />
                 <span>{formatTime(videoRef.current?.duration || 0)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="text-zinc-300 hover:text-white transition-colors">
                       <Icon name={isPlaying ? "Pause" : "Play"} size={24} className={isPlaying ? "fill-current" : "fill-current"} />
                    </button>
                    <div className="flex items-center gap-2">
                       <Icon name="Volume2" size={18} className="text-zinc-400" />
                       <input 
                         type="range" 
                         min="0" 
                         max="1" 
                         step="0.1"
                         value={volume}
                         onChange={(e) => {
                            const vol = parseFloat(e.target.value);
                            setVolume(vol);
                            if (videoRef.current) videoRef.current.volume = vol;
                         }}
                         className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-zinc-300 [&::-webkit-slider-thumb]:rounded-full"
                       />
                    </div>
                 </div>
                 <div className="text-sm font-medium text-zinc-300 truncate max-w-[200px]">
                    {currentVideo.name}
                 </div>
                 <div className="flex items-center gap-4">
                    <button className="text-zinc-400 hover:text-white"><Icon name="Settings" size={18} /></button>
                    <button className="text-zinc-400 hover:text-white"><Icon name="Maximize" size={18} /></button>
                 </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col bg-zinc-950 overflow-y-auto custom-scrollbar">
            {/* Home Dashboard */}
            
            {/* Watch Again Grid */}
            <div className="p-6">
                <h2 className="text-lg font-bold text-white mb-4">Library</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {LOCAL_VIDEOS.map((vid, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentVideo(vid)}
                            className="group flex flex-col gap-2 text-left"
                        >
                            <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden relative border border-white/5 group-hover:border-white/20 transition-all">
                                {vid.thumbnail ? (
                                    <img src={vid.thumbnail} alt={vid.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                        <Icon name="Film" size={32} />
                                    </div>
                                )}
                                <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-medium text-white">
                                    {vid.duration}
                                </div>
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <Icon name="Play" size={20} className="fill-white text-white ml-1" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-zinc-200 group-hover:text-blue-400 truncate transition-colors">{vid.name}</h3>
                                <p className="text-xs text-zinc-500">{vid.size}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Promo Banner */}
            <div className="px-6 pb-6">
                <div className="w-full h-32 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 relative overflow-hidden flex items-center px-8 border border-white/10 group cursor-pointer hover:shadow-lg hover:shadow-blue-900/20 transition-all">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=1000&auto=format&fit=crop')] opacity-20 mix-blend-overlay bg-cover bg-center group-hover:scale-105 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Coming Soon</div>
                        <h3 className="text-2xl font-bold text-white mb-2">Ocean Documentary 4K</h3>
                        <p className="text-sm text-blue-200/80 max-w-sm">Explore the deepest trenches of the Mariana with our new exclusive series.</p>
                    </div>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all">
                         <Icon name="Plus" size={24} />
                    </div>
                </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};