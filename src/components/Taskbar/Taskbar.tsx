import { useEffect, useRef, useState } from 'react';
import styles from './Taskbar.module.css';
import { format } from 'date-fns';
import { useWindowContext } from '../../context/useWindowContext';

const systemTrayItems = [
  { id: 'fullscreen', name: 'Fullscreen', icon: '/assets/fullscreen.png' },
  { id: 'security', name: 'Security', icon: '/assets/Security.png' },
  { id: 'volume', name: 'Volume', icon: '/assets/Volume.png' },
];

export const Taskbar = () => {
  const { windows, focusedWindowId, focusWindow, toggleMinimize } =
    useWindowContext();
  const [time, setTime] = useState<string>('');
  const [isVolumeSliderOpen, setIsVolumeSliderOpen] = useState(false);
  const [volume, setVolume] = useState(100);
  const volumeSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      setTime(format(new Date(), 'p'));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const sortedWindows = [...windows].sort((a, b) => a.order - b.order);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        volumeSliderRef.current &&
        !volumeSliderRef.current.contains(event.target as Node)
      ) {
        setIsVolumeSliderOpen(false);
      }
    };

    if (isVolumeSliderOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVolumeSliderOpen]);

  return (
    <div className={styles.taskbar}>
      <div id={styles.startButton}></div>
      <div className={styles.bar}>
        {sortedWindows.map((window) => {
          const isActive = focusedWindowId === window.id && !window.isMinimized;

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
      <div className={styles['system-tray']} ref={volumeSliderRef}>
        {systemTrayItems.map((item) => (
          <div
            key={item.id}
            className={styles['system-tray-item']}
            style={{ backgroundImage: `url(${item.icon})` }}
            onClick={
              item.id === 'volume'
                ? () => setIsVolumeSliderOpen(!isVolumeSliderOpen)
                : undefined
            }
          ></div>
        ))}
        {isVolumeSliderOpen && (
          <div className={styles['volume-slider-popup']}>
            <div className={styles['volume-text']}>Volume</div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className={styles['volume-slider']}
            />
            <div className={styles['volume-mute']}>
              <input
                type="checkbox"
                className={styles['volume-mute-checkbox']}
              />
              <span className={styles['volume-mute-text']}>Mute</span>
            </div>
          </div>
        )}
        <div className={styles['time']}>{time}</div>
      </div>
    </div>
  );
};
