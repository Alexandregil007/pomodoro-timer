import React from 'react';
import { useTimer } from '../contexts/TimerContext';

const Controls = () => {
  const { isRunning, setIsRunning, handleReset, theme } = useTimer();

  const themeColors = {
    light: { start: '#4CAF50', pause: '#FF5722', reset: '#2196F3' },
    dark: { start: '#9C27B0', pause: '#FF7043', reset: '#BB86FC' },
    pink: { start: '#FF69B4', pause: '#FF4500', reset: '#FF1493' },
    ocean: { start: '#20B2AA', pause: '#00BFFF', reset: '#1E90FF' }
  };

  return (
    <div className="controls-container">
      <button 
        className="control-btn reset-btn"
        onClick={handleReset}
        style={{ backgroundColor: themeColors[theme].reset }}
      >
        RESET
      </button>
      <button 
        className={`control-btn ${isRunning ? 'pause-btn' : 'start-btn'}`}
        onClick={() => setIsRunning(!isRunning)}
        style={{ 
          backgroundColor: isRunning ? themeColors[theme].pause : themeColors[theme].start 
        }}
      >
        {isRunning ? 'PAUSE' : 'START'}
      </button>
    </div>
  );
};

export default Controls;