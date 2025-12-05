import styles from './Toolbar.module.css';
import type { ToolbarItem } from '../../../context/windowTypes';

interface ToolbarProps {
  items?: ToolbarItem[];
}

export const Toolbar = ({ items }: ToolbarProps) => {
  if (items) {
    return (
      <div className={styles.toolbar}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`${styles.toolbarItem} ${
              item.isActive ? styles.active : ''
            }`}
            onClick={item.disabled ? undefined : item.onClick}
          >
            <img
              src={item.icon}
              alt={item.label || ''}
              className={`${styles.icon} ${
                item.disabled ? styles.disabled : ''
              }`}
            />
            {item.label && <div className={styles.label}>{item.label}</div>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarItem}>
        <img
          src="/assets/icons/Back.png"
          alt="back"
          className={`${styles.icon} ${styles.disabled}`}
        />
        <div className={styles.label}>Back</div>
      </div>
      <div className={styles.toolbarItem}>
        <img
          src="/assets/icons/Forward.png"
          alt="forward"
          className={`${styles.icon} ${styles.disabled}`}
        />
      </div>
      <div className={styles.toolbarItem}>
        <img
          src="/assets/icons/Up.png"
          alt="up"
          className={`${styles.icon} ${styles.disabled}`}
        />
      </div>
      <div className={styles.divider}>
        <div className={styles.dividerLine}></div>
      </div>
      <div className={styles.toolbarItem}>
        <img
          src="/assets/icons/Search.png"
          alt="search"
          className={`${styles.icon} ${styles.disabled}`}
        />
        <div className={styles.label}>Search</div>
      </div>
      <div className={styles.toolbarItem}>
        <img
          src="/assets/icons/folderview.png"
          alt="folder view"
          className={`${styles.icon} ${styles.disabled}`}
        />
        <div className={styles.label}>Folders</div>
      </div>
      <div className={styles.divider}>
        <div className={styles.dividerLine}></div>
      </div>
      <div className={styles.toolbarItem}>
        <img
          src="/assets/icons/classic.png"
          alt="classic view"
          className={`${styles.icon} ${styles.disabled}`}
        />
      </div>
    </div>
  );
};
