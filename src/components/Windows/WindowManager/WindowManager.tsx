import { useCallback } from 'react';
import { useWindowContext } from '../../../context/WindowContext';
import { Window } from '../Window/Window';

interface MinimizeTarget {
  x: number;
  y: number;
  scale: number;
}

export const WindowManager = () => {
  const { windows } = useWindowContext();
  const desktopWindows = windows.filter((window) => window.id !== 'webamp');

  const getMinimizeTarget = useCallback(
    (windowId: string): MinimizeTarget | null => {
      if (typeof document === 'undefined') {
        return null;
      }

      const windowElement = document.querySelector(
        `[data-window-id="${windowId}"]`
      ) as HTMLElement | null;

      const taskbarButton = document.querySelector(
        `[data-taskbar-button-id="${windowId}"]`
      ) as HTMLElement | null;

      if (!windowElement || !taskbarButton) {
        return null;
      }

      const windowRect = windowElement.getBoundingClientRect();
      const buttonRect = taskbarButton.getBoundingClientRect();

      const windowCenterX = windowRect.left + windowRect.width / 2;
      const windowCenterY = windowRect.top + windowRect.height / 2;
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;

      const x = buttonCenterX - windowCenterX;
      const y = buttonCenterY - windowCenterY;

      const widthRatio = buttonRect.width / windowRect.width;
      const heightRatio = buttonRect.height / windowRect.height;
      const scale = Math.max(Math.min(widthRatio, heightRatio, 0.4), 0.2);

      return { x, y, scale };
    },
    []
  );

  return (
    <>
      {desktopWindows.map((window) => {
        const minimizeTarget = getMinimizeTarget(window.id);

        const minimizedAnimation = minimizeTarget
          ? {
              opacity: 0,
              scale: minimizeTarget.scale,
              x: minimizeTarget.x,
              y: minimizeTarget.y,
            }
          : {
              opacity: 0,
              scale: 0.85,
              y: 40,
            };

        const motionProps = {
          initial: { opacity: 0, scale: 0.96, y: 8 },
          animate: window.isMinimized
            ? minimizedAnimation
            : { opacity: 1, scale: 1, x: 0, y: 0 },
          transition: { duration: 0.2 },
        };

        return (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            icon={window.icon}
            position={window.position}
            size={window.size}
            zIndex={window.zIndex}
            motionProps={motionProps}
          >
            {window.content}
          </Window>
        );
      })}
    </>
  );
};
