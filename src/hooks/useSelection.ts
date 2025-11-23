import { useState, useEffect, type RefObject } from 'react';

interface SelectableItem {
  id: string;
}

interface UseSelectionOptions<T extends SelectableItem> {
  items: T[];
  containerRef:
    | RefObject<HTMLElement | null>
    | RefObject<HTMLDivElement | null>;
  itemRefs: RefObject<Record<string, HTMLElement | null>>;
  onItemClick?: (item: T) => void;
  onItemDoubleClick?: (item: T) => void;
  excludeSelector?: string;
}

interface UseSelectionReturn<T extends SelectableItem> {
  selectedIds: string[];
  isSelecting: boolean;
  startPos: { x: number; y: number };
  currentPos: { x: number; y: number };
  handleMouseDown: (e: React.MouseEvent) => void;
  handleItemClick: (e: React.MouseEvent, itemId: string) => void;
  handleItemDoubleClick: (e: React.MouseEvent, item: T) => void;
}

export function useSelection<T extends SelectableItem>(
  options: UseSelectionOptions<T>
): UseSelectionReturn<T> {
  const {
    items,
    containerRef,
    itemRefs,
    onItemClick,
    onItemDoubleClick,
    excludeSelector,
  } = options;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isSelecting || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      const clampedX = Math.max(0, Math.min(relativeX, rect.width));
      const clampedY = Math.max(0, Math.min(relativeY, rect.height));

      setCurrentPos({ x: clampedX, y: clampedY });

      const selection = {
        left: Math.min(startPos.x, clampedX),
        top: Math.min(startPos.y, clampedY),
        right: Math.max(startPos.x, clampedX),
        bottom: Math.max(startPos.y, clampedY),
      };

      const nextSelected: string[] = [];

      items.forEach((item) => {
        const el = itemRefs.current[item.id];
        if (!el) return;

        const itemRect = el.getBoundingClientRect();

        const box = {
          left: itemRect.left - rect.left,
          top: itemRect.top - rect.top,
          right: itemRect.right - rect.left,
          bottom: itemRect.bottom - rect.top,
        };

        const intersects = !(
          selection.right < box.left ||
          selection.left > box.right ||
          selection.bottom < box.top ||
          selection.top > box.bottom
        );

        if (intersects) nextSelected.push(item.id);
      });

      setSelectedIds(nextSelected);
    };

    const handleUp = () => setIsSelecting(false);

    if (isSelecting) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [isSelecting, startPos, items, containerRef, itemRefs]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!containerRef.current || !rect) return;

    const isItem = (e.target as HTMLElement).closest('[data-selectable-item]');
    const isExcluded = excludeSelector
      ? (e.target as HTMLElement).closest(excludeSelector)
      : false;

    if (!isItem && !isExcluded) {
      setSelectedIds([]);
      setIsSelecting(true);

      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      const clampedStartX = Math.max(0, Math.min(relativeX, rect.width));
      const clampedStartY = Math.max(0, Math.min(relativeY, rect.height));

      setStartPos({ x: clampedStartX, y: clampedStartY });
      setCurrentPos({ x: clampedStartX, y: clampedStartY });
    }
  };

  const handleItemClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    setSelectedIds([itemId]);
    const item = items.find((i) => i.id === itemId);
    if (item && onItemClick) {
      onItemClick(item);
    }
  };

  const handleItemDoubleClick = (e: React.MouseEvent, item: T) => {
    e.stopPropagation();
    if (onItemDoubleClick) {
      onItemDoubleClick(item);
    }
  };

  return {
    selectedIds,
    isSelecting,
    startPos,
    currentPos,
    handleMouseDown,
    handleItemClick,
    handleItemDoubleClick,
  };
}
