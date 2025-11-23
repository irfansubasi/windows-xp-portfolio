import { useEffect, useRef } from 'react';
import { useWindowContext } from '../../../../context/useWindowContext';

export default function QuakeGameContent() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { focusedWindowId } = useWindowContext();
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

    return () => {
      iframe.removeEventListener('click', handleClick);
      clearTimeout(timeoutId);
    };
  }, [focusedWindowId]);

  return (
    <iframe
      ref={iframeRef}
      src="/assets/games/Quake/Quake3.htm"
      width="100%"
      height="100%"
      title="Quake"
      style={{ border: 'none', outline: 'none' }}
      tabIndex={0}
    />
  );
}
