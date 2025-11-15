import React, { useState, useEffect, useRef } from 'react';
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
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const desktopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isSelecting && desktopRef.current) {
        const rect = desktopRef.current.getBoundingClientRect();
        setCurrentPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false);
      }
    };

    if (isSelecting) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isSelecting]);

  const handleDesktopClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isIcon = target.closest(`.${styles.icon}`);

    if (!isIcon) {
      setSelectedIcon(null);
    }
  };

  const handleIconClick = (e: React.MouseEvent, iconId: string) => {
    e.stopPropagation();
    setSelectedIcon(iconId);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isIcon = target.closest(`.${styles.icon}`);

    if (!isIcon && desktopRef.current) {
      const rect = desktopRef.current.getBoundingClientRect();

      setIsSelecting(true);

      setStartPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setCurrentPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div className={styles.desktop} onClick={handleDesktopClick}>
      <div
        ref={desktopRef}
        className={styles['without-taskbar']}
        onMouseDown={handleMouseDown}
      >
        <div className={styles['icons-container']}>
          {icons.map((icon) => (
            <div
              key={icon.id}
              className={styles.icon}
              onClick={(e) => handleIconClick(e, icon.id)}
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
        {isSelecting && (
          <div
            className={styles['selection-box']}
            style={{
              left: Math.min(startPos.x, currentPos.x),
              top: Math.min(startPos.y, currentPos.y),
              width: Math.abs(currentPos.x - startPos.x),
              height: Math.abs(currentPos.y - startPos.y),
            }}
          ></div>
        )}
      </div>
    </div>
  );
};
