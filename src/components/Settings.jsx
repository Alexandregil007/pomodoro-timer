import React, { useState, useEffect } from 'react';
import { useTimer } from '../contexts/TimerContext';
import { FiX } from 'react-icons/fi';
import ThemeSwitcher from './ThemeSwitcher';

const Settings = ({ onClose }) => {
  const {
    theme,
    themes,
    soundsEnabled,
    setSoundsEnabled,
    volume,
    setVolume,
    vibrationEnabled,
    setVibrationEnabled,
    durations,
    setDurations,
    infiniteLoop,
    setInfiniteLoop,
    autoSkip,
    setAutoSkip,
    repetitions,
    setRepetitions,
    useDefaultValues,
    setUseDefaultValues,
    userDurations,
    setUserDurations,
    userRepetitions,
    setUserRepetitions
  } = useTimer();

  const [localDurations, setLocalDurations] = useState({ ...durations });
  const [localRepetitions, setLocalRepetitions] = useState(repetitions);
  const [localInfiniteLoop, setLocalInfiniteLoop] = useState(infiniteLoop);
  const [localAutoSkip, setLocalAutoSkip] = useState(autoSkip);
  const [localSoundsEnabled, setLocalSoundsEnabled] = useState(soundsEnabled);
  const [localVibrationEnabled, setLocalVibrationEnabled] = useState(vibrationEnabled);
  const [localUseDefaultValues, setLocalUseDefaultValues] = useState(useDefaultValues);
  const [cycleError, setCycleError] = useState('');

  const handleRepetitionsChange = (value) => {
    if (value < 2) {
      setCycleError('Minimum is 2.');
      setTimeout(() => setCycleError(''), 3000);
    } else {
      setLocalRepetitions(value);
    }
  };

  const handleSave = () => {
    if (localRepetitions < 2) {
      setCycleError('Minimum is 2.');
      setTimeout(() => setCycleError(''), 3000);
      return;
    }

    if (localUseDefaultValues) {
      setDurations({ focus: 25, break: 5, longBreak: 15 });
      setRepetitions(4);
    } else {
      setUserDurations(localDurations);
      setUserRepetitions(localRepetitions);
      setDurations(localDurations);
      setRepetitions(localRepetitions);
    }

    setInfiniteLoop(localInfiniteLoop);
    setAutoSkip(localAutoSkip);
    setSoundsEnabled(localSoundsEnabled);
    setVibrationEnabled(localVibrationEnabled);
    setUseDefaultValues(localUseDefaultValues);

    onClose();
  };

  useEffect(() => {
    if (!localUseDefaultValues) {
      setLocalDurations(userDurations);
      setLocalRepetitions(userRepetitions);
    }
  }, [localUseDefaultValues, userDurations, userRepetitions]);

  return (
    <div className="settings-overlay">
      <div className="settings-panel" style={{ backgroundColor: themes[theme].background, color: themes[theme].text }}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button 
            className="close-btn" 
            onClick={onClose}
            style={{ 
              backgroundColor: themes[theme].button + '33',
              color: themes[theme].text 
            }}
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="settings-group">
          <h3>Appearance</h3>
          <ThemeSwitcher />
        </div>

        <div className="settings-group">
          <h3>Timer Options</h3>
          <div className="option-list">
            <label className="switch">
              <input
                type="checkbox"
                checked={localInfiniteLoop}
                onChange={(e) => setLocalInfiniteLoop(e.target.checked)}
                className="hidden-checkbox"
              />
              <span 
                className="slider"
                style={{ backgroundColor: localInfiniteLoop ? themes[theme].button : '#ccc' }}
              ></span>
              Infinite Loop
            </label>

            <label className="switch">
              <input
                type="checkbox"
                checked={localAutoSkip}
                onChange={(e) => setLocalAutoSkip(e.target.checked)}
                className="hidden-checkbox"
              />
              <span 
                className="slider"
                style={{ backgroundColor: localAutoSkip ? themes[theme].button : '#ccc' }}
              ></span>
              Auto-Skip Timers
            </label>
            
            <label className="switch">
              <input
                type="checkbox"
                checked={localSoundsEnabled}
                onChange={(e) => setLocalSoundsEnabled(e.target.checked)}
                className="hidden-checkbox"
              />
              <span 
                className="slider"
                style={{ backgroundColor: localSoundsEnabled ? themes[theme].button : '#ccc' }}
              ></span>
              Enable Sounds
            </label>
            
            {localSoundsEnabled && (
              <div className="volume-control">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  style={{ 
                    accentColor: themes[theme].button,
                    width: '120px'
                  }}
                />
                <span>{Math.round(volume * 100)}%</span>
              </div>
            )}
            
            <label className="switch">
              <input
                type="checkbox"
                checked={localVibrationEnabled}
                onChange={(e) => setLocalVibrationEnabled(e.target.checked)}
                className="hidden-checkbox"
              />
              <span 
                className="slider"
                style={{ backgroundColor: localVibrationEnabled ? themes[theme].button : '#ccc' }}
              ></span>
              Enable Vibration <span className="vibration-note">(smartphones only)</span>
            </label>
          </div>
        </div>

        <div className="settings-group">
          <h3>Timer Durations (minutes)</h3>
          <div className="option-list">
            <label className="switch">
              <input
                type="checkbox"
                checked={localUseDefaultValues}
                onChange={(e) => setLocalUseDefaultValues(e.target.checked)}
                className="hidden-checkbox"
              />
              <span 
                className="slider"
                style={{ backgroundColor: localUseDefaultValues ? themes[theme].button : '#ccc' }}
              ></span>
              Default
            </label>
          </div>
          
          {localUseDefaultValues && (
            <div className="default-values-info">
              <p>Focus: 25 minutes</p>
              <p>Break: 5 minutes</p>
              <p>Long Break: 15 minutes</p>
              <p>Long Break Cycle: 4 sessions</p>
            </div>
          )}
          
          {!localUseDefaultValues && (
            <>
              <div className="duration-controls">
                {Object.entries(localDurations).map(([phase, duration]) => (
                  <div key={phase} className="duration-row">
                    <label>{phase.charAt(0).toUpperCase() + phase.slice(1).replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setLocalDurations(prev => ({...prev, [phase]: Number(e.target.value)}))}
                      min="1"
                    />
                  </div>
                ))}
              </div>

              <div className="duration-row">
                <label>Long Break Cycle</label>
                <input
                  type="number"
                  value={localRepetitions}
                  onChange={(e) => handleRepetitionsChange(Number(e.target.value))}
                  min="1"
                />
                {cycleError && <span className="error-message">{cycleError}</span>}
              </div>
            </>
          )}
        </div>

        <button 
          className="save-button" 
          onClick={handleSave}
          style={{ backgroundColor: themes[theme].button }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;