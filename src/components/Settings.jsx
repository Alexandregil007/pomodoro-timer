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
    infiniteLoop,
    setInfiniteLoop,
    autoSkip,
    setAutoSkip,
    repetitions,
    useDefaultValues,
    setUseDefaultValues,
    userDurations,
    setUserDurations,
    userRepetitions,
    setUserRepetitions,
    themeSong,
    setThemeSong,
    loopSongs,
    setLoopSongs
  } = useTimer(); // Removed unused setRepetitions

  const [localDurations, setLocalDurations] = useState({ ...durations });
  const [localRepetitions, setLocalRepetitions] = useState(repetitions);
  const [localInfiniteLoop, setLocalInfiniteLoop] = useState(infiniteLoop);
  const [localAutoSkip, setLocalAutoSkip] = useState(autoSkip);
  const [localSoundsEnabled, setLocalSoundsEnabled] = useState(soundsEnabled);
  const [localVibrationEnabled, setLocalVibrationEnabled] = useState(vibrationEnabled);
  const [localUseDefaultValues, setLocalUseDefaultValues] = useState(useDefaultValues);
  const [localThemeSong, setLocalThemeSong] = useState(themeSong);
  const [cycleError, setCycleError] = useState('');

  useEffect(() => {
    if (localUseDefaultValues) {
      setLocalDurations({
        focus: 25,
        break: 5,
        longBreak: 15
      });
      setLocalRepetitions(4);
    } else {
      setLocalDurations(userDurations);
      setLocalRepetitions(userRepetitions);
    }
  }, [localUseDefaultValues, userDurations, userRepetitions]); // Added missing dependencies

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

    if (!localUseDefaultValues) {
      setUserDurations(localDurations);
      setUserRepetitions(localRepetitions);
    }

    setInfiniteLoop(localInfiniteLoop);
    setAutoSkip(localAutoSkip);
    setSoundsEnabled(localSoundsEnabled);
    setVibrationEnabled(localVibrationEnabled);
    setUseDefaultValues(localUseDefaultValues);

    onClose();
  };

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
              <span className="switch-label">Infinite Loop</span>
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
              <span className="switch-label">Auto-Skip Timers</span>
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
              <span className="switch-label">Enable Sounds</span>
            </label>
            
            {localSoundsEnabled && (
              <>
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

                <div className="theme-song-controls">
                  <label>Background Music:</label>
                  <div className="music-selector-wrapper">
                    <select
                      value={localThemeSong || ''}
                      onChange={(e) => {
                        setLocalThemeSong(e.target.value);
                        setThemeSong(e.target.value);
                        setLoopSongs(false);
                      }}
                      disabled={loopSongs}
                      style={{
                        backgroundColor: themes[theme].background,
                        color: themes[theme].text,
                        border: `1px solid ${themes[theme].button}`,
                        padding: '6px 12px',
                        borderRadius: '8px',
                        width: '100%',
                        maxWidth: '200px',
                        fontSize: '0.9rem',
                        cursor: loopSongs ? 'not-allowed' : 'pointer',
                        opacity: loopSongs ? 0.7 : 1
                      }}
                    >
                      <option value="">No Music</option>
                      <option value="song1.mp3">Song 1</option>
                      <option value="song2.mp3">Song 2</option>
                      <option value="song3.mp3">Song 3</option>
                      <option value="song4.mp3">Sky Full of Stars</option>
                      <option value="song5.mp3">Love Yourself</option>
                      <option value="song6.mp3">Glimpse of Us</option>
                    </select>
                    <button
                      className={`loop-button ${loopSongs ? 'active' : ''}`}
                      onClick={() => {
                        if (localThemeSong && localThemeSong !== "") {
                          setLoopSongs(!loopSongs);
                        }
                      }}
                      disabled={!localThemeSong || localThemeSong === ""}
                      style={{
                        marginLeft: '10px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${themes[theme].button}`,
                        backgroundColor: loopSongs ? themes[theme].button : 'transparent',
                        color: loopSongs ? '#fff' : themes[theme].text,
                        cursor: (!localThemeSong || localThemeSong === "") ? 'not-allowed' : 'pointer'
                      }}
                    >
                      🔄
                    </button>
                  </div>
                </div>
              </>
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
              <span className="switch-label">Enable Vibration <span className="vibration-note">(smartphones only)</span></span>
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
              <span className="switch-label">Default</span>
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
            <div className="horizontal-durations">
              <div className="duration-row">
                <div className="duration-item">
                  <label>Focus</label>
                  <input
                    type="number"
                    value={localDurations.focus}
                    onChange={(e) => setLocalDurations(prev => ({ 
                      ...prev, 
                      focus: Number(e.target.value) 
                    }))}
                    min="1"
                  />
                </div>
                <div className="duration-item">
                  <label>Break</label>
                  <input
                    type="number"
                    value={localDurations.break}
                    onChange={(e) => setLocalDurations(prev => ({ 
                      ...prev, 
                      break: Number(e.target.value) 
                    }))}
                    min="1"
                  />
                </div>
                <div className="duration-item">
                  <label>Long Break</label>
                  <input
                    type="number"
                    value={localDurations.longBreak}
                    onChange={(e) => setLocalDurations(prev => ({ 
                      ...prev, 
                      longBreak: Number(e.target.value) 
                    }))}
                    min="1"
                  />
                </div>
                <div className="duration-item">
                  <label>Cycle</label>
                  <input
                    type="number"
                    value={localRepetitions}
                    onChange={(e) => handleRepetitionsChange(Number(e.target.value))}
                    min="1"
                  />
                </div>
              </div>
              {cycleError && <span className="error-message">{cycleError}</span>}
            </div>
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