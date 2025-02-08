import React from 'react';
import { useTimer } from '../contexts/TimerContext';
import styled from 'styled-components';

const Circle = styled.svg`
  width: 300px;
  height: 300px;
  transform: rotate(-90deg);
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

const ProgressCircle = () => {
  const { timeLeft, currentIntervalIndex, intervals, phase, theme } = useTimer();
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const currentDuration = intervals[currentIntervalIndex]?.duration || 1500;
  const progress = timeLeft / currentDuration;
  const offset = circumference * (1 - progress);

  const themeColors = {
    light: { focus: '#4CAF50', pause: '#FF5722', background: '#E0E0E0', text: '#2d3436' },
    dark: { focus: '#9C27B0', pause: '#FF7043', background: '#444', text: '#fff' },
    pink: { focus: '#FF69B4', pause: '#FF4500', background: '#FFB6C1', text: '#ff69b4' },
    ocean: { focus: '#20B2AA', pause: '#00BFFF', background: '#AFEEEE', text: '#00b4d8' }
  };

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
          stroke={themeColors[theme].background}
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx="150"
          cy="150"
          r={radius}
          stroke={themeColors[theme][phase]}
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Circle>
      <TimeDisplay theme={themeColors[theme]}>
        {formatTime(timeLeft)}
      </TimeDisplay>
    </div>
  );
};

export default ProgressCircle;