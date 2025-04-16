// src/App.js
import React, { useState } from 'react';
import { TimerProvider } from './contexts/TimerContext';
import { Analytics } from '@vercel/analytics/react';
import Timer from './components/Timer';
import Settings from './components/Settings';
import ErrorBoundary from './ErrorBoundary';
import './styles.css';

export default function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <ErrorBoundary>
      <TimerProvider>
        <div className="app-container">
          <Timer showSettings={() => setShowSettings(true)} />
          {showSettings && <Settings onClose={() => setShowSettings(false)} />}
          <Analytics />
        </div>
      </TimerProvider>
    </ErrorBoundary>
  );
}