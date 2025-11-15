import { useState } from 'react';
import styles from './Desktop.module.css';

interface DesktopIcon {
  id: string;
  name: string;
  icon: string;
}

const desktopIcons: DesktopIcon[] = [
  { id: 'resume', name: 'Resume', icon: '/assets/PDF.ico' },
  {
    id: 'aboutme',
    name: 'About Me',
    icon: '/assets/Information.png',
  },
  {
    id: 'contact',
    name: 'Contact Me',
    icon: '/assets/mail.png',
  },
];

export const Desktop = () => {
  const [icons] = useState(desktopIcons);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  return (
    <div className={styles.desktop}>
      <div className={styles['without-taskbar']}>
        <div className={styles['icons-container']}>
          {icons.map((icon) => (
            <div
              key={icon.id}
              className={styles.icon}
              onClick={() => setSelectedIcon(icon.id)}
            >
              <img
                src={icon.icon}
                alt={icon.name}
                className={styles['icon-image']}
                draggable={false}
              />
              <span
                className={`${styles['icon-name']} ${
                  selectedIcon === icon.id ? styles.selected : ''
                }`}
              >
                {icon.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
