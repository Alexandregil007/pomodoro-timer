import React from 'react';
import { useTimer } from '../contexts/TimerContext';

const Controls = () => {
  const { isRunning, setIsRunning, handleReset, theme, themes } = useTimer();

  return (
    <div className="controls-container">
      <button 
        className="control-btn reset"
        onClick={handleReset}
        style={{ backgroundColor: themes[theme].button }}
      >
        RESET
      </button>
      <button 
        className={`control-btn ${isRunning ? 'pause' : 'start'}`}
        onClick={() => setIsRunning(!isRunning)}
        style={{ 
          backgroundColor: isRunning ? themes[theme].pause : themes[theme].focus 
        }}
      >
        {isRunning ? 'PAUSE' : 'START'}
      </button>
    </div>
  );
};

export default Controls;