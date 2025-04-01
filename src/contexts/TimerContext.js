import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import useSound from 'use-sound';
import alertSound from '../assets/sounds/alert.mp3';
import { runConfetti } from '../utils/confetti';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [phase, setPhase] = useState('focus');
  const [theme, setTheme] = useState('pink');
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [volume, setVolume] = useState(1);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);
  const [infiniteLoop, setInfiniteLoop] = useState(true);
  const [autoSkip, setAutoSkip] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [repetitions, setRepetitions] = useState(4);
  const [useDefaultValues, setUseDefaultValues] = useState(true);
  const [userDurations, setUserDurations] = useState({ focus: 25, break: 5, longBreak: 15 });
  const [userRepetitions, setUserRepetitions] = useState(4);
  const [themeSong, setThemeSong] = useState(null);
  const [audioElement, setAudioElement] = useState(null);
  const [loopSongs, setLoopSongs] = useState(false);
  const [timerStart, setTimerStart] = useState(0);
  const [timerDuration, setTimerDuration] = useState(0);

  const [play] = useSound(alertSound, { volume });
  const VIBRATION_PATTERN = useMemo(() => [500, 250, 500], []);

  const songs = useMemo(() => [
    'song1.mp3', 'song2.mp3', 'song3.mp3', 
    'song4.mp3', 'song5.mp3', 'song6.mp3'
  ], []);

  const durations = useMemo(() => ({
    focus: useDefaultValues ? 25 : userDurations.focus,
    break: useDefaultValues ? 5 : userDurations.break,
    longBreak: useDefaultValues ? 15 : userDurations.longBreak
  }), [useDefaultValues, userDurations]);

  const themes = useMemo(() => ({
    light: { 
      background: '#FFF', 
      text: '#000', 
      button: '#2196F3', 
      focus: '#4CAF50', 
      pause: '#FF5722',
      circleBg: '#E0E0E0'
    },
    dark: { 
      background: '#121212', 
      text: '#FFF', 
      button: '#BB86FC', 
      focus: '#9C27B0', 
      pause: '#FF7043',
      circleBg: '#2D2D2D'
    },
    pink: { 
      background: '#FFF0F5', 
      text: '#FF69B4', 
      button: '#FF1493', 
      focus: '#FF69B4', 
      pause: '#FF4500',
      circleBg: '#FFB6C1'
    },
    ocean: { 
      background: '#F0FFFF', 
      text: '#4682B4', 
      button: '#1E90FF', 
      focus: '#20B2AA', 
      pause: '#00BFFF',
      circleBg: '#AFEEEE'
    }
  }), []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    let interval;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning) {
        const elapsed = Math.floor((Date.now() - timerStart) / 1000);
        const remaining = timerDuration - elapsed;
        setTimeLeft(remaining > 0 ? remaining : 0);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (isRunning && timeLeft > 0) {
      setTimerStart(Date.now());
      setTimerDuration(timeLeft);
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerStart) / 1000);
        const remaining = timerDuration - elapsed;
        
        if (remaining <= 0) {
          setTimeLeft(0);
          clearInterval(interval);
        } else {
          setTimeLeft(remaining);
        }
      }, 200);
    }

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning, timeLeft, timerStart, timerDuration]);

  useEffect(() => {
    if (themeSong && soundsEnabled) {
      const newAudio = new Audio(require(`../assets/sounds/${themeSong}`));
      newAudio.volume = volume;
      newAudio.loop = !loopSongs;

      const handleSongEnd = () => {
        if (loopSongs) {
          const currentIndex = songs.indexOf(themeSong);
          if (currentIndex > -1) {
            const nextIndex = (currentIndex + 1) % songs.length;
            setThemeSong(songs[nextIndex]);
          }
        }
      };

      newAudio.addEventListener('ended', handleSongEnd);
      newAudio.play().catch(error => console.log('Audio play failed:', error));

      setAudioElement(newAudio);

      return () => {
        newAudio.removeEventListener('ended', handleSongEnd);
        newAudio.pause();
        newAudio.remove();
      };
    }
  }, [themeSong, soundsEnabled, volume, loopSongs, songs]);

  const handleReset = () => {
    setIsRunning(false);
    setPhase('focus');
    setTimeLeft(durations.focus * 60);
    setSessionCount(0);
  };

  const switchPhase = (newPhase) => {
    setPhase(newPhase);
    setTimeLeft(durations[newPhase] * 60);
    setIsRunning(false);
  };

  useEffect(() => {
    if (useDefaultValues) {
      setUserDurations({ focus: 25, break: 5, longBreak: 15 });
      setRepetitions(4);
    } else {
      setUserDurations(userDurations);
      setRepetitions(userRepetitions);
    }
  }, [useDefaultValues, userDurations, userRepetitions, setUserDurations, setRepetitions]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timeLeft === 0) {
      if (soundsEnabled) play();
      if (vibrationEnabled && navigator.vibrate) navigator.vibrate(VIBRATION_PATTERN);

      if (phase === 'focus') {
        const themeColors = [
          themes[theme].focus,
          themes[theme].button,
          themes[theme].pause
        ];
        runConfetti(themeColors);
      }

      let nextPhase = phase;
      let newCount = sessionCount;

      if (phase === 'focus') {
        newCount = sessionCount + 1;
        setSessionCount(newCount);
        nextPhase = (newCount % repetitions === 0) ? 'longBreak' : 'break';
      } else if (phase === 'break' || phase === 'longBreak') {
        nextPhase = infiniteLoop ? 'focus' : 'stop';
      }

      if (nextPhase !== 'stop') {
        setPhase(nextPhase);
        setTimeLeft(durations[nextPhase] * 60);
        if (autoSkip) {
          setIsRunning(true);
        } else {
          setIsRunning(false);
        }
      } else {
        setIsRunning(false);
      }
    }
  }, [isRunning, timeLeft, phase, durations, infiniteLoop, sessionCount, soundsEnabled, vibrationEnabled, repetitions, autoSkip, theme, themes, play, VIBRATION_PATTERN]);

  return (
    <TimerContext.Provider value={{
      isRunning, setIsRunning,
      timeLeft, setTimeLeft,
      phase, setPhase,
      theme, setTheme,
      themes,
      soundsEnabled, setSoundsEnabled,
      vibrationEnabled, setVibrationEnabled,
      volume, setVolume,
      infiniteLoop, setInfiniteLoop,
      autoSkip, setAutoSkip,
      durations,
      repetitions, setRepetitions,
      sessionCount,
      handleReset,
      useDefaultValues, setUseDefaultValues,
      userDurations, setUserDurations,
      userRepetitions, setUserRepetitions,
      switchPhase,
      themeSong,
      setThemeSong,
      audioElement,
      setAudioElement,
      loopSongs,
      setLoopSongs
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};