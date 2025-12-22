import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { AppID, AppConfig } from '../types';

export const WALLPAPERS = [
  { id: 'shark1', url: "https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=2832&auto=format&fit=crop", name: "Deep Blue" },
  { id: 'shark2', url: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?q=80&w=2900&auto=format&fit=crop", name: "Reef Light" },
  { id: 'shark3', url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=2940&auto=format&fit=crop", name: "Dark Abyss" },
  { id: 'jelly', url: "https://images.unsplash.com/photo-1498931299472-f7a63a02f63a?q=80&w=2940&auto=format&fit=crop", name: "Jellyfish Glow" },
];

export interface ClockConfig {
  is24Hour: boolean;
  showSeconds: boolean;
  showDate: boolean;
}

interface SettingsProps {
  currentWallpaper: string;
  onWallpaperChange: (url: string) => void;
  appsConfig: Record<AppID, AppConfig>;
  desktopApps: AppID[];
  setDesktopApps: (apps: AppID[]) => void;
  pinnedApps: AppID[];
  setPinnedApps: (apps: AppID[]) => void;
  clockConfig: ClockConfig;
  setClockConfig: (config: ClockConfig) => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  currentWallpaper, 
  onWallpaperChange,
  appsConfig,
  desktopApps,
  setDesktopApps,
  pinnedApps,
  setPinnedApps,
  clockConfig,
  setClockConfig
}) => {
  const [activeTab, setActiveTab] = useState('personalization');
  const [previewTime, setPreviewTime] = useState(new Date());
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setPreviewTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDesktopApp = (id: AppID) => {
    if (desktopApps.includes(id)) {
      setDesktopApps(desktopApps.filter(appId => appId !== id));
    } else {
      setDesktopApps([...desktopApps, id]);
    }
  };

  const togglePinnedApp = (id: AppID) => {
    if (pinnedApps.includes(id)) {
      setPinnedApps(pinnedApps.filter(appId => appId !== id));
    } else {
      setPinnedApps([...pinnedApps, id]);
    }
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onWallpaperChange(customUrl.trim());
    }
  };

  return (
    <div className="flex h-full bg-slate-900 text-slate-200">
      {/* Sidebar */}
      <div className="w-48 bg-slate-950/50 border-r border-white/5 p-4 flex flex-col gap-2">
        <button
          onClick={() => setActiveTab('personalization')}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activeTab === 'personalization' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-slate-400'}`}
        >
          <Icon name="Image" size={16} />
          Personalization
        </button>
        <button
          onClick={() => setActiveTab('apps')}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activeTab === 'apps' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-slate-400'}`}
        >
          <Icon name="CheckSquare" size={16} />
          Apps
        </button>
        <button
          onClick={() => setActiveTab('time')}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activeTab === 'time' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-slate-400'}`}
        >
          <Icon name="Clock" size={16} />
          Date & Time
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activeTab === 'system' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-slate-400'}`}
        >
          <Icon name="Cpu" size={16} />
          System
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'personalization' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Desktop Background</h2>
              <p className="text-sm text-slate-500">Choose your preferred ocean or cyber view.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {WALLPAPERS.map(wp => (
                <div 
                  key={wp.id} 
                  onClick={() => onWallpaperChange(wp.url)}
                  className={`
                    relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all group
                    ${currentWallpaper === wp.url ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent hover:border-white/20'}
                  `}
                >
                  <img src={wp.url} alt={wp.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-xs font-medium text-white">{wp.name}</span>
                  </div>
                  {currentWallpaper === wp.url && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full shadow-lg">
                       <Icon name="Check" size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5">
                <h3 className="text-sm font-medium mb-2 text-slate-300">Custom Wallpaper</h3>
                <form onSubmit={handleCustomUrlSubmit} className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Paste image URL here..." 
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        className="flex-1 bg-slate-800/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none placeholder-slate-500"
                    />
                    <button 
                        type="submit"
                        disabled={!customUrl.trim()}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Set
                    </button>
                </form>
            </div>
          </div>
        )}

        {activeTab === 'apps' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">App Customization</h2>
              <p className="text-sm text-slate-500">Manage desktop shortcuts and taskbar pins.</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg border border-white/5 overflow-hidden">
              <div className="grid grid-cols-[1fr_100px_100px] gap-4 p-4 border-b border-white/10 bg-slate-800/80 text-xs font-medium text-slate-400 uppercase tracking-wider">
                <div>Application</div>
                <div className="text-center">Desktop</div>
                <div className="text-center">Taskbar</div>
              </div>
              
              <div className="divide-y divide-white/5">
                {/* Fixed: Cast Object.values to AppConfig[] to avoid 'unknown' type error */}
                {(Object.values(appsConfig) as AppConfig[]).map((app) => (
                  <div key={app.id} className="grid grid-cols-[1fr_100px_100px] gap-4 p-4 items-center hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-slate-700/50 flex items-center justify-center text-blue-400">
                        <Icon name={app.icon} size={16} />
                      </div>
                      <span className="text-sm font-medium">{app.title}</span>
                    </div>
                    
                    <div className="flex justify-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={desktopApps.includes(app.id)}
                          onChange={() => toggleDesktopApp(app.id)}
                        />
                        <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex justify-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={pinnedApps.includes(app.id)}
                          onChange={() => togglePinnedApp(app.id)}
                        />
                        <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'time' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Date & Time</h2>
              <p className="text-sm text-slate-500">Customize your system clock.</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg border border-white/5 divide-y divide-white/5">
                {/* 24-Hour Time Toggle */}
                <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div>
                        <div className="font-medium text-sm">24-Hour Format</div>
                        <div className="text-xs text-slate-400">Use 13:00 instead of 1:00 PM</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={clockConfig.is24Hour}
                          onChange={(e) => setClockConfig({...clockConfig, is24Hour: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                {/* Show Seconds Toggle */}
                <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div>
                        <div className="font-medium text-sm">Show Seconds</div>
                        <div className="text-xs text-slate-400">Display seconds in the taskbar clock</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={clockConfig.showSeconds}
                          onChange={(e) => setClockConfig({...clockConfig, showSeconds: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                 {/* Show Date Toggle */}
                <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div>
                        <div className="font-medium text-sm">Show Date</div>
                        <div className="text-xs text-slate-400">Display the date below the time</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={clockConfig.showDate}
                          onChange={(e) => setClockConfig({...clockConfig, showDate: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold ml-1">Taskbar Preview</span>
                <div className="bg-slate-900/80 backdrop-blur-lg border border-white/10 p-3 rounded-lg flex justify-end items-center">
                   <div className="flex items-center gap-3 px-3 border-r border-white/10 mr-3">
                        <div className="flex gap-2 text-slate-400">
                        <Icon name="Wifi" size={14} />
                        <Icon name="Volume2" size={14} />
                        <Icon name="Battery" size={14} />
                        </div>
                    </div>
                    <div className="text-right flex flex-col justify-center">
                        <div className="text-xs font-medium text-slate-200 leading-tight">
                            {previewTime.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit', 
                                second: clockConfig.showSeconds ? '2-digit' : undefined, 
                                hour12: !clockConfig.is24Hour 
                            })}
                        </div>
                        {clockConfig.showDate && (
                            <div className="text-[10px] text-slate-400 leading-tight">
                                {previewTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
             <div>
              <h2 className="text-xl font-semibold mb-1">About Blue Shark OS</h2>
              <p className="text-sm text-slate-500">System information and status.</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-900/50">
                        BS
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Blue Shark OS</h3>
                        <p className="text-xs text-slate-400">Version 2.5 (Deep Dive)</p>
                    </div>
                </div>
                <div className="h-px bg-white/10" />
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Build</span>
                        <span>2501.a</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Kernel</span>
                        <span className="font-mono text-cyan-400">Hydro-Core v1.0</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Registered to</span>
                        <span>Diver</span>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};