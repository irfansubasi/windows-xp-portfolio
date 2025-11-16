import { useWindowContext } from '../../../context/WindowContext';
import { Window } from '../Window/Window';

export const WindowManager = () => {
  const { windows } = useWindowContext();

  return (
    <>
      {windows.map((window) => (
        <Window
          key={window.id}
          id={window.id}
          title={window.title}
          icon={window.icon}
          position={window.position}
          size={window.size}
          zIndex={window.zIndex}
        >
          {window.content}
        </Window>
      ))}
    </>
  );
};
