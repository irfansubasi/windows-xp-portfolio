import { useEffect, useState } from 'react';
import styles from './Taskbar.module.css';
import { format } from 'date-fns';
import { useWindowContext } from '../../context/WindowContext';

const systemTrayItems = [
  { id: 'fullscreen', name: 'Fullscreen', icon: '/assets/fullscreen.png' },
  { id: 'security', name: 'Security', icon: '/assets/Security.png' },
  { id: 'volume', name: 'Volume', icon: '/assets/Volume.png' },
];

export const Taskbar = () => {
  const { windows, focusedWindowId, focusWindow, toggleMinimize } =
    useWindowContext();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setTime(format(new Date(), 'p'));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const sortedWindows = [...windows].sort((a, b) => a.order - b.order);

  return (
    <div className={styles.taskbar}>
      <div id={styles.startButton}></div>
      <div className={styles.bar}>
        {sortedWindows.map((window) => {
          const isActive =
            focusedWindowId === window.id && !window.isMinimized;

          const handleClick = () => {
            if (window.isMinimized) {
              toggleMinimize(window.id);
              focusWindow(window.id);
              return;
            }

            if (focusedWindowId === window.id) {
              toggleMinimize(window.id);
              return;
            }

            focusWindow(window.id);
          };

          return (
            <button
              key={window.id}
              className={`${styles['taskbar-button']} ${
                isActive ? styles.active : ''
              }`}
              onClick={handleClick}
              data-taskbar-button-id={window.id}
            >
              {window.icon && (
                <img
                  src={window.icon}
                  alt=""
                  className={styles['taskbar-button-icon']}
                />
              )}
              <span className={styles['taskbar-button-text']}>
                {window.title}
              </span>
            </button>
          );
        })}
      </div>
      <div className={styles['system-tray']}>
        {systemTrayItems.map((item) => (
          <div
            key={item.id}
            className={styles['system-tray-item']}
            style={{ backgroundImage: `url(${item.icon})` }}
          ></div>
        ))}
        <div className={styles['time']}>{time}</div>
      </div>
    </div>
  );
};
