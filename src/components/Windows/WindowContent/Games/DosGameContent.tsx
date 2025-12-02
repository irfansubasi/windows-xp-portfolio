import styles from './GameContent.module.css';
import { useEffect, useRef, useState } from 'react';
import { useWindowContext } from '../../../../context/useWindowContext';
import { useVolume } from '../../../../context/VolumeContext';

interface DosGameContentProps {
  gameUrl: string;
  appId?: string;
}

export const DosGameContent = ({ gameUrl, appId }: DosGameContentProps) => {
  const dosRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { focusWindow } = useWindowContext();

  const dosInstanceRef = useRef<any>(null);

  const { masterVolume, isMuted, perAppVolumes } = useVolume();

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

    dosInstanceRef.current = dosInstance;

    return () => {
      try {
        dosInstanceRef.current?.stop?.();
      } catch (e) {
        console.log('Dos cleanup error:', e);
      }
      dosInstanceRef.current = null;
    };
  }, [isScriptLoaded, gameUrl]);

  useEffect(() => {
    if (!dosInstanceRef.current) return;

    const appVolume =
      appId && perAppVolumes[appId] !== undefined ? perAppVolumes[appId] : 1;

    const effectiveVolume = isMuted ? 0 : masterVolume * appVolume;

    try {
      dosInstanceRef.current.setVolume?.(effectiveVolume);
    } catch (e) {
      console.log('Dos setVolume error:', e);
    }
  }, [masterVolume, isMuted, perAppVolumes, appId]);

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
