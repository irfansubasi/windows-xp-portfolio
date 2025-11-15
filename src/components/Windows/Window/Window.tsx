import type { ReactNode } from 'react';
import styles from './Window.module.css';
import { TitleBar } from '../TitleBar/TitleBar';
import { Menubar } from '../MenuBar/Menubar';
import { Toolbar } from '../Toolbar/Toolbar';

interface WindowProps {
  title: string;
  children: ReactNode;
  icon?: string;
}

export const Window = ({ title, children, icon }: WindowProps) => {
  return (
    <div className={styles.window}>
      <TitleBar title={title} icon={icon} />
      <div className={styles.content}>
        <Menubar />
        <Toolbar />
        {children}
      </div>
    </div>
  );
};
