import React, { useState, useEffect } from 'react';
import { AppID, AppConfig, WindowState } from './types';
import { WindowFrame } from './components/WindowFrame';
import { Icon } from './components/Icon';
import { BootScreen } from './components/BootScreen';
import { SharkChat } from './apps/SharkChat';
import { DeepNotes } from './apps/DeepNotes';
import { SystemInfo } from './apps/SystemInfo';
import { OceanGallery } from './apps/OceanGallery';
import { Settings } from './apps/Settings';
import { PlayStore } from './apps/PlayStore';
import { PlantsVsZombies } from './apps/PlantsVsZombies';
import { VideoPlayer } from './apps/VideoPlayer';
import { SharkShare } from './apps/SharkShare';
import { MusicPlayer } from './apps/MusicPlayer';

// -- Constants --
const APPS: Record<AppID, AppConfig> = {
  [AppID.SHARK_BRAIN]: { id: AppID.SHARK_BRAIN, title: 'Shark Brain', icon: 'MessageCircle', defaultWidth: 400, defaultHeight: 600 },
  [AppID.DEEP_NOTES]: { id: AppID.DEEP_NOTES, title: 'Deep Notes', icon: 'FileText', defaultWidth: 600, defaultHeight: 400 },
  [AppID.OCEAN_GALLERY]: { id: AppID.OCEAN_GALLERY, title: 'Gallery', icon: 'Image', defaultWidth: 700, defaultHeight: 500 },
  [AppID.SYSTEM_STATUS]: { id: AppID.SYSTEM_STATUS, title: 'System Info', icon: 'Cpu', defaultWidth: 400, defaultHeight: 450 },
  [AppID.SETTINGS]: { id: AppID.SETTINGS, title: 'Settings', icon: 'Settings', defaultWidth: 700, defaultHeight: 500 },
  [AppID.PLAY_STORE]: { id: AppID.PLAY_STORE, title: 'Play Store', icon: 'ShoppingBag', defaultWidth: 900, defaultHeight: 650 },
  [AppID.PLANTS_VS_ZOMBIES]: { id: AppID.PLANTS_VS_ZOMBIES, title: 'Plants vs Zombies', icon: 'Gamepad2', defaultWidth: 800, defaultHeight: 600 },
  [AppID.VIDEO_PLAYER]: { id: AppID.VIDEO_PLAYER, title: 'Video Player', icon: 'Film', defaultWidth: 800, defaultHeight: 550 },
  [AppID.SHARK_SHARE]: { id: AppID.SHARK_SHARE, title: 'Shark Share', icon: 'Share2', defaultWidth: 600, defaultHeight: 550 },
  [AppID.MUSIC_PLAYER]: { id: AppID.MUSIC_PLAYER, title: 'Music', icon: 'Music', defaultWidth: 800, defaultHeight: 600 },
};

const DEFAULT_WALLPAPER = "https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=2832&auto=format&fit=crop";

const INITIAL_NETWORKS = [
  { ssid: 'Blue Shark Net', secured: true },
  { ssid: 'Deep Sea Link', secured: true },
  { ssid: 'Coral Reef Guest', secured: false },
  { ssid: 'Atlantis Public', secured: true },
  { ssid: 'Mariana Trench Research', secured: true },
];

type SystemState = 'BOOTING' | 'RUNNING' | 'OFF';
type PowerMode = 'saver' | 'balanced' | 'performance';

