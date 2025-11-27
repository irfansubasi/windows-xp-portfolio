import { useMemo, useRef } from 'react';
import styles from './GamesFolderContent.module.css';
import { useSelection } from '../../../hooks/useSelection';
import { getWindowDefinition } from '../../../config/windowDefinitions';
import { useWindowContext } from '../../../context/useWindowContext';
import { getGameList, type GameInfo } from '../../../config/gameDefinitions';

export const GamesFolderContent = () => {
  const { openWindow } = useWindowContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const games: GameInfo[] = useMemo(() => getGameList(), []);

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
      const gameDefinition = getWindowDefinition(game.id);
      if (!gameDefinition) return;

      openWindow(
        gameDefinition.id,
        gameDefinition.name,
        gameDefinition.icon,
        gameDefinition.windowContent,
        gameDefinition.windowConfig?.size,
        gameDefinition.windowConfig?.toolbarItems,
        {
          hideAddressBar: gameDefinition.windowConfig?.hideAddressBar,
          hideToolbar: gameDefinition.windowConfig?.hideToolbar,
          hideMenubar: gameDefinition.windowConfig?.hideMenubar,
          disableResize: gameDefinition.windowConfig?.disableResize,
        }
      );
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
