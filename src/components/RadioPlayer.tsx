'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Radio, ChevronLeft, ChevronRight } from 'lucide-react';

const stations = [
  {
    name: "DLF",
    url: "https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3"
  },
  {
    name: "DLF Kultur",
    url: "https://st02.sslstream.dlf.de/dlf/02/128/mp3/stream.mp3"
  },
  {
    name: "DLF Nova",
    url: "https://st03.sslstream.dlf.de/dlf/03/128/mp3/stream.mp3"
  },
];

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStationIndex, setCurrentStationIndex] = useState(2); // Default to DLF Nova
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentStation = stations[currentStationIndex];

  // Effect to handle changing station URL and playing audio
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = currentStation.url;
      if (wasPlaying || isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Audio play failed:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentStationIndex]); // Re-run when station changes

  // Effect to handle manual play/pause button clicks
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current?.play().catch(error => {
        console.error("Audio play failed:", error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]); // Re-run only when isPlaying state changes

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playNextStation = () => {
    setCurrentStationIndex((prevIndex) => (prevIndex + 1) % stations.length);
  };

  const playPrevStation = () => {
    setCurrentStationIndex((prevIndex) => (prevIndex - 1 + stations.length) % stations.length);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} preload="none" />
      <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-700">
        <button onClick={playPrevStation} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
        <div className="flex flex-col items-center text-center w-28">
          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
            <Radio className={`w-5 h-5 ${isPlaying ? 'animate-pulse text-blue-500' : ''}`} />
            <span className="text-sm font-medium">{currentStation.name}</span>
          </div>
        </div>
        <button
          onClick={togglePlayPause}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={isPlaying ? 'Pause Radio' : 'Play Radio'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button onClick={playNextStation} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><ChevronRight className="w-5 h-5" /></button>
      </div>
    </div>
  );
}