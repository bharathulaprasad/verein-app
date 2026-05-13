"use client";

import { useEffect, useRef, useState } from 'react';
import { BellRing, BellOff } from 'lucide-react';

interface Props {
  weatherCode: number;
}

export default function WeatherSoundAlert({ weatherCode }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [browserReady, setBrowserReady] = useState(false);

  // WMO Codes >= 51 mean Rain, Snow, or Thunderstorms
  const isDisturbance = weatherCode >= 51;

  // Wait for user to interact with the page once to bypass browser audio block
  useEffect(() => {
    const handleInteraction = () => setBrowserReady(true);
    window.addEventListener('click', handleInteraction, { once: true });
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  // Automatically play sound when disturbance is detected AND browser allows it
  useEffect(() => {
    if (isDisturbance && browserReady && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.warn("Audio blocked by browser", e));
    }
  }, [isDisturbance, browserReady]);

  // If weather is good, don't show the button at all
  if (!isDisturbance) return null;

  const toggleMute = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="absolute -top-3 -right-3 z-50">
      <audio ref={audioRef} loop>
        <source src="/alarm.mp3" type="audio/mpeg" />
      </audio>
      
      {/* A tiny, matching pulsing button to stop/start the alarm */}
      <button 
        onClick={toggleMute}
        className={`p-1.5 rounded-full shadow-lg text-white transition-all ${
          isPlaying ? 'bg-red-500 animate-pulse' : 'bg-slate-500'
        }`}
        title="Wetterwarnung Ton"
      >
        {isPlaying ? <BellRing size={14} /> : <BellOff size={14} />}
      </button>
    </div>
  );
}