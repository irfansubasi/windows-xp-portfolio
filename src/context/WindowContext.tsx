import { useState, useCallback, useRef, type ReactNode } from 'react';
import type { ToolbarItem, WindowData } from './windowTypes';
import { WindowContext } from './WindowContextBase';

interface WindowProviderProps {
  children: ReactNode;
}

const BASE_Z_INDEX = 1000;
const WINDOW_OFFSET = 30;
const DEFAULT_WINDOW_WIDTH = 700;
const DEFAULT_WINDOW_HEIGHT = 500;
const TASKBAR_HEIGHT = 30;

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
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const nextOrderRef = useRef(0);

  const openWindow = useCallback(
    (
      id: string,
      title: string,
      icon: string,
      content: ReactNode,
      customSize?: { width: number; height: number },
      toolbarItems?: ToolbarItem[],
      options?: {
        hideAddressBar?: boolean;
        hideToolbar?: boolean;
        hideMenubar?: boolean;
      }
    ) => {
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
          size: customSize || {
            width: DEFAULT_WINDOW_WIDTH,
            height: DEFAULT_WINDOW_HEIGHT,
          },
          zIndex: BASE_Z_INDEX,
          order: nextOrderRef.current++,
          isMinimized: false,
          isMaximized: false,
          toolbarItems,
          hideAddressBar: options?.hideAddressBar,
          hideToolbar: options?.hideToolbar,
          hideMenubar: options?.hideMenubar,
          previousPosition: undefined,
          previousSize: undefined,
        };

        const updatedWindows = [...prev, newWindow];
        setFocusedWindowId(id);
        return recalculateZIndexes(updatedWindows, id);
      });
    },
    []
  );

  const closeWindow = useCallback(
    (id: string) => {
      setWindows((prev) => {
        const remaining = prev.filter((w) => w.id !== id);
        if (focusedWindowId === id) {
          setFocusedWindowId(null);
        }
        return recalculateZIndexes(remaining);
      });
    },
    [focusedWindowId]
  );

  const focusWindow = useCallback((id: string | null) => {
    setFocusedWindowId(id);
    if (id !== null) {
      setWindows((prev) => recalculateZIndexes(prev, id));
    }
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

  const toggleMaximize = useCallback((id: string) => {
    setWindows((prev) => {
      const viewportWidth =
        typeof window !== 'undefined'
          ? window.innerWidth
          : DEFAULT_WINDOW_WIDTH;
      const viewportHeight =
        typeof window !== 'undefined'
          ? window.innerHeight
          : DEFAULT_WINDOW_HEIGHT + TASKBAR_HEIGHT;

      const updated = prev.map((w) => {
        if (w.id !== id) return w;

        if (!w.isMaximized) {
          return {
            ...w,
            isMaximized: true,
            previousPosition: w.position,
            previousSize: w.size,
            position: { x: 0, y: 0 },
            size: {
              width: viewportWidth,
              height: viewportHeight - TASKBAR_HEIGHT,
            },
          };
        }

        return {
          ...w,
          isMaximized: false,
          position: w.previousPosition ?? w.position,
          size: w.previousSize ?? w.size,
          previousPosition: undefined,
          previousSize: undefined,
        };
      });

      return recalculateZIndexes(updated, id);
    });
  }, []);

  const toggleMinimize = useCallback(
    (id: string) => {
      let nextFocusedId: string | null = focusedWindowId;
      let didUpdate = false;

      setWindows((prev) => {
        const updated = prev.map((w) => {
          if (w.id !== id) return w;

          didUpdate = true;
          const nextIsMinimized = !w.isMinimized;

          if (nextIsMinimized) {
            if (nextFocusedId === id) {
              nextFocusedId = null;
            }
          } else {
            nextFocusedId = id;
          }

          return { ...w, isMinimized: nextIsMinimized };
        });

        if (!didUpdate) {
          return prev;
        }

        return recalculateZIndexes(updated, nextFocusedId ?? undefined);
      });

      if (didUpdate) {
        setFocusedWindowId(nextFocusedId);
      }
    },
    [focusedWindowId]
  );

  return (
    <WindowContext.Provider
      value={{
        windows,
        focusedWindowId,
        openWindow,
        closeWindow,
        focusWindow,
        updateWindowPosition,
        updateWindowSize,
        toggleMaximize,
        toggleMinimize,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
};
