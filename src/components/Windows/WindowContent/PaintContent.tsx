import styles from './PaintContent.module.css';

export const PaintContent = () => {
  return (
    <div className={styles.paintContainer}>
      <iframe
        src="https://jspaint.app"
        width="100%"
        height="100%"
        title="Paint"
      />
    </div>
  );
};
