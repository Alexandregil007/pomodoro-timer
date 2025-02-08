import React, { useState } from 'react';
import { TimerProvider } from './contexts/TimerContext';
import Timer from './components/Timer';
import Settings from './components/Settings';
import './styles.css';

export default function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <TimerProvider>
      <div className="app-container">
        <Timer showSettings={() => setShowSettings(true)} />
        {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      </div>
    </TimerProvider>
  );
}