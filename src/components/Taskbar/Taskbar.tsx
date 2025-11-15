import { useEffect, useState } from 'react';
import styles from './Taskbar.module.css';
import { format } from 'date-fns';

const systemTrayItems = [
  { id: 'fullscreen', name: 'Fullscreen', icon: '/assets/fullscreen.png' },
  { id: 'security', name: 'Security', icon: '/assets/Security.png' },
  { id: 'volume', name: 'Volume', icon: '/assets/Volume.png' },
];

export const Taskbar = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setTime(format(new Date(), 'p'));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.taskbar}>
      <div id={styles.startButton}></div>
      <div className={styles.bar}></div>
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
