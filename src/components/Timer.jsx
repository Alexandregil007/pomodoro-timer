import React, { useEffect, useState } from 'react';
import { useTimer } from '../contexts/TimerContext';
import ProgressCircle from './ProgressCircle';
import Controls from './Controls';
import { FiSettings } from 'react-icons/fi';
import 'animate.css';

const Timer = ({ showSettings }) => {
  const { 
    theme, 
    themes, 
    phase, 
    switchPhase, 
    timeLeft, 
    isRunning, 
    sessionCount 
  } = useTimer();

  const [showAnimation, setShowAnimation] = useState(false);

  // Phase buttons configuration
  const phases = [
    { name: 'Focus', value: 'focus' },
    { name: 'Break', value: 'break' },
    { name: 'Long Break', value: 'longBreak' }
  ];

  // Handle Focus Timer completion animation
  useEffect(() => {
    if (timeLeft === 0 && phase === 'focus' && !isRunning) {
      setShowAnimation(true);
      const timeout = setTimeout(() => {
        setShowAnimation(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [timeLeft, phase, isRunning]);

  return (
    <div className="timer-container" style={{ backgroundColor: themes[theme].background }}>
      {/* Settings Button */}
      <button className="settings-button" onClick={showSettings}>
        <FiSettings size={24} />
      </button>

      {/* Session Counter */}
      <div className="session-counter" style={{ color: themes[theme].text }}>
        Sessions Completed: {sessionCount}
      </div>

      {/* Phase Switcher */}
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

      {/* App Title */}
      <h1 className="app-title" style={{ color: themes[theme].text }}>
        ❤️ Carolina Timer ❤️
      </h1>

      {/* Progress Circle */}
      <ProgressCircle />

      {/* Controls */}
      <Controls />

      {/* Full Screen Animation */}
      {showAnimation && (
        <div className="fullscreen-animation">
          <div className="animation-content">
            🎉 TIME TO FOCUS! 🎉
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;