import styles from './PaintContent.module.css';

export const PaintContent = () => {
  return (
    <div className={styles.paintContainer}>
      <iframe
        src="/assets/paintjs/index.html"
        width="100%"
        height="100%"
        title="Paint"
      />
    </div>
  );
};
