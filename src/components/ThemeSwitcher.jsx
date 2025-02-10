import React from 'react';
import { useTimer } from '../contexts/TimerContext';

const ThemeSwitcher = () => {
  const { theme, setTheme, themes } = useTimer();

  return (
    <div className="theme-switcher">
      {Object.keys(themes).map((t) => (
        <button
          key={t}
          className={`theme-btn ${theme === t ? 'active' : ''}`}
          onClick={() => setTheme(t)}
          style={{
            backgroundColor: themes[t].background,
            color: themes[t].text,
            borderColor: theme === t ? themes[t].button : 'transparent'
          }}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;