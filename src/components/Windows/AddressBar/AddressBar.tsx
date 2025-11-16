import styles from './AddressBar.module.css';

interface AddressBarProps {
  path: string;
  icon?: string;
}
export const AddressBar = ({ path, icon }: AddressBarProps) => {
  return (
    <div className={styles.addressBar}>
      <span className={styles.addressBarText}>Address</span>
      <div className={styles.addressBarPath}>
        <img
          src={`${icon ? icon : '/assets/folder.png'}`}
          alt="folder"
          className={styles.icon}
        />
        <div className={styles.pathText}>{path}</div>
      </div>
      <div className={styles.goButton}></div>
    </div>
  );
};
