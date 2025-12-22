import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { AppID } from '../types';

interface PlayStoreProps {
  onOpenApp?: (appId: AppID) => void;
}

interface StoreApp {
  id: number;
  name: string;
  category: string;
  rating: number;
  icon: string;
  description: string;
  appId?: AppID; // Map to system AppID if launchable
}

const FEATURED_APP: StoreApp = {
  id: 0,
  name: "Abyss Run",
  category: "Games",
  rating: 4.9,
  icon: "Gamepad2",
  description: "Navigate the treacherous deep sea trenches in this high-speed endless runner. Avoid thermal vents and giant squids!"
};

const STORE_APPS: StoreApp[] = [
  { id: 1, name: "Coral Paint", category: "Creativity", rating: 4.8, icon: "Palette", description: "Digital art studio for marine life sketches." },
  { id: 2, name: "Tidal Wave", category: "Music", rating: 4.5, icon: "Music", description: "High fidelity ocean sounds and streaming." },
  { id: 3, name: "Sonar Social", category: "Social", rating: 4.2, icon: "Wifi", description: "Connect with other divers nearby." },
  { id: 4, name: "Kelp Keep", category: "Productivity", rating: 4.0, icon: "CheckSquare", description: "Organize your underwater tasks." },
  { id: 5, name: "Reef Maps", category: "Navigation", rating: 4.7, icon: "Map", description: "Detailed topography of the seabed." },
  { id: 6, name: "Shark Fin", category: "Finance", rating: 4.6, icon: "ShoppingBag", description: "Track your sand dollar expenses." },
  { id: 7, name: "Plants vs Zombies", category: "Strategy", rating: 4.8, icon: "Gamepad2", description: "Defend your home from fun-loving zombies using an arsenal of plants.", appId: AppID.PLANTS_VS_ZOMBIES },
  { id: 10, name: "Video Player", category: "Media", rating: 4.3, icon: "Film", description: "Play your local deep sea footage.", appId: AppID.VIDEO_PLAYER },
];

