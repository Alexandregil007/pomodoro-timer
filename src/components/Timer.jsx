import React from 'react';
import { useTimer } from '../contexts/TimerContext';
import ProgressCircle from './ProgressCircle';
import Controls from './Controls';
import { FiSettings } from 'react-icons/fi';

const Timer = ({ showSettings }) => {
  const { theme, themes, sessionCount } = useTimer(); // Removed unused 'phase'

  return (
    <div className="timer-container" style={{ backgroundColor: themes[theme].background }}>
      {/* Settings Button */}
      <button 
        className="settings-button"
        onClick={showSettings}
      >
        <FiSettings size={24} />
      </button>

      {/* Session Counter */}
      <div className="session-counter" style={{ color: themes[theme].text }}>
        Sessions Completed: {sessionCount}
      </div>

      {/* App Title */}
      <h1 className="app-title" style={{ color: themes[theme].text }}>
        ❤️ Carolina Timer ❤️
      </h1>

      {/* Progress Circle with Phase Indicator */}
      <ProgressCircle />

      {/* Controls */}
      <Controls />
    </div>
  );
};

export default Timer;