import { DosGameContent } from './DosGameContent';
import styles from './GameContent.module.css';

export default function DoomGameContent() {
  return (
    <div className={styles.gameContainer}>
      <DosGameContent gameUrl="/assets/games/Doom/doom.jsdos" />
    </div>
  );
}
