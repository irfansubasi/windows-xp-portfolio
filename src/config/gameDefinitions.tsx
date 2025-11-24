import DoomGameContent from '../components/Windows/WindowContent/Games/DoomGameContent';
import PinballGameContent from '../components/Windows/WindowContent/Games/PinballGameContent';
import QuakeGameContent from '../components/Windows/WindowContent/Games/QuakeGameContent';
import type { WindowDefinition } from './windowDefinitions';

export const gameDefinitions: WindowDefinition[] = [
  {
    id: 'dxBall',
    name: 'DX Ball',
    icon: '/assets/games/DxBall/dxball.webp',
    windowContent: null,
    windowConfig: {
      size: { width: 800, height: 600 },
      hideAddressBar: true,
      hideToolbar: true,
      hideMenubar: true,
    },
  },
  {
    id: 'doom',
    name: 'Doom',
    icon: '/assets/games/Doom/doom.ico',
    windowContent: <DoomGameContent />,
    windowConfig: {
      size: { width: 800, height: 600 },
      hideAddressBar: true,
      hideToolbar: true,
      hideMenubar: true,
    },
  },
  {
    id: 'quake',
    name: 'Quake',
    icon: '/assets/games/Quake/quake.png',
    windowContent: <QuakeGameContent />,
    windowConfig: {
      size: { width: 800, height: 600 },
      hideAddressBar: true,
      hideToolbar: true,
      hideMenubar: true,
    },
  },
  {
    id: 'pinball',
    name: 'Pinball',
    icon: '/assets/games/Pinball/pinball.webp',
    windowContent: <PinballGameContent />,
    windowConfig: {
      size: { width: 800, height: 600 },
      hideAddressBar: true,
      hideToolbar: true,
      hideMenubar: true,
    },
  },
];

export interface GameInfo {
  id: string;
  name: string;
  icon: string;
}

export const getGameList = (): GameInfo[] => {
  return gameDefinitions.map((game) => ({
    id: game.id,
    name: game.name,
    icon: game.icon,
  }));
};
