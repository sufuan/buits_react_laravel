import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/audio/loop.mp3');
      audioRef.current.loop = true;
      audioRef.current.preload = 'auto';
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle audio playback
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const toggleAudio = () => {
    setIsPlaying(prev => !prev);
    setIsIndicatorActive(prev => !prev);
  };

  const playAudio = () => {
    setIsPlaying(true);
    setIsIndicatorActive(true);
  };

  const pauseAudio = () => {
    setIsPlaying(false);
    setIsIndicatorActive(false);
  };

  const value = {
    isPlaying,
    isIndicatorActive,
    toggleAudio,
    playAudio,
    pauseAudio,
    audioRef
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
