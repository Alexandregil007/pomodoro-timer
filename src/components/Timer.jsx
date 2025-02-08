import React from 'react';
import { useTimer } from '../contexts/TimerContext';
import ProgressCircle from './ProgressCircle';
import Controls from './Controls';
import { FiSettings } from 'react-icons/fi';

const Timer = ({ showSettings }) => {
  const { sessionCount, theme, themes } = useTimer();

  return (
    <div className="timer-container" style={{ backgroundColor: themes[theme].background }}>
      <button 
        className="settings-button"
        onClick={showSettings}
        style={{ color: themes[theme].text }}
      >
        <FiSettings />
      </button>

      <div className="session-counter" style={{ color: themes[theme].text }}>
        <span>Sessions: {sessionCount}</span>
      </div>

      <h1 className="app-title" style={{ color: themes[theme].text }}>
      ❤️ Carolina Timer ❤️
      </h1>

      <ProgressCircle />
      <Controls />
    </div>
  );
};

export default Timer;