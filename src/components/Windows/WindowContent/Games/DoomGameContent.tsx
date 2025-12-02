import { DosGameContent } from './DosGameContent';
import styles from './GameContent.module.css';
import { useEffect } from 'react';
import { useVolume } from '../../../../context/VolumeContext';

export default function DoomGameContent() {
  const { registerApp, unregisterApp } = useVolume();

  useEffect(() => {
    registerApp('doom', 1);
    return () => {
      unregisterApp('doom');
    };
  }, [registerApp, unregisterApp]);

  return (
    <div className={styles.gameContainer}>
      <DosGameContent gameUrl="/assets/games/Doom/doom.jsdos" appId="doom" />
    </div>
  );
}
