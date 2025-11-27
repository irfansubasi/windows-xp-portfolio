import React, { useRef } from 'react';
import styles from './Desktop.module.css';
import { useWindowContext } from '../../context/useWindowContext';
import { desktopIcons } from '../../config/windowDefinitions';
import { useSelection } from '../../hooks/useSelection';

export const Desktop = () => {
  const { openWindow, focusWindow } = useWindowContext();
  const desktopRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const {
    selectedIds,
    isSelecting,
    startPos,
    currentPos,
    handleMouseDown,
    handleItemClick,
    handleItemDoubleClick,
  } = useSelection({
    items: desktopIcons,
    containerRef: desktopRef,
    itemRefs: iconRefs,
    excludeSelector: '[data-window]',
    onItemDoubleClick: (icon) => {
      openWindow(
        icon.id,
        icon.name,
        icon.icon,
        icon.windowContent,
        icon.windowConfig?.size,
        icon.windowConfig?.toolbarItems,
        {
          hideAddressBar: icon.windowConfig?.hideAddressBar,
          hideToolbar: icon.windowConfig?.hideToolbar,
          hideMenubar: icon.windowConfig?.hideMenubar,
          disableResize: icon.windowConfig?.disableResize,
        }
      );
    },
  });

  const handleDesktopMouseDown = (e: React.MouseEvent) => {
    handleMouseDown(e);
    focusWindow(null);
  };

  return (
    <div className={styles.desktop}>
      <div
        ref={desktopRef}
        className={styles['without-taskbar']}
        onMouseDown={handleDesktopMouseDown}
      >
        <div className={styles['icons-container']}>
          {desktopIcons.map((icon) => (
            <div
              key={icon.id}
              ref={(el) => {
                iconRefs.current[icon.id] = el;
              }}
              data-selectable-item
              className={styles.icon}
              onClick={(e) => handleItemClick(e, icon.id)}
              onDoubleClick={(e) => handleItemDoubleClick(e, icon)}
            >
              <img
                src={icon.icon}
                alt={icon.name}
                className={styles['icon-image']}
                draggable={false}
              />
              <span
                className={`${styles['icon-name']} ${
                  selectedIds.includes(icon.id) ? styles.selected : ''
                }`}
              >
                {icon.name}
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
    </div>
  );
};
