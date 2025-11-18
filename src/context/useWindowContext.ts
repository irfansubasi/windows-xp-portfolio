import { useContext } from 'react';
import { WindowContext } from './WindowContextBase';

export const useWindowContext = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowContext must be used within WindowProvider');
  }
  return context;
};

