import styles from './GameContent.module.css';
import { useEffect, useRef, useState } from 'react';
import { useWindowContext } from '../../../../context/useWindowContext';

declare global {
  interface Window {
    Dos: (
      element: HTMLElement,
      options: { url: string; autoStart: boolean }
    ) => any;
  }
}

interface DosGameContentProps {
  gameUrl: string;
}

export const DosGameContent = ({ gameUrl }: DosGameContentProps) => {
  const dosRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { focusWindow } = useWindowContext();

  useEffect(() => {
    const checkScript = () => {
      if (window.Dos) {
        setIsScriptLoaded(true);
      } else {
        setTimeout(checkScript, 100);
      }
    };

    checkScript();
  }, []);

  useEffect(() => {
    if (!dosRef.current || !isScriptLoaded || !window.Dos) return;

    const dosInstance = window.Dos(dosRef.current, {
      url: gameUrl,
      autoStart: true,
    });

    return () => {
      try {
        dosInstance?.stop?.();
      } catch (e) {
        console.log('Dos cleanup error:', e);
      }
    };
  }, [isScriptLoaded, gameUrl]);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleMouseDown = () => {
      let parent = containerRef.current?.parentElement;
      while (parent) {
        const windowId = parent.getAttribute('data-window-id');
        if (windowId) {
          focusWindow(windowId);
          break;
        }
        parent = parent.parentElement;
      }
    };

    const container = containerRef.current;
    container.addEventListener('mousedown', handleMouseDown, true);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown, true);
    };
  }, [focusWindow]);

  return (
    <div ref={containerRef} className={styles.gameContainer}>
      <div ref={dosRef} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};
