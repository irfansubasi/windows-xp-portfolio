import { useEffect } from 'react';
import { useWindowContext } from '../../context/WindowContext';
import { WebampPlayer, disposeWebamp } from './Webamp';

export const WebampManager = () => {
  const { windows, focusWindow, closeWindow } = useWindowContext();

  const webampWindow = windows.find((w) => w.id === 'webamp');

  useEffect(() => {
    if (!webampWindow) {
      disposeWebamp();
    }
  }, [webampWindow]);

  if (!webampWindow) return null;

  return (
    <WebampPlayer
      isOpen={!webampWindow.isMinimized}
      zIndex={webampWindow.zIndex}
      position={webampWindow.position}
      onFocus={() => focusWindow('webamp')}
      onClose={() => closeWindow('webamp')}
    />
  );
};
