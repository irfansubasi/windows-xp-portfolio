import styles from './ResumeContent.module.css';

interface ResumeContentProps {
  isZoomed?: boolean;
  onZoomToggle?: () => void;
}

export const ResumeContent = ({
  isZoomed = false,
  onZoomToggle,
}: ResumeContentProps) => {
  return (
    <div className={styles.resumeContainer}>
      <div className={styles.imageWrapper}>
        <img
          src="/assets/cv.jpg"
          alt="Resume"
          className={`${styles.resumeImage} ${isZoomed ? styles.zoomed : ''}`}
          onClick={onZoomToggle}
        />
      </div>
    </div>
  );
};
