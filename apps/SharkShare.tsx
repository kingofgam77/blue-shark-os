import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';

interface Device {
  id: string;
  name: string;
  type: 'smartphone' | 'laptop' | 'tablet';
  status: 'idle' | 'sending' | 'completed' | 'failed' | 'queued';
  progress: number;
}

export const SharkShare: React.FC = () => {
  const [isDiscoverable, setIsDiscoverable] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(true);
  
  // Queue Management
  const [transferQueue, setTransferQueue] = useState<string[]>([]);
  const [activeTransferId, setActiveTransferId] = useState<string | null>(null);

  // Simulate scanning lifecycle
  useEffect(() => {
    if (!scanning || !isDiscoverable) {
        setDevices([]);
        setTransferQueue([]);
        setActiveTransferId(null);
        return;
    }
    
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    
    // Clear existing
    setDevices([]);

    const foundDevices: Device[] = [
        { id: '1', name: "Diver's Phone", type: 'smartphone', status: 'idle', progress: 0 },
        { id: '2', name: "Research Tablet", type: 'tablet', status: 'idle', progress: 0 },
        { id: '3', name: "Control Station", type: 'laptop', status: 'idle', progress: 0 },
        { id: '4', name: "Submersible Link", type: 'laptop', status: 'idle', progress: 0 },
    ];

    foundDevices.forEach((device, index) => {
        const timeout = setTimeout(() => {
            setDevices(prev => [...prev, device]);
        }, 1500 + (index * 800)); // Faster discovery for demo
        timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [scanning, isDiscoverable]);

  // Process Queue Effect
  useEffect(() => {
    if (activeTransferId === null && transferQueue.length > 0) {
      const nextId = transferQueue[0];
      setTransferQueue(prev => prev.slice(1));
      performTransfer(nextId);
    }
  }, [activeTransferId, transferQueue]);

  const performTransfer = (deviceId: string) => {
      setActiveTransferId(deviceId);
      setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, status: 'sending', progress: 0 } : d));

      // Simulate sending progress
      let progress = 0;
      const interval = setInterval(() => {
          progress += 5;
          setDevices(prev => prev.map(d => {
              if (d.id === deviceId) {
                  if (progress >= 100) {
                      return { ...d, status: 'completed', progress: 100 };
                  }
                  return { ...d, progress };
              }
              return d;
          }));

          if (progress >= 100) {
              clearInterval(interval);
              setActiveTransferId(null); // Release for next in queue
              
              // Reset to idle after delay to allow re-send
              setTimeout(() => {
                  setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, status: 'idle', progress: 0 } : d));
              }, 2000);
          }
      }, 50); // 1 second total transfer time
  };

  const addToQueue = (deviceId: string) => {
      // Immediately mark as queued visually
      setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, status: 'queued', progress: 0 } : d));
      setTransferQueue(prev => [...prev, deviceId]);
  };

  return (
      <div className="h-full bg-slate-900 text-white flex flex-col relative overflow-hidden select-none">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center z-10 bg-slate-900/50 backdrop-blur-md">
              <div className="flex items-center gap-2">
                  <div className="bg-blue-600 p-1.5 rounded-lg">
                    <Icon name="Share2" size={18} className="text-white" />
                  </div>
                  <span className="font-bold tracking-tight">Shark Share</span>
              </div>
              <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-medium">{isDiscoverable ? 'Visible to everyone' : 'Discovery Off'}</span>
                  <button 
                    onClick={() => setIsDiscoverable(!isDiscoverable)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${isDiscoverable ? 'bg-blue-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${isDiscoverable ? 'left-5.5' : 'left-0.5'}`} />
                  </button>
              </div>
          </div>

          {/* Main Area */}
          <div className="flex-1 flex flex-col items-center justify-center relative p-8">
              
              {/* Radar Effect Background */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                 <div className="w-[500px] h-[500px] border border-blue-500/5 rounded-full absolute" />
                 <div className="w-[350px] h-[350px] border border-blue-500/10 rounded-full absolute" />
                 <div className="w-[200px] h-[200px] border border-blue-500/15 rounded-full absolute" />
                 {scanning && isDiscoverable && (
                     <>
                        <div className="w-[180px] h-[180px] bg-blue-500/5 rounded-full absolute animate-ping-slow" />
                     </>
                 )}
              </div>

              {/* Self Icon */}
              <div className="z-10 flex flex-col items-center mb-12 relative">
                  <div className="relative w-24 h-24">
                      {scanning && isDiscoverable && (
                          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                      )}
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] border-4 border-slate-900 relative z-10">
                          <span className="text-2xl font-bold">You</span>
                      </div>
                      
                      {/* Active Transfer Indicator */}
                      {activeTransferId && (
                         <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1 border border-white/10">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                               <Icon name="Share2" size={12} className="text-black" />
                            </div>
                         </div>
                      )}
                  </div>
                  <span className="mt-4 text-xs font-medium text-cyan-200 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-500/30">Blue Shark OS</span>
                  {transferQueue.length > 0 && (
                      <span className="mt-2 text-[10px] text-slate-400">{transferQueue.length} in queue</span>
                  )}
              </div>

              {/* Devices Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl z-10">
                 {!isDiscoverable ? (
                     <div className="col-span-full flex flex-col items-center text-slate-500 mt-4">
                         <Icon name="WifiOff" size={32} className="mb-2 opacity-50" />
                         <p className="text-sm">Enable visibility to find devices</p>
                     </div>
                 ) : (
                    <>
                        {devices.map(device => (
                            <button
                                key={device.id}
                                onClick={() => device.status === 'idle' && addToQueue(device.id)}
                                disabled={device.status !== 'idle'}
                                className={`
                                    relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 group
                                    ${device.status === 'idle' 
                                        ? 'bg-slate-800/40 border-white/5 hover:bg-slate-800/80 hover:border-blue-500/40 hover:scale-105 cursor-pointer backdrop-blur-sm' 
                                        : 'bg-slate-800/90 border-blue-500/50'}
                                `}
                            >
                                <div className={`
                                    w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors
                                    ${device.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                                      device.status === 'queued' ? 'bg-yellow-500/20 text-yellow-400' :
                                      device.status === 'sending' ? 'bg-blue-500/20 text-blue-400' :
                                      'bg-slate-700/50 text-blue-300 group-hover:bg-blue-600/20 group-hover:text-blue-400'}
                                `}>
                                    <Icon name={device.type === 'smartphone' ? 'Smartphone' : device.type === 'laptop' ? 'Laptop' : 'Tablet'} size={28} />
                                </div>
                                <span className="text-sm font-medium text-slate-200">{device.name}</span>
                                <span className="text-[10px] text-slate-500 capitalize mt-0.5">{device.type}</span>
                                
                                {/* Status / Progress Overlay */}
                                {device.status !== 'idle' && (
                                    <div className="absolute inset-0 bg-slate-900/80 rounded-2xl flex flex-col items-center justify-center backdrop-blur-[1px] p-2">
                                        {device.status === 'queued' && (
                                            <div className="flex flex-col items-center animate-pulse">
                                                <div className="text-yellow-400 mb-1">
                                                    <Icon name="Clock" size={20} />
                                                </div>
                                                <span className="text-xs font-medium text-yellow-200">Queued</span>
                                            </div>
                                        )}
                                        {device.status === 'sending' && (
                                            <>
                                                <div className="text-xs font-medium text-blue-200 mb-2">Sending...</div>
                                                <div className="w-full max-w-[80px] h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500 transition-all duration-100 ease-linear" style={{ width: `${device.progress}%` }} />
                                                </div>
                                                <div className="text-[10px] text-slate-400 mt-1">{device.progress}%</div>
                                            </>
                                        )}
                                        {device.status === 'completed' && (
                                            <div className="flex flex-col items-center text-green-400 animate-in zoom-in duration-300">
                                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mb-1">
                                                    <Icon name="Check" size={16} />
                                                </div>
                                                <span className="text-xs font-bold">Sent!</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </button>
                        ))}

                        {/* Scanning Placeholder */}
                        {scanning && devices.length < 4 && (
                            <div className="flex flex-col items-center justify-center p-4 text-slate-600 animate-pulse">
                                <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center mb-2">
                                    <Icon name="Search" size={20} />
                                </div>
                                <span className="text-xs">Scanning...</span>
                            </div>
                        )}
                    </>
                 )}
              </div>
          </div>

          <style>{`
            @keyframes ping-slow {
                0% { transform: scale(0.8); opacity: 0.6; }
                100% { transform: scale(2.5); opacity: 0; }
            }
            .animate-ping-slow { animation: ping-slow 3s infinite cubic-bezier(0, 0, 0.2, 1); }
          `}</style>
      </div>
  );
};