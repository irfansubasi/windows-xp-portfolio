import { useEffect, useRef } from 'react';
import { useWindowContext } from '../../../../context/useWindowContext';
import { useVolume } from '../../../../context/VolumeContext';
import styles from './GameContent.module.css';

export default function PinballGameContent() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { focusedWindowId, focusWindow } = useWindowContext();
  const { masterVolume, isMuted, perAppVolumes, registerApp, unregisterApp } =
    useVolume();

  useEffect(() => {
    registerApp('pinball', 1);
    return () => {
      unregisterApp('pinball');
    };
  }, [registerApp, unregisterApp]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleClick = () => {
      iframe.focus();
      try {
        iframe.contentWindow?.focus();
      } catch (e) {}
    };

    iframe.addEventListener('click', handleClick);

    const checkFocus = () => {
      if (iframe.contentWindow) {
        try {
          iframe.contentWindow.focus();
        } catch (e) {}
      }
    };

    const timeoutId = setTimeout(checkFocus, 100);

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
      iframe.removeEventListener('click', handleClick);
      clearTimeout(timeoutId);
      window.removeEventListener('message', handleMessage);
    };
  }, [focusedWindowId, focusWindow]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;

    const appVolume = perAppVolumes.pinball ?? 1;
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
        src="/assets/games/Pinball/index.html"
        width="100%"
        height="100%"
        title="Pinball"
        style={{ border: 'none', outline: 'none' }}
        tabIndex={0}
      />
    </div>
  );
}
