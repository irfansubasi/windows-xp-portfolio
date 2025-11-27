import { useEffect, useRef } from 'react';
import { useWindowContext } from '../../../../context/useWindowContext';
import styles from './GameContent.module.css';

const MIN_WINDOW_WIDTH = 100;
const MIN_WINDOW_HEIGHT = 250;
const WINDOW_PADDING_Y = 30;

export default function MinesweeperGameContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { focusWindow, updateWindowSize } = useWindowContext();

  const findWindowId = () => {
    let parent = containerRef.current?.parentElement;
    while (parent) {
      const windowId = parent.getAttribute('data-window-id');
      if (windowId) return windowId;
      parent = parent.parentElement;
    }
    return null;
  };

  useEffect(() => {
    const applySize = (width: number, height: number) => {
      const windowId = findWindowId();
      if (!windowId) return;
      updateWindowSize(windowId, {
        width: Math.max(width, MIN_WINDOW_WIDTH),
        height: Math.max(height + WINDOW_PADDING_Y, MIN_WINDOW_HEIGHT),
      });
    };

    const handleMessage = (e: MessageEvent) => {
      if (e.data === 'focus-window' || e.data?.type === 'focus-window') {
        const windowId = findWindowId();
        if (windowId) {
          focusWindow(windowId);
        }
        return;
      }

      if (
        e.data &&
        typeof e.data === 'object' &&
        e.data.type === 'minesweeper-size' &&
        typeof e.data.width === 'number' &&
        typeof e.data.height === 'number'
      ) {
        applySize(e.data.width, e.data.height);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [focusWindow, updateWindowSize]);

  return (
    <div ref={containerRef} className={styles.gameContainer}>
      <iframe
        src="/assets/games/Minesweeper/index.html"
        width="100%"
        height="100%"
        title="Minesweeper"
        style={{ border: 'none', outline: 'none' }}
        tabIndex={0}
        allow="gamepad; fullscreen; pointer-lock; autoplay"
      />
    </div>
  );
}
