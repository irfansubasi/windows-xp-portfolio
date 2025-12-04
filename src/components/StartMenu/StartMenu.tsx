import styles from './StartMenu.module.css';

export default function StartMenu() {
  return (
    <div className={styles.startMenu}>
      <div className={styles.topBar}></div>
      <div className={styles.orangeLine}></div>
      <div className={styles.content}>
        <div className={styles.leftPanel}></div>
        <div className={styles.rightPanel}></div>
      </div>
      <div className={styles.bottomBar}></div>
    </div>
  );
}
