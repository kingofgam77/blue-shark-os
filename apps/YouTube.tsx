import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface Video {
  id: string;
  title: string;
  channel: string;
  views: string;
  thumbnail: string;
  duration: string;
}

// Highly reliable, embed-friendly video IDs (Official Channels)
const MOCK_VIDEOS: Video[] = [
  { id: 'jfKfPfyJRdk', title: 'lofi hip hop radio - beats to relax/study to', channel: 'Lofi Girl', views: 'Live', thumbnail: 'https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg', duration: 'LIVE' },
  { id: 'LXb3EKWsInQ', title: 'COSTA RICA IN 4K 60fps HDR', channel: 'Jacob & Katie Schwarz', views: '110M views', thumbnail: 'https://img.youtube.com/vi/LXb3EKWsInQ/hqdefault.jpg', duration: '5:14' },
  { id: 'aqz-KE-bpKQ', title: 'Big Buck Bunny', channel: 'Blender Foundation', views: '12M views', thumbnail: 'https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg', duration: '9:56' },
  { id: 'Bey4XXJAqS8', title: 'Relaxing Ocean Sounds', channel: 'Nature Sound', views: '45M views', thumbnail: 'https://img.youtube.com/vi/Bey4XXJAqS8/hqdefault.jpg', duration: '10:00' },
  { id: 'ysz5S6PUM-U', title: 'Foo Fighters - The Pretender', channel: 'Foo Fighters', views: '550M views', thumbnail: 'https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg', duration: '4:31' },
  { id: 'jNQXAC9IVRw', title: 'Me at the zoo', channel: 'jawed', views: '300M views', thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg', duration: '0:18' },
];

const MOCK_SHORTS: Video[] = [
  { id: 'tOcd2G12t50', title: 'Cute Baby Turtle 🐢', channel: 'NatureShorts', views: '15M views', thumbnail: 'https://img.youtube.com/vi/tOcd2G12t50/hqdefault.jpg', duration: '0:59' },
  { id: 'C7hT-3Wq0x4', title: 'Beautiful Coral Reef', channel: 'OceanLife', views: '2.5M views', thumbnail: 'https://img.youtube.com/vi/C7hT-3Wq0x4/hqdefault.jpg', duration: '0:45' },
  { id: 'VrQxR392x6E', title: 'Shark Close Encounter', channel: 'OceanHeroes', views: '1.2M views', thumbnail: 'https://img.youtube.com/vi/VrQxR392x6E/hqdefault.jpg', duration: '1:00' },
  { id: 'J_CFBjAyPOn', title: 'Jellyfish Swimming', channel: 'DeepBlue', views: '500K views', thumbnail: 'https://img.youtube.com/vi/J_CFBjAyPOn/hqdefault.jpg', duration: '0:15' },
];

const CustomPlayer: React.FC<{ video: Video }> = ({ video }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 z-10">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-0">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <iframe 
        key={video.id}
        onLoad={() => setLoading(false)}
        width="100%" 
        height="100%" 
        // mute=1 is CRITICAL for autoplay to work in modern browsers without user interaction on the frame
        src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1`} 
        title={video.title}
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="w-full h-full pointer-events-auto relative z-10"
      />
    </div>
  );
};

export const YouTube: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const handleVideoClick = (video: Video) => {
    setCurrentVideo(video);
  };

  const handleHomeClick = () => {
    setCurrentVideo(null);
    setActiveTab('home');
    setSearch('');
  };

  const filteredVideos = MOCK_VIDEOS.filter(video => 
    video.title.toLowerCase().includes(search.toLowerCase()) ||
    video.channel.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full bg-[#0f0f0f] text-white font-sans select-none">
      {/* Sidebar - Compact */}
      <div className="w-16 md:w-20 flex-shrink-0 flex flex-col items-center py-4 space-y-6 bg-[#0f0f0f] border-r border-white/5">
        <button 
          onClick={handleHomeClick} 
          className={`flex flex-col items-center gap-1 text-xs w-full py-3 rounded-lg transition-colors ${activeTab === 'home' ? 'text-white bg-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
        >
          <Icon name="ShoppingBag" size={24} className="mb-1" />
          <span>Home</span>
        </button>
        <button 
          onClick={() => { setActiveTab('shorts'); setCurrentVideo(null); }}
          className={`flex flex-col items-center gap-1 text-xs w-full py-3 rounded-lg transition-colors ${activeTab === 'shorts' ? 'text-white bg-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
        >
          <Icon name="Music" size={24} className="mb-1" />
          <span>Shorts</span>
        </button>
        <button 
          onClick={() => { setActiveTab('subs'); setCurrentVideo(null); }}
          className={`flex flex-col items-center gap-1 text-xs w-full py-3 rounded-lg transition-colors ${activeTab === 'subs' ? 'text-white bg-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
        >
          <Icon name="Square" size={24} className="mb-1" />
          <span>Subs</span>
        </button>
        <button 
          onClick={() => { setActiveTab('you'); setCurrentVideo(null); }}
          className={`flex flex-col items-center gap-1 text-xs w-full py-3 rounded-lg transition-colors ${activeTab === 'you' ? 'text-white bg-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
        >
          <Icon name="FileText" size={24} className="mb-1" />
          <span>You</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/5 bg-[#0f0f0f]/95 backdrop-blur-sm z-10">
           <div className="flex items-center gap-1 cursor-pointer" onClick={handleHomeClick}>
             <div className="w-8 h-5 bg-red-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-white border-b-[3px] border-b-transparent ml-0.5 z-10"></div>
             </div>
             <span className="text-lg font-bold tracking-tighter">YouTube</span>
           </div>

           <div className="flex-1 max-w-xl mx-4">
              <div className="flex relative group">
                 <input 
                   type="text" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   onKeyDown={(e) => { if(e.key === 'Enter') setCurrentVideo(null); }}
                   placeholder="Search"
                   className="w-full bg-[#121212] border border-[#303030] rounded-l-full px-4 py-2 focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm shadow-inner group-focus-within:border-blue-500"
                 />
                 <button className="bg-[#222] border border-l-0 border-[#303030] rounded-r-full px-5 hover:bg-[#303030] transition-colors">
                    <Icon name="Search" size={20} className="text-gray-400" />
                 </button>
              </div>
           </div>

           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-sm font-medium border border-white/10 shadow-lg">
              D
           </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#0f0f0f]">
          {activeTab !== 'home' && !currentVideo ? (
            activeTab === 'shorts' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {MOCK_SHORTS.map(short => (
                        <div key={short.id} onClick={() => handleVideoClick(short)} className="cursor-pointer group relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-800 shadow-lg ring-1 ring-white/5 hover:ring-white/20 transition-all">
                            <img src={short.thumbnail} alt={short.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 opacity-80" />
                            
                            <div className="absolute bottom-3 left-3 right-3">
                                <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2 drop-shadow-md">{short.title}</h3>
                                <div className="text-xs text-gray-300 font-medium">{short.views}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                    <Icon name={activeTab === 'subs' ? 'Square' : 'FileText'} size={48} className="opacity-20" />
                    <p>This section is under construction.</p>
                    <button onClick={handleHomeClick} className="text-blue-400 hover:text-blue-300 text-sm">Return Home</button>
                </div>
            )
          ) : currentVideo ? (
            <div className="flex flex-col h-full max-w-6xl mx-auto animate-in fade-in duration-300">
               
               {/* Custom Player Component */}
               <CustomPlayer video={currentVideo} />

               <div className="space-y-3 px-1 mt-4">
                  <h1 className="text-xl font-bold line-clamp-2">{currentVideo.title}</h1>
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-4 gap-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center font-bold text-lg shadow-md">
                           {currentVideo.channel[0]}
                        </div>
                        <div>
                           <div className="font-semibold text-sm">{currentVideo.channel}</div>
                           <div className="text-xs text-gray-400">1.2M subscribers</div>
                        </div>
                        <button className="ml-4 bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                           Subscribe
                        </button>
                     </div>
                     <div className="flex gap-2">
                        <button className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] px-3 py-1.5 rounded-full text-sm transition-colors">
                           <Icon name="Check" size={16} />
                           {currentVideo.views.split(' ')[0]}
                        </button>
                        <button className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] px-3 py-1.5 rounded-full text-sm transition-colors">
                           <Icon name="Download" size={16} />
                           Download
                        </button>
                     </div>
                  </div>
               </div>
               
               <div className="mt-6 px-1">
                  <h3 className="text-lg font-semibold mb-4">Up Next</h3>
                  <div className="space-y-3">
                     {MOCK_VIDEOS.filter(v => v.id !== currentVideo.id).map(video => (
                        <div key={video.id} onClick={() => handleVideoClick(video)} className="flex gap-2 cursor-pointer group hover:bg-white/5 p-2 rounded-xl transition-colors">
                           <div className="relative w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              <span className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[10px] font-medium">{video.duration}</span>
                           </div>
                           <div className="flex-1 py-1">
                              <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-400 transition-colors">{video.title}</h4>
                              <p className="text-xs text-gray-400 mt-1">{video.channel}</p>
                              <p className="text-xs text-gray-400">{video.views}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          ) : (
            <>
              {filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {filteredVideos.map(video => (
                    <div key={video.id} onClick={() => handleVideoClick(video)} className="cursor-pointer group">
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800 mb-3 group-hover:ring-2 ring-white/20 transition-all shadow-lg">
                          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs font-medium">
                              {video.duration}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-300">
                              {video.channel[0]}
                          </div>
                          <div className="flex-1">
                              <h3 className="text-sm font-semibold text-white leading-tight mb-1 group-hover:text-blue-400 transition-colors line-clamp-2">
                                {video.title}
                              </h3>
                              <div className="text-xs text-gray-400">
                                {video.channel}
                                <div className="flex items-center gap-1">
                                    <span>{video.views}</span>
                                    <span className="text-[10px]">•</span>
                                    <span>Recently</span>
                                </div>
                              </div>
                          </div>
                        </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Icon name="Search" size={48} className="mb-4 opacity-20" />
                  <p>No videos found for "{search}"</p>
                  <button onClick={() => setSearch('')} className="mt-2 text-blue-400 hover:underline text-sm">Clear search</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};