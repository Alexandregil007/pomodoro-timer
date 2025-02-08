import React, { useState } from 'react';
import { useTimer } from '../contexts/TimerContext';
import { v4 as uuidv4 } from 'uuid';
import { FiTrash2 } from 'react-icons/fi';

const Settings = ({ onClose }) => {
  const {
    theme,
    setTheme,
    soundsEnabled,
    setSoundsEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    intervals,
    setIntervals,
    infiniteLoop,
    setInfiniteLoop
  } = useTimer();
  
  const [newInterval, setNewInterval] = useState({ type: 'focus', duration: 25 });

  const handleAddInterval = () => {
    if (newInterval.duration > 0) {
      setIntervals([...intervals, {
        id: uuidv4(),
        type: newInterval.type,
        duration: newInterval.duration * 60
      }]);
    }
  };

  const themeColors = {
    light: { background: '#f8f9fa', text: '#2d3436' },
    dark: { background: '#444', text: '#ffffff' },
    pink: { background: '#fff0f5', text: '#ff69b4' },
    ocean: { background: '#f0f8ff', text: '#00b4d8' }
  };

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <h2>Advanced Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-group">
          <h3>Appearance</h3>
          <div className="theme-options">
            {['light', 'dark', 'pink', 'ocean'].map((t) => (
              <button
                key={t}
                className={`theme-btn ${theme === t ? 'active' : ''}`}
                onClick={() => setTheme(t)}
                style={{
                  backgroundColor: themeColors[t].background,
                  color: themeColors[t].text,
                  borderColor: theme === t ? '#4CAF50' : 'transparent'
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-group">
          <h3>Timer Intervals</h3>
          <div className="interval-container">
            {intervals.map((interval, index) => (
              <div key={interval.id} className="interval-row">
                <div className="interval-controls">
                  <button
                    className={`type-btn ${interval.type}`}
                    onClick={() => {
                      const newIntervals = [...intervals];
                      newIntervals[index].type = interval.type === 'focus' ? 'pause' : 'focus';
                      setIntervals(newIntervals);
                    }}
                  >
                    {interval.type.charAt(0).toUpperCase() + interval.type.slice(1)}
                  </button>
                  <input
                    type="number"
                    value={interval.duration / 60}
                    onChange={(e) => {
                      const newIntervals = [...intervals];
                      newIntervals[index].duration = e.target.value * 60;
                      setIntervals(newIntervals);
                    }}
                    min="1"
                  />
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => setIntervals(intervals.filter((_, i) => i !== index))}
                >
                  <FiTrash2 className="trash-icon" />
                </button>
              </div>
            ))}
          </div>
          <div className="interval-add">
            <button
              className={`type-btn ${newInterval.type}`}
              onClick={() => setNewInterval(prev => ({
                ...prev,
                type: prev.type === 'focus' ? 'pause' : 'focus'
              }))}
            >
              {newInterval.type.charAt(0).toUpperCase() + newInterval.type.slice(1)}
            </button>
            <input
              type="number"
              value={newInterval.duration}
              onChange={(e) => setNewInterval({ ...newInterval, duration: e.target.value })}
              min="1"
            />
            <button className="add-btn" onClick={handleAddInterval}>
              Add Interval
            </button>
          </div>
        </div>

        <div className="settings-group">
          <h3>Timer Options</h3>
          <div className="option-list">
            <label>
              <input
                type="checkbox"
                checked={infiniteLoop}
                onChange={(e) => setInfiniteLoop(e.target.checked)}
              />
              Infinite Loop
            </label>
            <label>
              <input
                type="checkbox"
                checked={soundsEnabled}
                onChange={(e) => setSoundsEnabled(e.target.checked)}
              />
              Enable Sounds
            </label>
            <label>
              <input
                type="checkbox"
                checked={vibrationEnabled}
                onChange={(e) => setVibrationEnabled(e.target.checked)}
              />
              Enable Vibration
            </label>
          </div>
        </div>

        <button className="save-button" onClick={onClose}>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;