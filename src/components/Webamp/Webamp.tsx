import { useEffect, useRef } from 'react';
import Webamp from 'webamp';
import { useVolume } from '../../context/VolumeContext';

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

  const { masterVolume, isMuted, perAppVolumes, registerApp, unregisterApp } =
    useVolume();

  const appVolume = perAppVolumes.webamp ?? 1;

  useEffect(() => {
    onFocusRef.current = onFocus;
    onCloseRef.current = onClose;
  }, [onFocus, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    registerApp('webamp', 1);
    return () => {
      unregisterApp('webamp');
    };
  }, [isOpen, registerApp, unregisterApp]);

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

  useEffect(() => {
    if (!globalWebampInstance) return;

    const effectivePercent = isMuted
      ? 0
      : Math.round(masterVolume * appVolume * 100);

    globalWebampInstance.setVolume(effectivePercent);
  }, [masterVolume, appVolume, isMuted]);

  if (!isOpen) return null;

  return <div ref={containerRef} style={{ display: 'none' }} />;
};
