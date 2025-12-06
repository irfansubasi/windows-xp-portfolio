import { useEffect, useRef, useState } from 'react';
import styles from './Taskbar.module.css';
import { format } from 'date-fns';
import { useWindowContext } from '../../context/useWindowContext';
import { useVolume } from '../../context/VolumeContext';

const systemTrayItems = [
  {
    id: 'fullscreen',
    name: 'Fullscreen',
    icon: '/assets/icons/fullscreen.png',
  },
  {
    id: 'security',
    name: 'Security',
    icon: '/assets/icons/Security.png',
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: '/assets/icons/Volume.png',
  },
];

export const Taskbar = () => {
  const {
    windows,
    focusedWindowId,
    focusWindow,
    toggleMinimize,
    toggleStartMenu,
  } = useWindowContext();
  const [time, setTime] = useState<string>('');
  const [isVolumeSliderOpen, setIsVolumeSliderOpen] = useState(false);
  const volumeSliderRef = useRef<HTMLDivElement>(null);
  const {
    masterVolume,
    isMuted,
    setMasterVolume,
    setMuted,
    perAppVolumes,
    setAppVolume,
  } = useVolume();

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
      <div id={styles.startButton} onClick={toggleStartMenu}></div>
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
            <div className={styles['volume-item']}>
              <div className={styles['volume-text']}>Master</div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(masterVolume * 100)}
                onChange={(e) => {
                  const v = Number(e.target.value) / 100;
                  setMasterVolume(v);
                  if (v > 0 && isMuted) {
                    setMuted(false);
                  }
                }}
                className={styles['volume-slider']}
              />
              <div className={styles['volume-mute']}>
                <input
                  type="checkbox"
                  className={styles['volume-mute-checkbox']}
                  checked={isMuted}
                  onChange={(e) => setMuted(e.target.checked)}
                />
                <span className={styles['volume-mute-text']}>Mute</span>
              </div>
            </div>
            {Object.entries(perAppVolumes).map(([id, value]) => {
              const label = id.charAt(0).toUpperCase() + id.slice(1);
              return (
                <div key={id} className={styles['volume-item']}>
                  <div className={styles['volume-text']}>{label}</div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round(value * 100)}
                    onChange={(e) => {
                      const v = Number(e.target.value) / 100;
                      setAppVolume(id, v);
                    }}
                    className={styles['volume-slider']}
                  />
                  <div className={styles['volume-mute']}>
                    <input
                      type="checkbox"
                      className={styles['volume-mute-checkbox']}
                      checked={isMuted}
                      onChange={(e) => setMuted(e.target.checked)}
                    />
                    <span className={styles['volume-mute-text']}>Mute</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className={styles['time']}>{time}</div>
      </div>
    </div>
  );
};
