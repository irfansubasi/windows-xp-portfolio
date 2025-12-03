import ClassiCubeGameContent from '../components/Windows/WindowContent/Games/ClassiCubeGameContent';
import DoomGameContent from '../components/Windows/WindowContent/Games/DoomGameContent';
import DxBallGameContent from '../components/Windows/WindowContent/Games/DxBallGameContent';
import MinesweeperGameContent from '../components/Windows/WindowContent/Games/MinesweeperGameContent';
import PinballGameContent from '../components/Windows/WindowContent/Games/PinballGameContent';
import QuakeGameContent from '../components/Windows/WindowContent/Games/QuakeGameContent';
import SpiderSolitaireGameContent from '../components/Windows/WindowContent/Games/SpiderSolitaireGameContent';
import type { WindowDefinition } from './windowDefinitions';

export const gameDefinitions: WindowDefinition[] = [
  {
    id: 'dxBall',
    name: 'DX Ball',
    icon: '/assets/games/DxBall/dxball.webp',
    windowContent: <DxBallGameContent />,
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
  {
    id: 'classiCube',
    name: 'ClassiCube',
    icon: '/assets/games/ClassiCube/classicube.png',
    windowContent: <ClassiCubeGameContent />,
    windowConfig: {
      size: { width: 800, height: 600 },
      hideAddressBar: true,
      hideToolbar: true,
      hideMenubar: true,
    },
  },
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    icon: '/assets/games/Minesweeper/Minesweeper.png',
    windowContent: <MinesweeperGameContent />,
    windowConfig: {
      size: { width: 800, height: 600 },
      hideAddressBar: true,
      hideToolbar: true,
      hideMenubar: true,
      disableResize: true,
    },
  },
  {
    id: 'spiderSolitaire',
    name: 'Spider Solitaire',
    icon: '/assets/games/Spider/spider.png',
    windowContent: <SpiderSolitaireGameContent />,
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
