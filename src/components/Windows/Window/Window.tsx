import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, type MotionProps } from 'motion/react';
import styles from './Window.module.css';
import { TitleBar } from '../TitleBar/TitleBar';
import { Menubar } from '../MenuBar/Menubar';
import { Toolbar } from '../Toolbar/Toolbar';
import { AddressBar } from '../AddressBar/AddressBar';
import { useWindowContext } from '../../../context/useWindowContext';
import { WindowContent } from '../WindowContent/WindowContent';
import { getWindowDefinition } from '../../../config/windowDefinitions';

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
    openWindow,
  } = useWindowContext();

  const currentWindow = windows.find((w) => w.id === id);
  const isMaximized = currentWindow?.isMaximized;
  const isActive = focusedWindowId === id;
  const disableResize = currentWindow?.disableResize ?? false;
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

  const handleContactSend = (payload: { subject: string; body: string }) => {
    const params = new URLSearchParams({
      to: 'irfannsubasi@gmail.com',
      su: payload.subject,
      body: payload.body,
    });
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&${params.toString()}`,
      '_blank'
    );
  };

  const handleSocialClick = (label: string) => {
    if (label === 'LinkedIn') {
      window.open('https://www.linkedin.com/in/irfansubasi/', '_blank');
    } else if (label === 'GitHub') {
      window.open('https://github.com/irfansubasi/', '_blank');
    }
  };

  const handleResumeClick = () => {
    const resumeDefinition = getWindowDefinition('resume');
    if (!resumeDefinition) return;

    openWindow(
      resumeDefinition.id,
      resumeDefinition.name,
      resumeDefinition.icon,
      resumeDefinition.windowContent,
      resumeDefinition.windowConfig?.size,
      resumeDefinition.windowConfig?.toolbarItems,
      {
        hideAddressBar: resumeDefinition.windowConfig?.hideAddressBar,
        hideToolbar: resumeDefinition.windowConfig?.hideToolbar,
        hideMenubar: resumeDefinition.windowConfig?.hideMenubar,
      }
    );
  };

  const handleContactClick = () => {
    const contactDefinition = getWindowDefinition('contact');
    if (!contactDefinition) return;

    openWindow(
      contactDefinition.id,
      contactDefinition.name,
      contactDefinition.icon,
      contactDefinition.windowContent,
      contactDefinition.windowConfig?.size,
      contactDefinition.windowConfig?.toolbarItems,
      {
        hideAddressBar: contactDefinition.windowConfig?.hideAddressBar,
        hideToolbar: contactDefinition.windowConfig?.hideToolbar,
        hideMenubar: contactDefinition.windowConfig?.hideMenubar,
      }
    );
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
    if (item.label === 'Contact Me' && id === 'resume') {
      return {
        ...item,
        onClick: handleContactClick,
      };
    }
    if (item.label === 'Send' && id === 'contact') {
      return {
        ...item,
        onClick: () => handleContactSend(contactLastPayload.current),
      };
    }
    if (id === 'aboutme' && item.label === 'LinkedIn') {
      return {
        ...item,
        onClick: () => handleSocialClick('LinkedIn'),
      };
    }
    if (id === 'aboutme' && item.label === 'GitHub') {
      return {
        ...item,
        onClick: () => handleSocialClick('GitHub'),
      };
    }
    if (id === 'aboutme' && item.label === 'Resume') {
      return {
        ...item,
        onClick: handleResumeClick,
      };
    }
    return item;
  });
  const contactLastPayload = useRef<{
    subject: string;
    body: string;
  }>({
    subject: '',
    body: '',
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
    minWidth: 0,
    minHeight: 0,
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
    if (!windowRef.current || isMaximized || disableResize) return;

    focusWindow(id);
    const rect = windowRef.current.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(windowRef.current);
    setIsResizing(true);
    setResizeDirection(direction);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
      left: lastPositionRef.current.x,
      top: lastPositionRef.current.y,
      minWidth: parseFloat(computedStyle.minWidth) || 0,
      minHeight: parseFloat(computedStyle.minHeight) || 0,
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
          minWidth,
          minHeight,
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

        if (resizeDirection.includes('e')) {
          newWidth = Math.max(
            minWidth,
            Math.min(startWidth + deltaX, viewportWidth - startLeft)
          );
        }
        if (resizeDirection.includes('w')) {
          newWidth = Math.max(minWidth, startWidth - deltaX);
          newX = startLeft + (startWidth - newWidth);
          newX = Math.max(0, newX);
          if (newX === 0) {
            newWidth = Math.min(newWidth, startLeft + startWidth);
          }
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(
            minHeight,
            Math.min(
              startHeight + deltaY,
              viewportHeight - startTop - TASKBAR_HEIGHT
            )
          );
        }
        if (resizeDirection.includes('n')) {
          newHeight = Math.max(minHeight, startHeight - deltaY);
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
        {!currentWindow?.hideMenubar && <Menubar />}
        {!currentWindow?.hideToolbar && <Toolbar items={toolbarItems} />}
        {!currentWindow?.hideAddressBar && (
          <AddressBar path={path} icon={icon} />
        )}

        <WindowContent
          isZoomed={id === 'resume' ? isZoomed : undefined}
          onZoomToggle={id === 'resume' ? handleZoomToggle : undefined}
          onContactSend={
            id === 'contact'
              ? (payload) => {
                  contactLastPayload.current = payload;
                }
              : undefined
          }
        >
          {children}
        </WindowContent>
      </div>
      {!disableResize &&
        resizeHandles.map((direction) => (
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
