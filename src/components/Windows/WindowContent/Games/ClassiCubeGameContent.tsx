import { useEffect, useRef } from 'react';
import { useWindowContext } from '../../../../context/useWindowContext';
import styles from './GameContent.module.css';

export default function ClassiCubeGameContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { focusWindow } = useWindowContext();

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data === 'focus-window') {
        let parent = containerRef.current?.parentElement;
        while (parent) {
          const windowId = parent.getAttribute('data-window-id');
          if (windowId) {
            focusWindow(windowId);
            break;
          }
          parent = parent.parentElement;
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [focusWindow]);

  return (
    <div ref={containerRef} className={styles.gameContainer}>
      <iframe
        src="/assets/games/ClassiCube/index.html"
        width="100%"
        height="100%"
        title="ClassiCube"
        style={{ border: 'none', outline: 'none' }}
        tabIndex={0}
      />
    </div>
  );
}
