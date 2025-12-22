import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../components/Icon';

interface VideoFile {
  name: string;
  url: string;
  duration: string;
  size: string;
}

const LOCAL_VIDEOS: VideoFile[] = [
  { name: "Big Buck Bunny.mp4", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", duration: "9:56", size: "128 MB" },
  { name: "Elephant Dream.mp4", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", duration: "10:53", size: "145 MB" },
  { name: "For Bigger Blazes.mp4", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", duration: "0:15", size: "12 MB" },
  { name: "For Bigger Escapes.mp4", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", duration: "0:15", size: "15 MB" },
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

  return (
    <div className="flex h-full bg-zinc-950 text-zinc-100 font-sans select-none">
      {/* Sidebar - File List */}
      <div className="w-64 bg-zinc-900 border-r border-white/10 flex flex-col">
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
              <div className="w-8 h-8 rounded bg-black/40 flex items-center justify-center flex-shrink-0">
                <Icon name="Play" size={14} className="fill-current" />
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
          4 Videos • 300 MB Used
        </div>
      </div>

      {/* Main Player Area */}
      <div className="flex-1 flex flex-col bg-black relative group">
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
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                   <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl hover:scale-110 transition-transform cursor-pointer">
                      <Icon name="Play" size={40} className="ml-2 fill-white text-white" />
                   </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="h-20 bg-gradient-to-t from-zinc-900 via-zinc-900 to-transparent px-6 pb-4 flex flex-col justify-end gap-2">
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
                 <div className="text-sm font-medium text-zinc-300">
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
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 space-y-4">
            <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Icon name="Film" size={40} className="opacity-50" />
            </div>
            <p className="text-lg font-medium">No Video Selected</p>
            <p className="text-sm max-w-xs text-center">Select a video from the library sidebar to begin playback.</p>
          </div>
        )}
      </div>
    </div>
  );
};