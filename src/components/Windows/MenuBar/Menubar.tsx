import styles from './Menubar.module.css';

export const Menubar = () => {
  return (
    <div className={styles.menubar}>
      <div className={styles.menuItems}>
        <div className={styles.menuItem}>File</div>
        <div className={styles.menuItem}>View</div>
        <div className={styles.menuItem}>Favorites</div>
        <div className={styles.menuItem}>Tools</div>
        <div className={styles.menuItem}>Help</div>
      </div>
      <div className={styles.windowsLogo}>
        <div className={styles.windowsLogoImage}></div>
      </div>
    </div>
  );
};
