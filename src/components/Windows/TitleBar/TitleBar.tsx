import styles from './TitleBar.module.css';

interface TitleBarProps {
  title: string;
  icon?: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export const TitleBar = ({
  title,
  icon,
  onMinimize,
  onMaximize,
  onClose,
}: TitleBarProps) => {
  return (
    <div className={styles.titleBar}>
      {icon && <img src={icon} alt="" className={styles.titleIcon} />}
      <span className={styles.titleText}>{title}</span>
      <div className={styles.titleControls}>
        <button className={styles.controlButton} onClick={onMinimize}>
          <img src="/assets/Minimize.png" alt="minimize" />
        </button>
        <button className={styles.controlButton} onClick={onMaximize}>
          <img src="/assets/Maximize.png" alt="maximize" />
        </button>
        <button className={styles.controlButton} onClick={onClose}>
          <img src="/assets/Exit.png" alt="close" />
        </button>
      </div>
    </div>
  );
};
