import { useEffect, useRef } from 'react';
import { useWindowContext } from '../../../../context/useWindowContext';
import { useVolume } from '../../../../context/VolumeContext';
import styles from './GameContent.module.css';

export default function DxBallGameContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { focusWindow } = useWindowContext();
  const { masterVolume, isMuted, perAppVolumes, registerApp, unregisterApp } =
    useVolume();

  useEffect(() => {
    registerApp('dxball', 1);
    return () => {
      unregisterApp('dxball');
    };
  }, [registerApp, unregisterApp]);

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

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;

    const appVolume = perAppVolumes.dxball ?? 1;
    const effectiveVolume = isMuted ? 0 : masterVolume * appVolume;

    iframe.contentWindow.postMessage(
      {
        type: 'set-volume',
        volume: effectiveVolume,
      },
      '*'
    );
  }, [masterVolume, isMuted, perAppVolumes]);

  return (
    <div ref={containerRef} className={styles.gameContainer}>
      <iframe
        ref={iframeRef}
        src="/assets/games/DxBall/index.html"
        width="100%"
        height="100%"
        title="DX-Ball"
        style={{ border: 'none', outline: 'none' }}
        tabIndex={0}
      />
    </div>
  );
}
