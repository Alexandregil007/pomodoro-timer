import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import useSound from 'use-sound';
import alertSound from '../assets/sounds/alert.mp3';

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

  const [durations, setDurations] = useState({
    focus: 25,
    break: 5,
    longBreak: 15
  });

  const [play] = useSound(alertSound, { volume });
  const VIBRATION_PATTERN = useMemo(() => [500, 250, 500], []);

  const themes = {
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
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

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
      setDurations({ focus: 25, break: 5, longBreak: 15 });
      setRepetitions(4);
    } else {
      setDurations(userDurations);
      setRepetitions(userRepetitions);
    }
  }, [useDefaultValues, userDurations, userRepetitions]);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      if (soundsEnabled) play();
      if (vibrationEnabled && navigator.vibrate) navigator.vibrate(VIBRATION_PATTERN);

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
    return () => clearInterval(interval);
  }, [
    isRunning, timeLeft, phase, durations, infiniteLoop, sessionCount,
    soundsEnabled, play, vibrationEnabled, VIBRATION_PATTERN, repetitions, autoSkip
  ]);

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
      durations, setDurations,
      repetitions, setRepetitions,
      sessionCount,
      handleReset,
      useDefaultValues, setUseDefaultValues,
      userDurations, setUserDurations,
      userRepetitions, setUserRepetitions,
      switchPhase // Add this line
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);