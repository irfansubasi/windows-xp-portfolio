import { createContext } from 'react';
import type { WindowContextType } from './windowTypes';

export const WindowContext = createContext<WindowContextType | undefined>(
  undefined
);

