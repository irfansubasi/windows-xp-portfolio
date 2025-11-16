import { useState, useEffect, useRef, type ReactNode } from 'react';
import styles from './Window.module.css';
import { TitleBar } from '../TitleBar/TitleBar';
import { Menubar } from '../MenuBar/Menubar';
import { Toolbar } from '../Toolbar/Toolbar';
import { AddressBar } from '../AddressBar/AddressBar';

interface WindowProps {
  title: string;
  children: ReactNode;
  icon?: string;
  initialX?: number;
  initialY?: number;
}

export const Window = ({
  title,
  children,
  icon,
  initialX,
  initialY,
}: WindowProps) => {
  const [position, setPosition] = useState(() => {
    if (initialX !== undefined && initialY !== undefined) {
      return { x: initialX, y: initialY };
    }
    return { x: 0, y: 0 };
  });

  useEffect(() => {
    if (windowRef.current && initialX === undefined && initialY === undefined) {
      const rect = windowRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      setPosition({
        x: (viewportWidth - rect.width) / 2,
        y: (viewportHeight - rect.height) / 2,
      });
    }
  }, [initialX, initialY]);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        const windowWidth = rect.width;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;

        const minX = -windowWidth + 100;
        const maxX = viewportWidth - 100;
        newX = Math.max(minX, Math.min(maxX, newX));

        const minY = -20;
        const maxY = viewportHeight - 50;
        newY = Math.max(minY, Math.min(maxY, newY));

        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (!windowRef.current) return;

    const rect = windowRef.current.getBoundingClientRect();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const generatePath = (title: string) => {
    return `C:\\IrfanSubasi\\Desktop\\${title}`;
  };

  const path = generatePath(title);

  return (
    <div
      ref={windowRef}
      className={styles.window}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <TitleBar
        title={title}
        icon={icon}
        onMouseDown={handleTitleBarMouseDown}
      />
      <div className={styles.content}>
        <Menubar />
        <Toolbar />
        <AddressBar path={path} icon={icon} />
        {children}
      </div>
    </div>
  );
};
