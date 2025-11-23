import { useRef } from 'react';
import styles from './GamesFolderContent.module.css';
import { useSelection } from '../../../hooks/useSelection';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const {
    selectedIds,
    isSelecting,
    startPos,
    currentPos,
    handleMouseDown,
    handleItemClick,
    handleItemDoubleClick,
  } = useSelection({
    items: games,
    containerRef,
    itemRefs: gameRefs,
    onItemDoubleClick: (game) => {
      game.onClick();
    },
  });

  return (
    <div
      ref={containerRef}
      className={styles.content}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.gameList}>
        {games.map((game) => (
          <div
            key={game.id}
            ref={(el) => {
              gameRefs.current[game.id] = el;
            }}
            data-selectable-item
            className={styles.gameIcon}
            onClick={(e) => handleItemClick(e, game.id)}
            onDoubleClick={(e) => handleItemDoubleClick(e, game)}
          >
            <img
              src={game.icon}
              alt={game.name}
              className={styles.gameIconImage}
              draggable={false}
            />
            <span
              className={`${styles.gameIconName} ${
                selectedIds.includes(game.id) ? styles.selected : ''
              }`}
            >
              {game.name}
            </span>
          </div>
        ))}
      </div>

      {isSelecting && (
        <div
          className={styles['selection-box']}
          style={{
            left: Math.min(startPos.x, currentPos.x),
            top: Math.min(startPos.y, currentPos.y),
            width: Math.abs(currentPos.x - startPos.x),
            height: Math.abs(currentPos.y - startPos.y),
          }}
        ></div>
      )}
    </div>
  );
};
