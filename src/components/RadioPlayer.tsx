'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Radio, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import stations from '@/data/radio-stations.json';

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(true); // Set to true to autoplay
  const [browserReady, setBrowserReady] = useState(false); // For autoplay policy
  const [currentStationIndex, setCurrentStationIndex] = useState(6); // Default to Tagesschau Live
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const playerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentStation = stations[currentStationIndex];

  // Set initial position on mount
  useEffect(() => {
    if (playerRef.current) {
      const rect = playerRef.current.getBoundingClientRect();
      setPosition({
        x: (window.innerWidth - rect.width) / 2.1, // Centered horizontally
        y: window.innerHeight - rect.height - 16, // 16px from bottom (corresponds to bottom-4)
      });
    }
  }, []);

  // Wait for user to interact with the page once to bypass browser audio block
  useEffect(() => {
    const handleInteraction = () => setBrowserReady(true);
    window.addEventListener('click', handleInteraction, { once: true });
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  // Effect to handle audio source, play/pause state, and autoplay
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    // Update source if it's different
    if (audio.src !== currentStation.url) {
      audio.src = currentStation.url;
    }

    if (isPlaying && browserReady) {
      // Attempt to play only if isPlaying is true and the browser is ready
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Autoplay was prevented.
          console.warn("Radio autoplay blocked by browser:", error);
          // Set isPlaying to false so the UI shows the play button.
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentStation.url, browserReady]);

  // Effects for dragging logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && playerRef.current) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playNextStation = () => {
    setCurrentStationIndex((prevIndex) => (prevIndex + 1) % stations.length);
  };

  const playPrevStation = () => {
    setCurrentStationIndex((prevIndex) => (prevIndex - 1 + stations.length) % stations.length);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (playerRef.current) {
      const rect = playerRef.current.getBoundingClientRect();
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={playerRef}
      className="fixed z-50"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <audio ref={audioRef} preload="none" />
      <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-700">
        <button onClick={playPrevStation} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
        <div onMouseDown={handleMouseDown} className="flex flex-col items-center text-center w-28 cursor-move select-none">
          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
            <Radio className={`w-5 h-5 ${isPlaying ? 'animate-pulse text-blue-500' : ''}`} />
            <span className="text-sm font-medium">{currentStation.name}</span>
            <GripVertical className="w-4 h-4 text-slate-400 dark:text-slate-600" />
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