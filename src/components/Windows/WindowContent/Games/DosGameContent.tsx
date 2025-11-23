import styles from './GameContent.module.css';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    Dos: (element: HTMLElement, options: { url: string }) => any;
  }
}

interface DosGameContentProps {
  gameUrl: string;
}

export const DosGameContent = ({ gameUrl }: DosGameContentProps) => {
  const dosRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

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
    });

    return () => {
      try {
        dosInstance?.stop?.();
      } catch (e) {
        console.log('Dos cleanup error:', e);
      }
    };
  }, [isScriptLoaded, gameUrl]);

  return (
    <div className={styles.gameContainer}>
      <div ref={dosRef} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};
