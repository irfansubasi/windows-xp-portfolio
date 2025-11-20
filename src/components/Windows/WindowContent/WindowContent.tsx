import { cloneElement, isValidElement, Children, type ReactNode } from 'react';
import styles from './WindowContent.module.css';

interface WindowContentProps {
  children?: ReactNode;
  isZoomed?: boolean;
  onZoomToggle?: () => void;
  onContactSend?: (payload: {
    subject: string;
    body: string;
  }) => void;
}

export const WindowContent = ({
  children,
  isZoomed,
  onZoomToggle,
  onContactSend,
}: WindowContentProps) => {
  const clonedChildren = Children.map(children, (child) => {
    if (
      isValidElement(child) &&
      child.type &&
      typeof child.type === 'function'
    ) {
      const componentName =
        (child.type as { displayName?: string; name?: string }).displayName ||
        (child.type as { name?: string }).name;
      if (componentName === 'ResumeContent') {
        return cloneElement(child, {
          isZoomed,
          onZoomToggle,
        } as { isZoomed?: boolean; onZoomToggle?: () => void });
      }
      if (componentName === 'ContactContent') {
        return cloneElement(child, {
          onSend: onContactSend,
        } as {
          onSend?: (payload: {
            subject: string;
            body: string;
          }) => void;
        });
      }
    }
    return child;
  });

  return <div className={styles.windowContent}>{clonedChildren}</div>;
};
