import { useState } from 'react';
import styles from './ResumeContent.module.css';

export const ResumeContent = () => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className={styles.resumeContainer}>
      <div className={styles.imageWrapper}>
        <img
          src="/assets/cv.jpg"
          alt="Resume"
          className={`${styles.resumeImage} ${isZoomed ? styles.zoomed : ''}`}
          onClick={handleZoomToggle}
        />
      </div>
    </div>
  );
};
