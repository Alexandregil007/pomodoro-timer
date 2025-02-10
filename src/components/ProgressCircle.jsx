import React from 'react';
import { useTimer } from '../contexts/TimerContext';
import styled from 'styled-components';

const Circle = styled.svg`
  width: 300px;
  height: 300px;
  transform: rotate(90deg);
  margin: 0 auto;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.1));
`;

const TimeDisplay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3.5rem;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  color: ${({ theme }) => theme.text};
`;

const PhaseIndicator = styled.div`
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${({ $phase, theme }) => 
    $phase === 'focus' ? theme.focus : theme.pause};
`;

const ProgressCircle = () => {
  const { timeLeft, durations, phase, theme, themes } = useTimer();
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const currentDuration = durations[phase] * 60;
  const progress = 1 - (timeLeft / currentDuration);
  const offset = circumference * (1 - progress);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="progress-container">
      <Circle>
        <circle
          cx="150"
          cy="150"
          r={radius}
          stroke={themes[theme].circleBg}
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx="150"
          cy="150"
          r={radius}
          stroke={themes[theme][phase === 'longBreak' ? 'pause' : phase]}
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Circle>
      <TimeDisplay theme={themes[theme]}>
        {formatTime(timeLeft)}
      </TimeDisplay>
      <PhaseIndicator $phase={phase} theme={themes[theme]}>
        {phase === 'focus' && 'FOCUS TIME'}
        {phase === 'break' && 'BREAK TIME'}
        {phase === 'longBreak' && 'LONG BREAK TIME'}
      </PhaseIndicator>
    </div>
  );
};

export default ProgressCircle;