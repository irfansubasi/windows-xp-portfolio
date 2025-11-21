import type { ReactNode } from 'react';

export interface ToolbarItem {
  icon: string;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  isActive?: boolean;
}

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
  toolbarItems?: ToolbarItem[];
  hideAddressBar?: boolean;
  hideToolbar?: boolean;
  hideMenubar?: boolean;
  previousPosition?: { x: number; y: number };
  previousSize?: { width: number; height: number };
}

export interface WindowContextType {
  windows: WindowData[];
  focusedWindowId: string | null;
  openWindow: (
    id: string,
    title: string,
    icon: string,
    content: ReactNode,
    size?: { width: number; height: number },
    toolbarItems?: ToolbarItem[],
    options?: {
      hideAddressBar?: boolean;
      hideToolbar?: boolean;
      hideMenubar?: boolean;
    }
  ) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string | null) => void;
  updateWindowPosition: (
    id: string,
    position: { x: number; y: number }
  ) => void;
  updateWindowSize: (
    id: string,
    size: { width: number; height: number }
  ) => void;
  toggleMaximize: (id: string) => void;
  toggleMinimize: (id: string) => void;
}
