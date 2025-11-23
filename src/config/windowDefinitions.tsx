import type { ReactNode } from 'react';
import type { ToolbarItem } from '../context/windowTypes';
import { ResumeContent } from '../components/Windows/WindowContent/ResumeContent';
import { AboutMeContent } from '../components/Windows/WindowContent/AboutMeContent';
import { ContactContent } from '../components/Windows/WindowContent/ContactContent';
import { PaintContent } from '../components/Windows/WindowContent/PaintContent';
import { GamesFolderContent } from '../components/Windows/WindowContent/GamesFolderContent';

export interface WindowConfig {
  size?: { width: number; height: number };
  toolbarItems?: ToolbarItem[];
  hideAddressBar?: boolean;
  hideToolbar?: boolean;
  hideMenubar?: boolean;
}

export interface WindowDefinition {
  id: string;
  name: string;
  icon: string;
  windowContent: ReactNode | null;
  windowConfig?: WindowConfig;
}

const definitions: WindowDefinition[] = [
  {
    id: 'resume',
    name: 'Resume',
    icon: '/assets/PDF.ico',
    windowContent: <ResumeContent />,
    windowConfig: {
      size: { width: 700, height: 800 },
      toolbarItems: [
        { icon: '/assets/Search.png', label: 'Zoom' },
        { icon: '/assets/Save.png', label: 'Save' },
        { icon: '/assets/mail.png', label: 'Contact Me' },
      ],
    },
  },
  {
    id: 'aboutme',
    name: 'About Me',
    icon: '/assets/Information.png',
    windowContent: <AboutMeContent />,
    windowConfig: {
      hideAddressBar: true,
      size: { width: 700, height: 650 },
      toolbarItems: [
        { icon: '/assets/linkedin.png', label: 'LinkedIn' },
        { icon: '/assets/github.png', label: 'GitHub' },
        { icon: '/assets/PDF.ico', label: 'Resume' },
      ],
    },
  },
  {
    id: 'contact',
    name: 'Contact Me',
    icon: '/assets/mail.png',
    windowContent: <ContactContent />,
    windowConfig: {
      hideAddressBar: true,
      toolbarItems: [{ icon: '/assets/send.png', label: 'Send' }],
      size: { width: 500, height: 350 },
    },
  },
  {
    id: 'webamp',
    name: 'Winamp',
    icon: '/assets/winamp.png',
    windowContent: null,
    windowConfig: {
      size: { width: 275, height: 116 },
    },
  },
  {
    id: 'paint',
    name: 'Paint',
    icon: '/assets/Paint.png',
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
    icon: '/assets/folder.png',
    windowContent: <GamesFolderContent />,
    windowConfig: {
      size: { width: 600, height: 400 },
    },
  },
];

export const desktopIcons = definitions;

export const getWindowDefinition = (id: string) =>
  definitions.find((definition) => definition.id === id);
