import React, { useState, useEffect } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { GlitchText } from './components/GlitchText';

// Decorative component for the "machine-like" tone
const HexStream: React.FC = () => {
  const [hex, setHex] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      let newHex = '';
      for(let i=0; i<15; i++) {
        newHex += Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase() + ' ';
      }
      setHex(newHex);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:block w-32 h-full overflow-hidden text-[10px] text-cyan-900/40 font-mono break-all leading-tight select-none">
      {hex.repeat(20)}
    </div>
  );
};

const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    // Simulate a boot sequence
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isBooting) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-cyan-500 font-mono">
        <GlitchText text="INITIALIZING_CORE_SYSTEMS..." className="mb-4" />
        <div className="w-64 h-1 bg-gray-900 border border-cyan-900 overflow-hidden">
          <div className="h-full bg-cyan-500 animate-[pulse_1s_ease-in-out_infinite] w-full origin-left scale-x-0 animate-[scale-x_2s_ease-out_forwards]"></div>
        </div>
        <style>{`
          @keyframes scale-x {
            to { transform: scaleX(1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4 md:p-8 screen-tear relative">
      
      {/* Main Terminal Window */}
      <div className="w-full max-w-6xl bg-[#0a0a0a] border-2 border-cyan-600 shadow-[0_0_30px_rgba(0,255,255,0.15),inset_0_0_20px_rgba(0,255,255,0.05)] flex flex-col relative z-10">
        
        {/* Terminal Header */}
        <div className="bg-cyan-950/50 border-b border-cyan-600 p-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_#f00]"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <GlitchText text="NEURAL_SNAKE_OS v1.0.4" className="text-cyan-300 text-sm tracking-widest" />
          <div className="text-cyan-700 text-xs hidden sm:block">SYS_MEM: OK</div>
        </div>

        {/* Terminal Body */}
        <div className="flex flex-1 p-4 md:p-8 gap-8 flex-col lg:flex-row items-center lg:items-start justify-center relative overflow-hidden">
          
          {/* Left Decorative Stream */}
          <HexStream />

          {/* Center: Game Area */}
          <div className="flex-1 flex justify-center w-full z-10">
            <SnakeGame />
          </div>

          {/* Right: Audio & Stats */}
          <div className="w-full lg:w-80 flex flex-col gap-6 z-10">
            <MusicPlayer />
            
            {/* Decorative Stats Panel */}
            <div className="border border-cyan-800 p-4 bg-black/50 text-xs text-cyan-600 font-mono">
              <div className="mb-2 border-b border-cyan-900 pb-1 text-cyan-400">SYSTEM_DIAGNOSTICS</div>
              <div className="flex justify-between"><span>CPU_LOAD:</span> <span className="text-fuchsia-400 animate-pulse">98.4%</span></div>
              <div className="flex justify-between"><span>MEM_ALLOC:</span> <span>0x4F2A</span></div>
              <div className="flex justify-between"><span>NET_UPLINK:</span> <span className="text-green-500">STABLE</span></div>
              <div className="mt-4 text-[10px] text-cyan-800 opacity-70">
                WARNING: PROLONGED EXPOSURE MAY CAUSE SYNAPTIC DEGRADATION.
              </div>
            </div>
          </div>

          {/* Right Decorative Stream */}
          <HexStream />
        </div>
      </div>
      
      {/* Global decorative elements */}
      <div className="fixed bottom-2 right-4 text-[10px] text-cyan-900 font-mono z-0">
        CONNECTION_SECURE // ENCRYPTION_LEVEL_OMEGA
      </div>
    </div>
  );
};

export default App;
