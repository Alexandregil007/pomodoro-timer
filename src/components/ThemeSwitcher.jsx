import React from 'react';
import { useTimer } from '../contexts/TimerContext';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTimer();
  const themes = [
    { name: 'light', color: '#fff' },
    { name: 'dark', color: '#2d2d2d' },
    { name: 'pink', color: '#ff99cc' },
    { name: 'ocean', color: '#99ccff' }
  ];

  return (
    <div className="theme-switcher">
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          style={{ 
            backgroundColor: t.color,
            border: theme === t.name ? '2px solid #e74c3c' : '2px solid #fff'
          }}
        />
      ))}
    </div>
  );
};

export default ThemeSwitcher;