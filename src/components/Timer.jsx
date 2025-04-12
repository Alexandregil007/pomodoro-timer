import React from 'react';
import { useTimer } from '../contexts/TimerContext';
import ProgressCircle from './ProgressCircle';
import Controls from './Controls';
import { FiSettings } from 'react-icons/fi';

const Timer = ({ showSettings }) => {
  const { 
    theme, 
    themes, 
    phase, 
    switchPhase, 
    sessionCount
  } = useTimer();

  const phases = [
    { name: 'Focus', value: 'focus' },
    { name: 'Break', value: 'break' },
    { name: 'Long Break', value: 'longBreak' }
  ];

  return (
    <div className="timer-container" style={{ backgroundColor: themes[theme].background }}>
      <button 
        className="settings-button" 
        onClick={showSettings}
        aria-label="Settings"
      >
        <FiSettings size={24} />
      </button>

      <div className="session-counter" style={{ color: themes[theme].text }}>
        Sessions: {sessionCount}
      </div>

      <div className="phase-switcher">
        {phases.map((p) => (
          <button
            key={p.value}
            className={`phase-btn ${phase === p.value ? 'active' : ''}`}
            onClick={() => switchPhase(p.value)}
            style={{
              backgroundColor: phase === p.value ? themes[theme].button : 'transparent',
              color: phase === p.value ? '#FFF' : themes[theme].text,
              border: `2px solid ${themes[theme].button}`
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <h1 className="app-title" style={{ color: themes[theme].text }}>
        ❤️ Carolina Timer ❤️
      </h1>

      <ProgressCircle />
      <Controls />
      
      {/* New animated message */}
      <div className="love-message">
        <span className="heart-pulse">❤️</span> 
        Feito com amor do teu 
        <span className="alexandre-name">Alexandre</span>
        <span className="heart-pulse">❤️</span>
      </div>
    </div>
  );
};

export default Timer;