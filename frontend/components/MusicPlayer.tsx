import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { TRACKS } from '../constants';
import { GlitchText } from './GlitchText';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error("Audio playback failed:", err);
          setError("AUDIO_SYS_ERR: PLAYBACK_BLOCKED");
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
    setError(null);
    if (!isPlaying) setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
    setError(null);
    if (!isPlaying) setIsPlaying(true);
  };

  const togglePlay = () => {
    setError(null);
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="border-2 border-fuchsia-500 bg-black/80 p-4 shadow-[0_0_15px_rgba(255,0,255,0.3),inset_0_0_10px_rgba(255,0,255,0.2)] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 p-1 text-[10px] text-fuchsia-800 opacity-50 select-none">
        AUDIO_SUBSYSTEM_V2.4
      </div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="mb-4">
        <div className="text-xs text-cyan-600 mb-1">CURRENT_PROCESS:</div>
        <GlitchText text={currentTrack.title} className="text-fuchsia-400" />
        {error && <div className="text-red-500 text-xs mt-1 animate-pulse">{error}</div>}
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-gray-900 border border-fuchsia-900 mb-4 relative">
        <div 
          className="h-full bg-fuchsia-500 shadow-[0_0_8px_#f0f] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <button 
            onClick={handlePrev}
            className="text-cyan-500 hover:text-fuchsia-400 hover:drop-shadow-[0_0_5px_#f0f] transition-colors focus:outline-none"
            aria-label="Previous Track"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="text-cyan-400 hover:text-fuchsia-400 hover:drop-shadow-[0_0_8px_#f0f] transition-colors focus:outline-none"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-cyan-500 hover:text-fuchsia-400 hover:drop-shadow-[0_0_5px_#f0f] transition-colors focus:outline-none"
            aria-label="Next Track"
          >
            <SkipForward size={24} />
          </button>
        </div>

        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-cyan-700 hover:text-cyan-400 transition-colors focus:outline-none"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
      
      {/* Status Indicator */}
      <div className="mt-4 flex items-center space-x-2 text-xs">
        <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-fuchsia-500 shadow-[0_0_5px_#f0f] animate-pulse' : 'bg-gray-700'}`}></div>
        <span className={isPlaying ? 'text-fuchsia-400' : 'text-gray-600'}>
          {isPlaying ? 'STREAMING_DATA...' : 'IDLE'}
        </span>
      </div>
    </div>
  );
};
