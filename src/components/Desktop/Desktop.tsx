import React, { useState, useEffect, useRef } from 'react';
import styles from './Desktop.module.css';

interface DesktopIcon {
  id: string;
  name: string;
  icon: string;
}

const desktopIcons: DesktopIcon[] = [
  { id: 'resume', name: 'Resume', icon: '/assets/PDF.ico' },
  { id: 'aboutme', name: 'About Me', icon: '/assets/Information.png' },
  { id: 'contact', name: 'Contact Me', icon: '/assets/mail.png' },
];

export const Desktop = () => {
  const [icons] = useState(desktopIcons);
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

  const desktopRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isSelecting || !desktopRef.current) return;
      const rect = desktopRef.current.getBoundingClientRect();
      setCurrentPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      const selection = {
        left: Math.min(startPos.x, e.clientX - rect.left),
        top: Math.min(startPos.y, e.clientY - rect.top),
        right: Math.max(startPos.x, e.clientX - rect.left),
        bottom: Math.max(startPos.y, e.clientY - rect.top),
      };

      const nextSelected: string[] = [];

      icons.forEach((icon) => {
        const el = iconRefs.current[icon.id];
        if (!el) return;

        const iconRect = el.getBoundingClientRect();

        const box = {
          left: iconRect.left - rect.left,
          top: iconRect.top - rect.top,
          right: iconRect.right - rect.left,
          bottom: iconRect.bottom - rect.top,
        };

        const intersects = !(
          selection.right < box.left ||
          selection.left > box.right ||
          selection.bottom < box.top ||
          selection.top > box.bottom
        );

        if (intersects) nextSelected.push(icon.id);
      });

      setSelectedIcons(nextSelected);
    };

    const handleUp = () => setIsSelecting(false);

    if (isSelecting) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [isSelecting, startPos, icons]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = desktopRef.current?.getBoundingClientRect();
    if (!desktopRef.current || !rect) return;

    const isIcon = (e.target as HTMLElement).closest(`.${styles.icon}`);
    if (!isIcon) {
      setSelectedIcons([]);
      setIsSelecting(true);
      setStartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setCurrentPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <div className={styles.desktop}>
      <div
        ref={desktopRef}
        className={styles['without-taskbar']}
        onMouseDown={handleMouseDown}
      >
        <div className={styles['icons-container']}>
          {icons.map((icon) => (
            <div
              key={icon.id}
              ref={(el) => {
                iconRefs.current[icon.id] = el;
              }}
              className={styles.icon}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIcons([icon.id]);
              }}
            >
              <img
                src={icon.icon}
                alt={icon.name}
                className={styles['icon-image']}
                draggable={false}
              />
              <span
                className={`${styles['icon-name']} ${
                  selectedIcons.includes(icon.id) ? styles.selected : ''
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
