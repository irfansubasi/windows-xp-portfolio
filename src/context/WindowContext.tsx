import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';

export interface WindowData {
  id: string;
  title: string;
  icon: string;
  content: ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  order: number;
  isMinimized?: boolean;
  isMaximized?: boolean;
}

interface WindowContextType {
  windows: WindowData[];
  openWindow: (
    id: string,
    title: string,
    icon: string,
    content: ReactNode
  ) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (
    id: string,
    position: { x: number; y: number }
  ) => void;
  updateWindowSize: (
    id: string,
    size: { width: number; height: number }
  ) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const useWindowContext = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowContext must be used within WindowProvider');
  }
  return context;
};

interface WindowProviderProps {
  children: ReactNode;
}

const BASE_Z_INDEX = 1000;
const WINDOW_OFFSET = 30;
const DEFAULT_WINDOW_WIDTH = 700;
const DEFAULT_WINDOW_HEIGHT = 500;

const recalculateZIndexes = (
  windows: WindowData[],
  focusedId?: string
): WindowData[] => {
  if (windows.length === 0) return [];

  const sortedWindows = [...windows].sort((a, b) => a.order - b.order);

  const focusedWindow = focusedId
    ? sortedWindows.find((w) => w.id === focusedId)
    : sortedWindows[sortedWindows.length - 1];

  if (!focusedWindow) return sortedWindows;

  const otherWindows = sortedWindows.filter((w) => w.id !== focusedWindow.id);
  const maxZIndex = BASE_Z_INDEX + otherWindows.length;

  return sortedWindows.map((w) => {
    if (w.id === focusedWindow.id) {
      return { ...w, zIndex: maxZIndex };
    }
    const index = otherWindows.findIndex((ow) => ow.id === w.id);
    return { ...w, zIndex: BASE_Z_INDEX + index };
  });
};

const calculateNewWindowPosition = (
  existingWindows: WindowData[]
): { x: number; y: number } => {
  if (existingWindows.length === 0) {
    return { x: 0, y: 0 };
  }

  const lastWindow = existingWindows.reduce((prev, current) =>
    current.zIndex > prev.zIndex ? current : prev
  );

  return {
    x: lastWindow.position.x + WINDOW_OFFSET,
    y: lastWindow.position.y + WINDOW_OFFSET,
  };
};

export const WindowProvider = ({ children }: WindowProviderProps) => {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const nextOrderRef = useRef(0);

  const openWindow = useCallback(
    (id: string, title: string, icon: string, content: ReactNode) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.id === id);
        if (existing) {
          return recalculateZIndexes(prev, id).map((w) =>
            w.id === id ? { ...w, isMinimized: false } : w
          );
        }

        const newPosition = calculateNewWindowPosition(prev);

        const newWindow: WindowData = {
          id,
          title,
          icon,
          content,
          position: newPosition,
          size: {
            width: DEFAULT_WINDOW_WIDTH,
            height: DEFAULT_WINDOW_HEIGHT,
          },
          zIndex: BASE_Z_INDEX,
          order: nextOrderRef.current++,
          isMinimized: false,
          isMaximized: false,
        };

        const updatedWindows = [...prev, newWindow];
        return recalculateZIndexes(updatedWindows, id);
      });
    },
    []
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const remaining = prev.filter((w) => w.id !== id);
      return recalculateZIndexes(remaining);
    });
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => recalculateZIndexes(prev, id));
  }, []);

  const updateWindowPosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, position } : w))
      );
    },
    []
  );

  const updateWindowSize = useCallback(
    (id: string, size: { width: number; height: number }) => {
      setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, size } : w)));
    },
    []
  );

  return (
    <WindowContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        focusWindow,
        updateWindowPosition,
        updateWindowSize,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
};
