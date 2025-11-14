import styles from './Desktop.module.css';

interface DesktopIcon {
  id: string;
  name: string;
  icon: string;
}

const desktopIcons: DesktopIcon[] = [
  { id: 'resume', name: 'Resume', icon: '/assets/PDF.ico' },
];

export const Desktop = () => {
  return (
    <div className={styles.desktop}>
      <div className={styles['icons-container']}>
        {desktopIcons.map((icon) => (
          <div key={icon.id} className={styles.icon}>
            <img
              src={icon.icon}
              alt={icon.name}
              className={styles['icon-image']}
            />
            <span className={styles['icon-name']}>{icon.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
