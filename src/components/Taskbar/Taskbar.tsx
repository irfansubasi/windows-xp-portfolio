import styles from './Taskbar.module.css';

export const Taskbar = () => {
  return (
    <div className={styles.taskbar}>
      <div id={styles.startButton}></div>
      <div className={styles.bar}></div>
      <div className={styles['system-tray']}>blablabla</div>
    </div>
  );
};