export const PlayStore: React.FC<PlayStoreProps> = ({ onOpenApp }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [installedApps, setInstalledApps] = useState<number[]>([7, 10]); // Pre-install PvZ, Video Player
  const [searchQuery, setSearchQuery] = useState('');
  const [processingApps, setProcessingApps] = useState<number[]>([]); // Tracks installs and uninstalls

  const handleInstall = (app: StoreApp) => {
    setProcessingApps(prev => [...prev, app.id]);
    
    // Simulate network delay
    setTimeout(() => {
      setInstalledApps(prev => [...prev, app.id]);
      setProcessingApps(prev => prev.filter(id => id !== app.id));
    }, 1500);
  };

  const handleUninstall = (appId: number) => {
    setProcessingApps(prev => [...prev, appId]);

    // Simulate uninstall delay
    setTimeout(() => {
      setInstalledApps(prev => prev.filter(id => id !== appId));
      setProcessingApps(prev => prev.filter(id => id !== appId));
    }, 1000);
  };

  const handleOpen = (app: StoreApp) => {
    if (app.appId && onOpenApp) {
      onOpenApp(app.appId);
    }
  };

  // Filter logic
  const allApps = [FEATURED_APP, ...STORE_APPS];
  const searchResults = allApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAppCard = (app: StoreApp) => {
    const isInstalled = installedApps.includes(app.id);
    const isProcessing = processingApps.includes(app.id);

    return (
      <div key={app.id} className="bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all group flex gap-4">
        <div className="w-16 h-16 rounded-xl bg-slate-700/50 flex items-center justify-center text-cyan-500 shadow-md group-hover:scale-105 transition-transform">
          <Icon name={app.icon} size={32} />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-semibold text-slate-100">{app.name}</h4>
            <p className="text-xs text-slate-400 line-clamp-1">{app.category}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
             <div className="flex items-center gap-1 text-xs text-slate-300">
                <span className="text-slate-500">{app.rating}</span>
                <Icon name="Star" size={10} className="text-slate-500 fill-slate-500" />
             </div>
             
             <div className="flex items-center gap-2">
               {isInstalled && (
                 <button
                    onClick={(e) => { e.stopPropagation(); if(!isProcessing) handleUninstall(app.id); }}
                    disabled={isProcessing}
                    className="p-1.5 rounded-full bg-slate-700 hover:bg-red-900/40 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    title="Uninstall"
                 >
                    <Icon name="Trash2" size={14} />
                 </button>
               )}
               
               <button 
                 onClick={() => isInstalled ? handleOpen(app) : handleInstall(app)}
                 // Disable if processing OR (installed but we can't open it because it's just a mockup app with no ID)
                 disabled={isProcessing || (isInstalled && !app.appId)}
                 className={`text-xs px-4 py-1.5 rounded-full font-medium transition-colors min-w-[70px]
                   ${isInstalled 
                     ? 'bg-slate-700 hover:bg-slate-600 text-blue-400 border border-blue-500/30' 
                     : 'bg-slate-700 hover:bg-blue-600 text-blue-100 hover:text-white'
                   } disabled:opacity-50 disabled:cursor-not-allowed`}
               >
                 {isProcessing ? (isInstalled ? '...' : '...') : (isInstalled ? 'Open' : 'Install')}
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-[#1e293b] text-slate-200 font-sans select-none">
      {/* Sidebar */}
      <div className="w-48 bg-[#0f172a] border-r border-slate-700/50 flex flex-col">
        <div className="p-6 flex items-center gap-2 text-cyan-400">
          <Icon name="ShoppingBag" size={24} />
          <span className="font-bold text-lg tracking-tight">Play Store</span>
        </div>
        
        <nav className="flex-1 px-3 space-y-1">
          {['Home', 'Games', 'Apps', 'Updates'].map((item) => (
            <button
              key={item}
              onClick={() => { setActiveTab(item.toLowerCase()); setSearchQuery(''); }}
              className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === item.toLowerCase() 
                  ? 'bg-blue-600/20 text-blue-400' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
           <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-800/50">
              <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-xs font-bold text-cyan-400">D</div>
              <div className="text-xs">
                 <div className="text-slate-200 font-medium">Diver</div>
                 <div className="text-slate-500">1200 Shells</div>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Header / Search */}
        <div className="sticky top-0 z-10 bg-[#1e293b]/95 backdrop-blur-md p-4 border-b border-slate-700/50">
          <div className="relative max-w-xl mx-auto">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search apps, games, movies..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500"
            />
          </div>
        </div>

        <div className="p-6 space-y-8 max-w-5xl mx-auto">
          {searchQuery ? (
             <div>
               <h3 className="text-lg font-semibold text-white mb-4">Search results for "{searchQuery}"</h3>
               {searchResults.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {searchResults.map(renderAppCard)}
                 </div>
               ) : (
                 <div className="text-center py-12 text-slate-500">
                    <Icon name="Search" size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No applications found matching your criteria.</p>
                 </div>
               )}
             </div>
          ) : (
            <>
              {/* Featured Hero */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 shadow-xl border border-white/10">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=2832&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
                <div className="relative p-8 flex flex-col md:flex-row gap-6 items-center">
                   <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/10 backdrop-blur-sm shadow-lg">
                     <Icon name={FEATURED_APP.icon} size={64} className="text-cyan-400" />
                   </div>
                   <div className="flex-1 text-center md:text-left space-y-2">
                     <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 uppercase tracking-wider">Featured Game</div>
                     <h2 className="text-3xl font-bold text-white">{FEATURED_APP.name}</h2>
                     <p className="text-slate-300 text-sm max-w-md">{FEATURED_APP.description}</p>
                     <div className="flex items-center justify-center md:justify-start gap-1 text-yellow-400 text-sm py-1">
                        {[1,2,3,4,5].map(i => <Icon key={i} name="Star" size={14} className="fill-current" />)}
                        <span className="text-slate-400 ml-2 text-xs">4.9 • Action</span>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-3">
                     {installedApps.includes(FEATURED_APP.id) && (
                         <button 
                            onClick={() => handleUninstall(FEATURED_APP.id)}
                            disabled={processingApps.includes(FEATURED_APP.id)}
                            className="p-3 rounded-full bg-slate-800 hover:bg-red-900/40 border border-white/10 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                            title="Uninstall"
                         >
                            <Icon name="Trash2" size={20} />
                         </button>
                     )}
                     <button 
                        onClick={() => installedApps.includes(FEATURED_APP.id) ? handleOpen(FEATURED_APP) : handleInstall(FEATURED_APP)}
                        disabled={processingApps.includes(FEATURED_APP.id) || (installedApps.includes(FEATURED_APP.id) && !FEATURED_APP.appId)}
                        className={`px-8 py-3 rounded-full font-medium transition-all shadow-lg active:scale-95 flex items-center gap-2
                          ${installedApps.includes(FEATURED_APP.id) 
                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-white/10' 
                            : 'bg-cyan-500 hover:bg-cyan-400 text-black hover:shadow-cyan-500/25'
                          } disabled:opacity-50`}
                     >
                       {processingApps.includes(FEATURED_APP.id) 
                          ? 'Processing...' 
                          : (installedApps.includes(FEATURED_APP.id) ? 'Open' : 'Install')}
                     </button>
                   </div>
                </div>
              </div>

              {/* Recommended Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Recommended for you</h3>
                  <button className="text-xs text-blue-400 hover:text-blue-300">See all</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {STORE_APPS.map(renderAppCard)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};