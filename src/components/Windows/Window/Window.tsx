import { useState, useEffect, useRef, type ReactNode } from 'react';
import styles from './Window.module.css';
import { TitleBar } from '../TitleBar/TitleBar';
import { Menubar } from '../MenuBar/Menubar';
import { Toolbar } from '../Toolbar/Toolbar';
import { AddressBar } from '../AddressBar/AddressBar';
import { useWindowContext } from '../../../context/WindowContext';
import { WindowContent } from '../WindowContent/WindowContent';

interface WindowProps {
  id: string;
  title: string;
  children: ReactNode;
  icon?: string;
  position: { x: number; y: number };
  zIndex: number;
}

export const Window = ({
  id,
  title,
  children,
  icon,
  position: initialPosition,
  zIndex,
}: WindowProps) => {
  const { updateWindowPosition, focusWindow, closeWindow } = useWindowContext();
  const [position, setPosition] = useState(initialPosition);
  const windowRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastPositionRef = useRef(initialPosition);

  useEffect(() => {
    if (
      windowRef.current &&
      initialPosition.x === 0 &&
      initialPosition.y === 0
    ) {
      const rect = windowRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const centeredPosition = {
        x: (viewportWidth - rect.width) / 2,
        y: (viewportHeight - rect.height) / 2,
      };
      setPosition(centeredPosition);
      lastPositionRef.current = centeredPosition;
      updateWindowPosition(id, centeredPosition);
    }
  }, [id, updateWindowPosition, initialPosition.x, initialPosition.y]);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

        const newPosition = { x: newX, y: newY };
        setPosition(newPosition);
        lastPositionRef.current = newPosition;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      isDraggingRef.current = false;
      updateWindowPosition(id, lastPositionRef.current);
    };

    if (isDragging) {
      isDraggingRef.current = true;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, id, updateWindowPosition]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (!windowRef.current) return;

    focusWindow(id);
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
        zIndex: zIndex,
      }}
    >
      <TitleBar
        title={title}
        icon={icon}
        onMouseDown={handleTitleBarMouseDown}
        onClose={() => closeWindow(id)}
      />
      <div className={styles.content}>
        <Menubar />
        <Toolbar />
        <AddressBar path={path} icon={icon} />
        <WindowContent>{children}</WindowContent>
      </div>
    </div>
  );
};
