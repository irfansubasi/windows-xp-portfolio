import styles from './Toolbar.module.css';

export const Toolbar = () => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarItem}>
        <img src="/assets/Back.png" alt="back" className={styles.icon} />
        <div className={styles.label}>Back</div>
      </div>
      <div className={styles.toolbarItem}>
        <img src="/assets/Forward.png" alt="forward" className={styles.icon} />
      </div>
      <div className={styles.toolbarItem}>
        <img src="/assets/Up.png" alt="up" className={styles.icon} />
      </div>
      <div className={styles.divider}>
        <div className={styles.dividerLine}></div>
      </div>
      <div className={styles.toolbarItem}>
        <img src="/assets/Search.png" alt="search" className={styles.icon} />
        <div className={styles.label}>Search</div>
      </div>
      <div className={styles.toolbarItem}>
        <img
          src="/assets/folderview.png"
          alt="folder view"
          className={styles.icon}
        />
        <div className={styles.label}>Folders</div>
      </div>
      <div className={styles.divider}>
        <div className={styles.dividerLine}></div>
      </div>
      <div className={styles.toolbarItem}>
        <img
          src="/assets/classic.png"
          alt="classic view"
          className={styles.icon}
        />
      </div>
    </div>
  );
};
