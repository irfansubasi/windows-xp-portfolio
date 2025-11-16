import type { ReactNode } from 'react';
import styles from './Window.module.css';
import { TitleBar } from '../TitleBar/TitleBar';
import { Menubar } from '../MenuBar/Menubar';
import { Toolbar } from '../Toolbar/Toolbar';
import { AddressBar } from '../AddressBar/AddressBar';

interface WindowProps {
  title: string;
  children: ReactNode;
  icon?: string;
}

export const Window = ({ title, children, icon }: WindowProps) => {
  const generatePath = (title: string) => {
    return `C:\\IrfanSubasi\\Desktop\\${title}`;
  };

  const path = generatePath(title);

  return (
    <div className={styles.window}>
      <TitleBar title={title} icon={icon} />
      <div className={styles.content}>
        <Menubar />
        <Toolbar />
        <AddressBar path={path} icon={icon} />
        {children}
      </div>
    </div>
  );
};
