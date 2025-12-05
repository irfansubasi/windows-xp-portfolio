import type { ReactNode } from 'react';
import type { ToolbarItem } from '../context/windowTypes';
import { ResumeContent } from '../components/Windows/WindowContent/ResumeContent';
import { AboutMeContent } from '../components/Windows/WindowContent/AboutMeContent';
import { ContactContent } from '../components/Windows/WindowContent/ContactContent';
import { PaintContent } from '../components/Windows/WindowContent/PaintContent';
import { GamesFolderContent } from '../components/Windows/WindowContent/GamesFolderContent';
import { gameDefinitions } from './gameDefinitions';
import { MyDocumentsFolderContent } from '../components/Windows/WindowContent/MyDocumentsFolderContent';

export interface WindowConfig {
  size?: { width: number; height: number };
  toolbarItems?: ToolbarItem[];
  hideAddressBar?: boolean;
  hideToolbar?: boolean;
  hideMenubar?: boolean;
  disableResize?: boolean;
}

export interface WindowDefinition {
  id: string;
  name: string;
  icon: string;
  windowContent: ReactNode | null;
  windowConfig?: WindowConfig;
  folderItems?: string[];
}

export interface FolderItem {
  id: string;
  name: string;
  icon: string;
}

const definitions: WindowDefinition[] = [
  {
    id: 'resume',
    name: 'Resume',
    icon: '/assets/icons/PDF.ico',
    windowContent: <ResumeContent />,
    windowConfig: {
      size: { width: 700, height: 800 },
      toolbarItems: [
        { icon: '/assets/icons/Search.png', label: 'Zoom' },
        { icon: '/assets/icons/Save.png', label: 'Save' },
        { icon: '/assets/icons/mail.png', label: 'Contact Me' },
      ],
    },
  },
  {
    id: 'aboutme',
    name: 'About Me',
    icon: '/assets/icons/Information.png',
    windowContent: <AboutMeContent />,
    windowConfig: {
      hideAddressBar: true,
      size: { width: 700, height: 650 },
      toolbarItems: [
        { icon: '/assets/icons/linkedin.png', label: 'LinkedIn' },
        { icon: '/assets/icons/github.png', label: 'GitHub' },
        { icon: '/assets/icons/PDF.ico', label: 'Resume' },
      ],
    },
  },
  {
    id: 'contact',
    name: 'Contact Me',
    icon: '/assets/icons/mail.png',
    windowContent: <ContactContent />,
    windowConfig: {
      hideAddressBar: true,
      toolbarItems: [{ icon: '/assets/icons/send.png', label: 'Send' }],
      size: { width: 500, height: 350 },
    },
  },
  {
    id: 'webamp',
    name: 'Winamp',
    icon: '/assets/icons/winamp.png',
    windowContent: null,
    windowConfig: {
      size: { width: 275, height: 116 },
    },
  },
  {
    id: 'paint',
    name: 'Paint',
    icon: '/assets/icons/Paint.png',
    windowContent: <PaintContent />,
    windowConfig: {
      size: { width: 800, height: 600 },
      hideAddressBar: true,
      hideToolbar: true,
      hideMenubar: true,
    },
  },
  {
    id: 'gamesFolder',
    name: 'Games',
    icon: '/assets/icons/folder.png',
    windowContent: <GamesFolderContent />,
    windowConfig: {
      size: { width: 600, height: 400 },
    },
  },
  {
    id: 'myDocumentsFolder',
    name: 'My Documents',
    icon: '/assets/icons/MyDocuments.png',
    windowContent: <MyDocumentsFolderContent />,
    folderItems: ['resume'],
    windowConfig: {
      size: { width: 600, height: 400 },
    },
  },
];

const allDefinitions = [...definitions, ...gameDefinitions];

export const desktopIcons = definitions.filter(
  (icon) => icon.id !== 'myDocumentsFolder'
);

export const leftPanelItems = desktopIcons.filter(
  (icon) => icon.id !== 'myDocumentsFolder' && icon.id !== 'gamesFolder'
);

export const rightPanelItems = allDefinitions.filter(
  (icon) => icon.id === 'myDocumentsFolder'
);

export const getWindowDefinition = (id: string) =>
  allDefinitions.find((definition) => definition.id === id);

export const getFolderItems = (folderId: string): FolderItem[] => {
  const folder = allDefinitions.find((d) => d.id === folderId);
  if (!folder?.folderItems) return [];

  return folder.folderItems
    .map((id) => {
      const def = getWindowDefinition(id);
      if (!def) return null;
      return { id: def.id, name: def.name, icon: def.icon };
    })
    .filter((item): item is FolderItem => item !== null);
};
