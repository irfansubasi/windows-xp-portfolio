import type { ReactNode } from 'react';
import styles from './WindowContent.module.css';

interface WindowContentProps {
  children?: ReactNode;
}

export const WindowContent = ({ children }: WindowContentProps) => {
  return <div className={styles.windowContent}>{children}</div>;
};
