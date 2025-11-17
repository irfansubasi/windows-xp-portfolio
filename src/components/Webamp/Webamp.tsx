import { useEffect, useRef } from 'react';
import Webamp from 'webamp';

let globalWebampInstance: Webamp | null = null;

export const disposeWebamp = () => {
  if (globalWebampInstance) {
    globalWebampInstance.dispose();
    globalWebampInstance = null;
  }
  const webampElement = document.querySelector('#webamp');
  if (webampElement) {
    webampElement.remove();
  }
};

interface WebampProps {
  isOpen: boolean;
  zIndex: number;
  position: { x: number; y: number };
  onFocus: () => void;
  onClose: () => void;
}

export const WebampPlayer = ({
  isOpen,
  zIndex,
  position,
  onFocus,
  onClose,
}: WebampProps) => {
  const webampRef = useRef<Webamp | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onFocusRef = useRef(onFocus);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onFocusRef.current = onFocus;
    onCloseRef.current = onClose;
  }, [onFocus, onClose]);

  useEffect(() => {
    if (!isOpen) {
      const webampElement = document.querySelector('#webamp') as HTMLElement;
      if (webampElement) {
        webampElement.style.display = 'none';
      }
      return;
    }

    if (!containerRef.current) return;

    if (globalWebampInstance) {
      webampRef.current = globalWebampInstance;
      const webampElement = document.querySelector('#webamp') as HTMLElement;
      if (webampElement) {
        webampElement.style.display = 'block';
      }
      return;
    }

    const webamp = new Webamp({
      initialTracks: [
        {
          metaData: {
            artist: 'Sean Paul',
            title: 'Get Busy',
          },
          url: '/assets/sounds/webamp/Sean Paul - Get Busy.mp3',
        },
      ],
    });

    globalWebampInstance = webamp;
    webampRef.current = webamp;

    webamp.renderWhenReady(containerRef.current).then(() => {
      setTimeout(() => {
        const webampElement = document.querySelector('#webamp') as HTMLElement;
        if (webampElement) {
          webampElement.style.position = 'fixed';
          webampElement.style.display = 'block';
          webampElement.addEventListener('mousedown', () => {
            onFocusRef.current();
          });

          const closeButton = webampElement.querySelector(
            '[title="Close"]'
          ) as HTMLElement;
          if (closeButton) {
            closeButton.addEventListener('click', () => {
              onCloseRef.current();
            });
          }
        }
      }, 100);
    });

    return () => {
      if (webampRef.current && !isOpen) {
        const webampElement = document.querySelector('#webamp') as HTMLElement;
        if (webampElement) {
          webampElement.style.display = 'none';
        }
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const webampElement = document.querySelector('#webamp') as HTMLElement;
    if (webampElement) {
      webampElement.style.zIndex = zIndex.toString();
      webampElement.style.left = `${position.x}px`;
      webampElement.style.top = `${position.y}px`;
    }
  }, [zIndex, position.x, position.y, isOpen]);

  if (!isOpen) return null;

  return <div ref={containerRef} style={{ display: 'none' }} />;
};
