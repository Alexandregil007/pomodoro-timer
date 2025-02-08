import React from 'react';
import { useTimer } from '../contexts/TimerContext';
import ProgressCircle from './ProgressCircle';
import Controls from './Controls';
import { FiSettings } from 'react-icons/fi';

const Timer = ({ showSettings }) => {
  const { sessionCount, phase } = useTimer();

  return (
    <div className="timer-container">
      <button 
        className="settings-button"
        onClick={showSettings}
      >
        <FiSettings />
      </button>

      <div className="session-counter">
        <span>Sessions: {sessionCount}</span>
      </div>

      <h1 className="app-title">❤️ Carolina Timer ❤️ </h1>

      <ProgressCircle />

      <div className={`phase-indicator ${phase}`}>
        {phase.toUpperCase()} TIME
      </div>

      <Controls />
    </div>
  );
};

export default Timer;