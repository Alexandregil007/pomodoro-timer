import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useSound from 'use-sound';
import alertSound from '../assets/sounds/alert.mp3';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState(0);
  const [phase, setPhase] = useState('focus');
  const [theme, setTheme] = useState('light');
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);
  const [intervals, setIntervals] = useState([
    { id: uuidv4(), type: 'focus', duration: 1500 },
    { id: uuidv4(), type: 'pause', duration: 300 },
    { id: uuidv4(), type: 'focus', duration: 1500 },
    { id: uuidv4(), type: 'pause', duration: 300 },
    { id: uuidv4(), type: 'focus', duration: 1500 },
    { id: uuidv4(), type: 'pause', duration: 900 }
  ]);
  const [infiniteLoop, setInfiniteLoop] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [play] = useSound(alertSound);
  const progressRef = useRef(1);

  const safeSetIntervals = (newIntervals) => {
    if (newIntervals.length === 0) {
      newIntervals = [{ id: uuidv4(), type: 'focus', duration: 1500 }];
    }
    setIntervals(newIntervals);
    if (currentIntervalIndex >= newIntervals.length) {
      setCurrentIntervalIndex(0);
    }
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleReset = () => {
    setIsRunning(false);
    setCurrentIntervalIndex(0);
    setTimeLeft(intervals[0].duration);
    setPhase(intervals[0].type);
    setSessionCount(0);
    progressRef.current = 1;
  };

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          progressRef.current = newTime / intervals[currentIntervalIndex].duration;
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      if (soundsEnabled) play();
      
      // Update session count when focus ends
      if (phase === 'focus') {
        setSessionCount(prev => prev + 1);
      }

      if (intervals[currentIntervalIndex + 1]) {
        const nextIndex = currentIntervalIndex + 1;
        setCurrentIntervalIndex(nextIndex);
        setPhase(intervals[nextIndex].type);
        setTimeLeft(intervals[nextIndex].duration);
      } else if (infiniteLoop) {
        setCurrentIntervalIndex(0);
        setPhase(intervals[0].type);
        setTimeLeft(intervals[0].duration);
      } else {
        setIsRunning(false);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentIntervalIndex, intervals, infiniteLoop, phase, soundsEnabled, play]);

  return (
    <TimerContext.Provider value={{
      isRunning, setIsRunning,
      timeLeft, setTimeLeft,
      phase, setPhase,
      theme, setTheme,
      soundsEnabled, setSoundsEnabled,
      vibrationEnabled, setVibrationEnabled,
      intervals, setIntervals: safeSetIntervals,
      infiniteLoop, setInfiniteLoop,
      sessionCount,
      currentIntervalIndex, setCurrentIntervalIndex,
      progress: progressRef,
      handleReset
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);