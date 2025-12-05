import { useMemo, useRef } from 'react';
import { useSelection } from '../../../hooks/useSelection';
import {
  getWindowDefinition,
  getFolderItems,
  type FolderItem,
} from '../../../config/windowDefinitions';
import { useWindowContext } from '../../../context/useWindowContext';
import styles from './GenericFolderContent.module.css';

interface GenericFolderContentProps {
  folderId: string;
}

export const GenericFolderContent = ({
  folderId,
}: GenericFolderContentProps) => {
  const { openWindow } = useWindowContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const items: FolderItem[] = useMemo(
    () => getFolderItems(folderId),
    [folderId]
  );

  const {
    selectedIds,
    isSelecting,
    startPos,
    currentPos,
    handleMouseDown,
    handleItemClick,
    handleItemDoubleClick,
  } = useSelection({
    items: items,
    containerRef,
    itemRefs,
    onItemDoubleClick: (item: FolderItem) => {
      const itemDefinition = getWindowDefinition(item.id);
      if (!itemDefinition) return;

      openWindow(
        itemDefinition.id,
        itemDefinition.name,
        itemDefinition.icon,
        itemDefinition.windowContent,
        itemDefinition.windowConfig?.size,
        itemDefinition.windowConfig?.toolbarItems,
        {
          hideAddressBar: itemDefinition.windowConfig?.hideAddressBar,
          hideToolbar: itemDefinition.windowConfig?.hideToolbar,
          hideMenubar: itemDefinition.windowConfig?.hideMenubar,
          disableResize: itemDefinition.windowConfig?.disableResize,
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
      <div className={styles.itemList}>
        {items.map((item) => (
          <div
            key={item.id}
            ref={(el) => {
              itemRefs.current[item.id] = el;
            }}
            data-selectable-item
            className={styles.itemIcon}
            onClick={(e) => handleItemClick(e, item.id)}
            onDoubleClick={(e) => handleItemDoubleClick(e, item)}
          >
            <img
              src={item.icon}
              alt={item.name}
              className={styles.itemIconImage}
              draggable={false}
            />
            <span
              className={`${styles.itemIconName} ${
                selectedIds.includes(item.id) ? styles.selected : ''
              }`}
            >
              {item.name}
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
