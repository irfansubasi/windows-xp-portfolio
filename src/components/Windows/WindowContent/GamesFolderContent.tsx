import styles from './GamesFolderContent.module.css';

interface Game {
  id: string;
  name: string;
  icon: string;
  onClick: () => void;
}

const games: Game[] = [
  {
    id: 'dxBall',
    name: 'DX Ball',
    icon: '/assets/dxball.webp',
    onClick: () => {},
  },
  {
    id: 'quake',
    name: 'Quake III',
    icon: '/assets/quake.png',
    onClick: () => {},
  },
  {
    id: 'pinball',
    name: 'Pinball',
    icon: '/assets/pinball.webp',
    onClick: () => {},
  },
  {
    id: 'doom',
    name: 'Doom',
    icon: '/assets/doom.ico',
    onClick: () => {},
  },
];

export const GamesFolderContent = () => {
  return (
    <div className={styles.content}>
      <div className={styles.gameList}>
        {games.map((game) => (
          <div className={styles.gameIcon} key={game.id}>
            <img
              src={game.icon}
              alt={game.name}
              className={styles.gameIconImage}
            />
            <span className={styles.gameIconName}>{game.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
