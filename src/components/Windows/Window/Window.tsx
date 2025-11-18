import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, type MotionProps } from 'motion/react';
import styles from './Window.module.css';
import { TitleBar } from '../TitleBar/TitleBar';
import { Menubar } from '../MenuBar/Menubar';
import { Toolbar } from '../Toolbar/Toolbar';
import { AddressBar } from '../AddressBar/AddressBar';
import { useWindowContext } from '../../../context/useWindowContext';
import { WindowContent } from '../WindowContent/WindowContent';

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

interface WindowProps {
  id: string;
  title: string;
  children: ReactNode;
  icon?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  motionProps?: Pick<MotionProps, 'initial' | 'animate' | 'transition'>;
}

export const Window = ({
  id,
  title,
  children,
  icon,
  position: initialPosition,
  size: initialSize,
  zIndex,
  motionProps,
}: WindowProps) => {
  const {
    windows,
    focusedWindowId,
    updateWindowPosition,
    updateWindowSize,
    focusWindow,
    closeWindow,
    toggleMaximize,
    toggleMinimize,
  } = useWindowContext();

  const currentWindow = windows.find((w) => w.id === id);
  const isMaximized = currentWindow?.isMaximized;
  const isActive = focusedWindowId === id;
  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoomToggle = () => {
    setIsZoomed((prev) => !prev);
  };

  const handleSave = () => {
    const link = document.createElement('a');
    link.href = '/assets/cv/IrfanSubasiCV_ENG.pdf';
    link.download = 'IrfanSubasiCV_ENG.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toolbarItems = currentWindow?.toolbarItems?.map((item) => {
    if (item.label === 'Zoom' && id === 'resume') {
      return {
        ...item,
        onClick: handleZoomToggle,
        isActive: isZoomed,
      };
    }
    if (item.label === 'Save' && id === 'resume') {
      return {
        ...item,
        onClick: handleSave,
      };
    }
    return item;
  });
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const windowRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastPositionRef = useRef(initialPosition);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] =
    useState<ResizeDirection | null>(null);
  const resizeStartRef = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });
  const lastSizeRef = useRef(initialSize);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const shouldCenterOnMountRef = useRef(
    initialPosition.x === 0 && initialPosition.y === 0
  );
  const hasCenteredRef = useRef(false);

  useEffect(() => {
    if (isDragging || isResizing) return;
    lastPositionRef.current = initialPosition;
  }, [initialPosition, isDragging, isResizing]);

  useEffect(() => {
    if (isResizing) return;
    lastSizeRef.current = initialSize;
  }, [initialSize, isResizing]);

  useEffect(() => {
    if (
      !windowRef.current ||
      !shouldCenterOnMountRef.current ||
      hasCenteredRef.current
    ) {
      return;
    }
    const rect = windowRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centeredPosition = {
      x: (viewportWidth - rect.width) / 2,
      y: (viewportHeight - rect.height) / 2,
    };
    setPosition(centeredPosition);
    lastPositionRef.current = centeredPosition;
    hasCenteredRef.current = true;
    updateWindowPosition(id, centeredPosition);
  }, [id, updateWindowPosition]);

  const displayPosition = isDragging || isResizing ? position : initialPosition;
  const currentSize = isResizing ? size : initialSize;

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

  const handleWindowMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive =
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'A' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.closest('button, input, a, textarea, select, [role="button"]');

    if (!isInteractive && !isActive) {
      focusWindow(id);
    }
  };

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (!windowRef.current || isMaximized) return;

    focusWindow(id);
    const rect = windowRef.current.getBoundingClientRect();
    setPosition(initialPosition);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleResizeStart = (
    e: React.MouseEvent,
    direction: ResizeDirection
  ) => {
    e.stopPropagation();
    if (!windowRef.current || isMaximized) return;

    focusWindow(id);
    const rect = windowRef.current.getBoundingClientRect();
    setIsResizing(true);
    setResizeDirection(direction);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
      left: lastPositionRef.current.x,
      top: lastPositionRef.current.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && resizeDirection && windowRef.current) {
        const {
          x: startX,
          y: startY,
          width: startWidth,
          height: startHeight,
          left: startLeft,
          top: startTop,
        } = resizeStartRef.current;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const TASKBAR_HEIGHT = 30;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newX = startLeft;
        let newY = startTop;

        const MIN_WIDTH = 500;
        const MIN_HEIGHT = 400;

        if (resizeDirection.includes('e')) {
          newWidth = Math.max(
            MIN_WIDTH,
            Math.min(startWidth + deltaX, viewportWidth - startLeft)
          );
        }
        if (resizeDirection.includes('w')) {
          newWidth = Math.max(MIN_WIDTH, startWidth - deltaX);
          newX = startLeft + (startWidth - newWidth);
          newX = Math.max(0, newX);
          if (newX === 0) {
            newWidth = Math.min(newWidth, startLeft + startWidth);
          }
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(
            MIN_HEIGHT,
            Math.min(
              startHeight + deltaY,
              viewportHeight - startTop - TASKBAR_HEIGHT
            )
          );
        }
        if (resizeDirection.includes('n')) {
          newHeight = Math.max(MIN_HEIGHT, startHeight - deltaY);
          newY = startTop + (startHeight - newHeight);
          newY = Math.max(0, newY);
          if (newY === 0) {
            newHeight = Math.min(newHeight, startTop + startHeight);
          }
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
        lastSizeRef.current = { width: newWidth, height: newHeight };
        lastPositionRef.current = { x: newX, y: newY };
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        setResizeDirection(null);
        updateWindowSize(id, lastSizeRef.current);
        updateWindowPosition(id, lastPositionRef.current);
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isResizing,
    resizeDirection,
    id,
    updateWindowSize,
    updateWindowPosition,
    size,
  ]);

  const generatePath = (title: string) => {
    return `C:\\IrfanSubasi\\Desktop\\${title}`;
  };

  const path = generatePath(title);

  const resizeHandles: ResizeDirection[] = [
    'n',
    's',
    'e',
    'w',
    'ne',
    'nw',
    'se',
    'sw',
  ];

  return (
    <motion.div
      initial={motionProps?.initial}
      animate={motionProps?.animate}
      transition={motionProps?.transition}
      ref={windowRef}
      className={`${styles.window} ${!isActive ? styles.inactive : ''}`}
      data-window="true"
      data-window-id={id}
      style={{
        left: `${displayPosition.x}px`,
        top: `${displayPosition.y}px`,
        width: `${currentSize.width}px`,
        height: `${currentSize.height}px`,
        zIndex: zIndex,
        pointerEvents: currentWindow?.isMinimized ? 'none' : 'auto',
      }}
      onMouseDown={handleWindowMouseDown}
    >
      <TitleBar
        title={title}
        icon={icon}
        onMouseDown={handleTitleBarMouseDown}
        onMinimize={() => toggleMinimize(id)}
        onMaximize={() => toggleMaximize(id)}
        onClose={() => closeWindow(id)}
        isMaximized={!!isMaximized}
        isActive={isActive}
      />
      <div className={styles.content}>
        <Menubar />
        <Toolbar items={toolbarItems} />
        {!currentWindow?.hideAddressBar && (
          <AddressBar path={path} icon={icon} />
        )}
        <WindowContent
          isZoomed={id === 'resume' ? isZoomed : undefined}
          onZoomToggle={id === 'resume' ? handleZoomToggle : undefined}
        >
          {children}
        </WindowContent>
      </div>
      {resizeHandles.map((direction) => (
        <div
          key={direction}
          className={styles.resizeHandle}
          data-direction={direction}
          onMouseDown={(e) => handleResizeStart(e, direction)}
        />
      ))}
    </motion.div>
  );
};
