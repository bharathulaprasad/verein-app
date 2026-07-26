'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Radio } from 'lucide-react';

const streamUrl = 'https://st03.sslstream.dlf.de/dlf/03/128/mp3/stream.mp3';

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // This effect handles the play/pause logic for the audio element
  useEffect(() => {
    if (isPlaying) {
      // On play, ensure the source is set and play the audio
      if (audioRef.current && !audioRef.current.src) {
        audioRef.current.src = streamUrl;
      }
      audioRef.current?.play().catch(error => {
        console.error("Audio play failed:", error);
        // If autoplay is blocked, we should reflect that in the UI
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} preload="none" />
      <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Radio className={`w-5 h-5 ${isPlaying ? 'animate-pulse text-blue-500' : ''}`} />
            <span className="text-sm font-medium hidden sm:block">DLF Radio</span>
        </div>
        <button
          onClick={togglePlayPause}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={isPlaying ? 'Pause Radio' : 'Play Radio'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}