const App: React.FC = () => {
  const [systemState, setSystemState] = useState<SystemState>('BOOTING');
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wallpaper, setWallpaper] = useState(DEFAULT_WALLPAPER);

  // Customization State
  const [desktopAppIds, setDesktopAppIds] = useState<AppID[]>([
    AppID.SHARK_BRAIN, 
    AppID.DEEP_NOTES, 
    AppID.OCEAN_GALLERY, 
    AppID.SYSTEM_STATUS, 
    AppID.SETTINGS, 
    AppID.PLAY_STORE,
    AppID.VIDEO_PLAYER,
    AppID.SHARK_SHARE,
    AppID.MUSIC_PLAYER
  ]);

  const [pinnedAppIds, setPinnedAppIds] = useState<AppID[]>([
    AppID.SHARK_BRAIN,
    AppID.SHARK_SHARE,
    AppID.MUSIC_PLAYER,
    AppID.SETTINGS
  ]);

  // Clock Configuration State
  const [clockConfig, setClockConfig] = useState({
    is24Hour: false,
    showSeconds: false,
    showDate: true
  });

  // Wifi State
  const [wifiMenuOpen, setWifiMenuOpen] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [connectedNetwork, setConnectedNetwork] = useState<string | null>('Blue Shark Net');
  const [connectingNetwork, setConnectingNetwork] = useState<string | null>(null);
  const [networks, setNetworks] = useState(INITIAL_NETWORKS);
  const [isAddingWifi, setIsAddingWifi] = useState(false);
  const [newWifiSsid, setNewWifiSsid] = useState('');
  const [newWifiPass, setNewWifiPass] = useState('');

  // Volume State
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeMenuOpen, setVolumeMenuOpen] = useState(false);

  // Battery State
  const [batteryMenuOpen, setBatteryMenuOpen] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(84);
  const [isCharging, setIsCharging] = useState(false);
  const [powerMode, setPowerMode] = useState<PowerMode>('balanced');

  // Boot Sequence Logic
  useEffect(() => {
    let bootTimer: ReturnType<typeof setTimeout>;
    if (systemState === 'BOOTING') {
      bootTimer = setTimeout(() => {
        setSystemState('RUNNING');
      }, 4000); // 4 seconds boot time
    }
    return () => clearTimeout(bootTimer);
  }, [systemState]);

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleShutdown = () => {
    setStartMenuOpen(false);
    setWindows([]); // Close all windows
    setSystemState('OFF');
  };

  const handleRestart = () => {
    setStartMenuOpen(false);
    setWindows([]);
    setSystemState('OFF');
    setTimeout(() => {
        setSystemState('BOOTING');
    }, 1000);
  };

  const handlePowerOn = () => {
    setSystemState('BOOTING');
  };

  const openApp = (appId: AppID) => {
    const config = APPS[appId];
    const newId = `${appId}-${Date.now()}`;
    const newZ = windows.length > 0 ? Math.max(...windows.map(w => w.zIndex)) + 1 : 10;
    
    // Stagger position slightly
    const offset = windows.length * 20;
    
    const newWindow: WindowState = {
      id: newId,
      appId,
      title: config.title,
      x: 100 + (offset % 200),
      y: 50 + (offset % 200),
      width: config.defaultWidth,
      height: config.defaultHeight,
      zIndex: newZ,
      isMinimized: false,
      isMaximized: false
    };

    setWindows([...windows, newWindow]);
    setActiveWindowId(newId);
    setStartMenuOpen(false);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex), 0);
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
    });
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
  };

  const maximizeWindow = (id: string) => {
    // Simplified maximize logic
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      if (w.isMaximized) {
        return { ...w, width: APPS[w.appId].defaultWidth, height: APPS[w.appId].defaultHeight, x: 100, y: 50, isMaximized: false };
      } else {
        return { ...w, width: window.innerWidth, height: window.innerHeight - 48, x: 0, y: 0, isMaximized: true };
      }
    }));
    focusWindow(id);
  };

  const restoreWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false } : w));
    focusWindow(id);
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  };

  // Helper to handle pinning/unpinning behavior
  const handlePinnedAppClick = (appId: AppID) => {
    // Check if already running
    const runningInstance = windows.find(w => w.appId === appId && !w.isMinimized);
    if (runningInstance) {
      focusWindow(runningInstance.id);
    } else {
       // Check minimized
       const minimizedInstance = windows.find(w => w.appId === appId && w.isMinimized);
       if(minimizedInstance) {
           restoreWindow(minimizedInstance.id);
       } else {
           openApp(appId);
       }
    }
  };

  const renderAppContent = (appId: AppID) => {
    switch (appId) {
      case AppID.SHARK_BRAIN: return <SharkChat />;
      case AppID.DEEP_NOTES: return <DeepNotes />;
      case AppID.SYSTEM_STATUS: return <SystemInfo />;
      case AppID.OCEAN_GALLERY: return <OceanGallery onShare={() => handlePinnedAppClick(AppID.SHARK_SHARE)} />;
      case AppID.SETTINGS: return (
        <Settings 
          currentWallpaper={wallpaper} 
          onWallpaperChange={setWallpaper}
          appsConfig={APPS}
          desktopApps={desktopAppIds}
          setDesktopApps={setDesktopAppIds}
          pinnedApps={pinnedAppIds}
          setPinnedApps={setPinnedAppIds}
          clockConfig={clockConfig}
          setClockConfig={setClockConfig}
        />
      );
      case AppID.PLAY_STORE: return <PlayStore onOpenApp={openApp} />;
      case AppID.PLANTS_VS_ZOMBIES: return <PlantsVsZombies />;
      case AppID.VIDEO_PLAYER: return <VideoPlayer />;
      case AppID.SHARK_SHARE: return <SharkShare />;
      case AppID.MUSIC_PLAYER: return <MusicPlayer />;
      default: return null;
    }
  };

  // Wifi Handlers
  const handleWifiToggle = () => {
    setWifiEnabled(!wifiEnabled);
    if (wifiEnabled) { // Turning off
      setConnectedNetwork(null);
      setConnectingNetwork(null);
      setIsAddingWifi(false);
    } else { // Turning on
      // Simulate auto-connect
      setTimeout(() => setConnectedNetwork('Blue Shark Net'), 1500);
    }
  };

  const handleNetworkConnect = (ssid: string) => {
    if (ssid === connectedNetwork || !wifiEnabled) return;
    setConnectingNetwork(ssid);
    setTimeout(() => {
      setConnectedNetwork(ssid);
      setConnectingNetwork(null);
    }, 2000);
  };

  const handleAddNetwork = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newWifiSsid.trim()) return;

      const newNet = { ssid: newWifiSsid.trim(), secured: !!newWifiPass.trim() };
      setNetworks(prev => [newNet, ...prev]);
      setIsAddingWifi(false);
      setNewWifiSsid('');
      setNewWifiPass('');
      handleNetworkConnect(newNet.ssid);
  };

  // Volume Handlers
  const getVolumeIcon = () => {
      if (isMuted || volume === 0) return "VolumeX";
      if (volume < 30) return "Volume";
      if (volume < 70) return "Volume1";
      return "Volume2";
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVol = parseInt(e.target.value);
      setVolume(newVol);
      if (newVol > 0 && isMuted) setIsMuted(false);
      if (newVol === 0) setIsMuted(true);
  };

  // Battery Helper
  const getBatteryIcon = () => {
    if (isCharging) return "BatteryCharging";
    return "Battery";
  };

  // -- RENDER STATES --

  if (systemState === 'OFF') {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <button 
          onClick={handlePowerOn}
          className="group flex flex-col items-center gap-4 text-zinc-700 hover:text-cyan-500 transition-colors duration-500"
        >
          <div className="p-4 rounded-full border-2 border-zinc-800 group-hover:border-cyan-500/50 group-hover:bg-cyan-900/10 transition-all">
            <Icon name="Power" size={32} />
          </div>
          <span className="text-sm tracking-widest font-mono opacity-0 group-hover:opacity-100 transition-opacity">POWER ON SYSTEM</span>
        </button>
      </div>
    );
  }

  if (systemState === 'BOOTING') {
    return <BootScreen />;
  }

  return (
    <div 
      className="w-screen h-screen overflow-hidden flex flex-col relative bg-slate-900 selection:bg-cyan-500/30 selection:text-cyan-100 animate-in fade-in duration-1000"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay to darken background for better readability */}
      <div className="absolute inset-0 bg-slate-900/40 pointer-events-none" />

      {/* Desktop Area */}
      <div className="flex-1 relative z-0" onClick={() => {
        setStartMenuOpen(false);
        setWifiMenuOpen(false);
        setVolumeMenuOpen(false);
        setBatteryMenuOpen(false);
      }}>
        {/* Desktop Icons */}
        <div className="absolute top-4 left-4 flex flex-col gap-4 z-0 flex-wrap max-h-full content-start">
          {desktopAppIds.map(appId => {
            const app = APPS[appId];
            return (
              <button
                key={app.id}
                onClick={(e) => { e.stopPropagation(); openApp(app.id); }}
                className="flex flex-col items-center gap-1 w-24 p-2 rounded-lg hover:bg-white/10 hover:backdrop-blur-sm group transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform text-white">
                  <Icon name={app.icon} size={24} />
                </div>
                <span className="text-xs font-medium text-white drop-shadow-md text-center line-clamp-2">{app.title}</span>
              </button>
            );
          })}
        </div>

        {/* Windows */}
        {windows.map(win => (
          <WindowFrame
            key={win.id}
            window={win}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onFocus={focusWindow}
            onMove={moveWindow}
          >
            {renderAppContent(win.appId)}
          </WindowFrame>
        ))}
      </div>

      {/* Start Menu */}
      {startMenuOpen && (
        <div className="absolute bottom-14 left-2 w-80 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
          <div className="p-4 bg-gradient-to-r from-blue-900/50 to-slate-900/50 border-b border-white/5">
            <h2 className="text-lg font-bold text-white">Blue Shark OS</h2>
            <p className="text-xs text-blue-200/60">Welcome back, Diver.</p>
          </div>
          <div className="p-2 grid grid-cols-1 gap-1 overflow-y-auto max-h-[300px] custom-scrollbar">
            {Object.values(APPS).map(app => (
              <button
                key={app.id}
                onClick={() => openApp(app.id)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 text-left transition-colors group"
              >
                <div className="p-2 bg-slate-800 rounded-lg text-blue-400 group-hover:text-cyan-300 group-hover:bg-slate-700 transition-colors">
                  <Icon name={app.icon} size={18} />
                </div>
                <span className="text-sm text-slate-200 font-medium group-hover:text-white">{app.title}</span>
              </button>
            ))}
          </div>
          <div className="p-3 bg-slate-950/50 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2 px-2">
               <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-500 text-xs font-bold">U</div>
               <span className="text-xs text-slate-400">User</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleRestart}
                className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-yellow-400 transition-colors"
                title="Restart"
              >
                <Icon name="RotateCw" size={16} />
              </button>
              <button 
                onClick={handleShutdown}
                className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                title="Shut Down"
              >
                <Icon name="Power" size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wifi Menu Popup */}
      {wifiMenuOpen && (
        <div className="absolute bottom-14 right-4 w-80 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800/50">
                <span className="font-semibold text-white">Wi-Fi</span>
                <button onClick={handleWifiToggle} className={`w-10 h-5 rounded-full relative transition-colors ${wifiEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${wifiEnabled ? 'left-5.5' : 'left-0.5'}`} />
                </button>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col h-full">
                {!wifiEnabled ? (
                    <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                        <Icon name="WifiOff" size={32} className="mb-2 opacity-50" />
                        <p>Wi-Fi is turned off</p>
                    </div>
                ) : isAddingWifi ? (
                    <div className="p-3 space-y-3">
                        <div className="text-sm font-medium text-slate-300 px-1">Add Network</div>
                        <form onSubmit={handleAddNetwork} className="space-y-3">
                            <input 
                                type="text"
                                placeholder="Network Name (SSID)"
                                className="w-full bg-slate-800/80 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                value={newWifiSsid}
                                onChange={(e) => setNewWifiSsid(e.target.value)}
                                autoFocus
                            />
                            <input 
                                type="password"
                                placeholder="Password (Optional)"
                                className="w-full bg-slate-800/80 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                value={newWifiPass}
                                onChange={(e) => setNewWifiPass(e.target.value)}
                            />
                            <div className="flex gap-2 pt-1">
                                <button 
                                    type="submit" 
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-1.5 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Join
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => { setIsAddingWifi(false); setNewWifiSsid(''); setNewWifiPass(''); }}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="p-2 space-y-1">
                            {networks.map(net => (
                                <button 
                                    key={net.ssid}
                                    onClick={() => handleNetworkConnect(net.ssid)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group text-left ${connectedNetwork === net.ssid ? 'bg-blue-600/10 border border-blue-500/20' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon name="Wifi" size={16} className={connectedNetwork === net.ssid ? 'text-blue-400' : 'text-slate-400'} />
                                        <div>
                                            <div className={`text-sm font-medium ${connectedNetwork === net.ssid ? 'text-blue-200' : 'text-slate-200'}`}>
                                                {net.ssid}
                                            </div>
                                            <div className="text-[10px] text-slate-500">
                                                {connectedNetwork === net.ssid ? 'Connected' : connectingNetwork === net.ssid ? 'Connecting...' : net.secured ? 'Secured' : 'Open'}
                                            </div>
                                        </div>
                                    </div>
                                    {net.secured && <Icon name="Lock" size={12} className="text-slate-600" />}
                                    {connectingNetwork === net.ssid && <div className="w-3 h-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />}
                                </button>
                            ))}
                        </div>
                        <div className="p-2 border-t border-white/5 mt-auto bg-slate-900/50 sticky bottom-0 backdrop-blur-md">
                            <button 
                                onClick={() => setIsAddingWifi(true)}
                                className="w-full flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                            >
                                <Icon name="Plus" size={16} />
                                Add Network
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
      )}

      {/* Volume Menu Popup */}
      {volumeMenuOpen && (
          <div className="absolute bottom-14 right-14 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
              <div className="p-4 border-b border-white/5 bg-slate-800/50 flex justify-between items-center">
                  <span className="font-semibold text-white">Sound</span>
                  <span className="text-xs text-slate-400">{isMuted ? 'Muted' : `${volume}%`}</span>
              </div>
              <div className="p-6">
                  <div className="flex items-center gap-4">
                      <button 
                          onClick={() => setIsMuted(!isMuted)}
                          className={`p-2 rounded-full transition-colors ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 hover:bg-slate-700 text-blue-400'}`}
                      >
                          <Icon name={isMuted ? "VolumeX" : "Volume2"} size={20} />
                      </button>
                      <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={isMuted ? 0 : volume} 
                          onChange={handleVolumeChange}
                          className="flex-1 h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                      />
                  </div>
              </div>
          </div>
      )}

      {/* Battery Menu Popup */}
      {batteryMenuOpen && (
        <div className="absolute bottom-14 right-4 w-80 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
          <div className="p-4 border-b border-white/5 bg-slate-800/50 flex justify-between items-center">
              <span className="font-semibold text-white">Power</span>
              <span className="text-xs text-slate-400">{batteryLevel}%</span>
          </div>
          
          <div className="p-6 space-y-6">
             {/* Battery Status Large */}
             <div className="flex items-center gap-4">
                <div className="relative">
                   <Icon name={getBatteryIcon()} size={48} className={isCharging ? "text-green-400" : batteryLevel < 20 ? "text-red-400" : "text-slate-200"} />
                   {isCharging && <div className="absolute -bottom-1 -right-1 bg-green-500/20 rounded-full p-0.5"><Icon name="Zap" size={12} className="text-green-400 fill-current" /></div>}
                </div>
                <div>
                   <div className="text-3xl font-bold">{batteryLevel}%</div>
                   <div className="text-xs text-slate-400">
                     {isCharging 
                       ? 'Charging (45 min to full)' 
                       : batteryLevel < 20 
                         ? 'Low Battery' 
                         : '2 hr 15 min remaining'
                     }
                   </div>
                </div>
             </div>

             {/* Power Mode Selector */}
             <div className="space-y-2">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Power Mode</div>
                <div className="grid grid-cols-3 gap-2 bg-slate-800/50 p-1 rounded-lg">
                   <button 
                     onClick={() => setPowerMode('saver')}
                     className={`flex flex-col items-center gap-1 p-2 rounded-md transition-all ${powerMode === 'saver' ? 'bg-green-600/20 text-green-400' : 'hover:bg-white/5 text-slate-500'}`}
                   >
                      <Icon name="Leaf" size={16} />
                      <span className="text-[10px]">Saver</span>
                   </button>
                   <button 
                     onClick={() => setPowerMode('balanced')}
                     className={`flex flex-col items-center gap-1 p-2 rounded-md transition-all ${powerMode === 'balanced' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-slate-500'}`}
                   >
                      <Icon name="Gauge" size={16} />
                      <span className="text-[10px]">Balanced</span>
                   </button>
                   <button 
                     onClick={() => setPowerMode('performance')}
                     className={`flex flex-col items-center gap-1 p-2 rounded-md transition-all ${powerMode === 'performance' ? 'bg-purple-600/20 text-purple-400' : 'hover:bg-white/5 text-slate-500'}`}
                   >
                      <Icon name="Zap" size={16} />
                      <span className="text-[10px]">Best</span>
                   </button>
                </div>
             </div>

             {/* Simulator Toggles (For Demo) */}
             <div className="pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                   <span className="text-xs text-slate-400">Simulate Charger</span>
                   <button 
                     onClick={() => setIsCharging(!isCharging)}
                     className={`w-10 h-5 rounded-full relative transition-colors ${isCharging ? 'bg-green-600' : 'bg-slate-700'}`}
                   >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${isCharging ? 'left-5.5' : 'left-0.5'}`} />
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="h-12 bg-slate-900/80 backdrop-blur-lg border-t border-white/10 flex items-center px-2 gap-2 z-50 relative">
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            setStartMenuOpen(!startMenuOpen); 
            setWifiMenuOpen(false); 
            setVolumeMenuOpen(false); 
            setBatteryMenuOpen(false); 
          }}
          className={`p-2 rounded-lg transition-all ${startMenuOpen ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] text-white' : 'hover:bg-white/10 text-slate-300'}`}
        >
           <Icon name="Terminal" size={20} className={startMenuOpen ? "rotate-0" : ""} />
        </button>

        <div className="w-[1px] h-6 bg-white/10 mx-1" />

        {/* Pinned Apps */}
        <div className="flex items-center gap-1">
          {pinnedAppIds.map(appId => {
             const app = APPS[appId];
             const isRunning = windows.some(w => w.appId === appId);
             return (
               <button
                 key={appId}
                 onClick={() => handlePinnedAppClick(appId)}
                 className={`p-2 rounded-lg transition-all relative hover:bg-white/10 group ${isRunning ? 'bg-white/5' : ''}`}
                 title={app.title}
               >
                 <Icon name={app.icon} size={20} className={isRunning ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"} />
                 {isRunning && (
                   <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                 )}
               </button>
             );
          })}
        </div>

        {pinnedAppIds.length > 0 && <div className="w-[1px] h-6 bg-white/10 mx-1" />}

        {/* Running Windows */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {windows.map(win => (
            <button
              key={win.id}
              onClick={() => win.isMinimized ? restoreWindow(win.id) : focusWindow(win.id)}
              className={`
                group flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all min-w-[120px] max-w-[180px]
                ${(activeWindowId === win.id && !win.isMinimized)
                  ? 'bg-white/10 border-white/20 shadow-sm' 
                  : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5 opacity-70 hover:opacity-100'}
              `}
            >
              <div className={`
                 p-1 rounded bg-slate-800 
                 ${(activeWindowId === win.id && !win.isMinimized) ? 'text-cyan-400' : 'text-slate-400'}
              `}>
                <Icon name={APPS[win.appId].icon} size={14} />
              </div>
              <span className="text-xs text-slate-200 truncate">{win.title}</span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-3 px-3">
            <div className="flex gap-2 text-slate-400 relative">
               <button 
                 onClick={(e) => { 
                   e.stopPropagation(); 
                   setWifiMenuOpen(!wifiMenuOpen); 
                   setStartMenuOpen(false); 
                   setVolumeMenuOpen(false); 
                   setBatteryMenuOpen(false); 
                 }}
                 className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${wifiMenuOpen ? 'bg-white/10 text-white' : ''} ${!wifiEnabled ? 'text-slate-600' : ''}`}
                 title="Network Connections"
               >
                  <Icon name={wifiEnabled ? "Wifi" : "WifiOff"} size={16} />
               </button>
               <button 
                 onClick={(e) => { 
                   e.stopPropagation(); 
                   setVolumeMenuOpen(!volumeMenuOpen); 
                   setStartMenuOpen(false); 
                   setWifiMenuOpen(false); 
                   setBatteryMenuOpen(false); 
                 }}
                 className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${volumeMenuOpen ? 'bg-white/10 text-white' : ''}`}
                 title="Volume"
               >
                  <Icon name={getVolumeIcon()} size={16} />
               </button>
               <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setBatteryMenuOpen(!batteryMenuOpen); 
                    setStartMenuOpen(false); 
                    setWifiMenuOpen(false); 
                    setVolumeMenuOpen(false); 
                  }}
                  className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${batteryMenuOpen ? 'bg-white/10 text-white' : ''}`} 
                  title="Battery Status"
               >
                  <Icon name={getBatteryIcon()} size={16} className={isCharging ? "text-green-400" : ""} />
               </button>
            </div>
            <div className="text-right flex flex-col justify-center h-full">
                <div className="text-xs font-medium text-slate-200 leading-tight">
                    {currentTime.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: clockConfig.showSeconds ? '2-digit' : undefined,
                        hour12: !clockConfig.is24Hour 
                    })}
                </div>
                {clockConfig.showDate && (
                    <div className="text-[10px] text-slate-400 leading-tight">
                        {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;