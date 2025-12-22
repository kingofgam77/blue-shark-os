export enum AppID {
  SHARK_BRAIN = 'SHARK_BRAIN',
  DEEP_NOTES = 'DEEP_NOTES',
  OCEAN_GALLERY = 'OCEAN_GALLERY',
  SYSTEM_STATUS = 'SYSTEM_STATUS',
  SETTINGS = 'SETTINGS',
  PLAY_STORE = 'PLAY_STORE',
  PLANTS_VS_ZOMBIES = 'PLANTS_VS_ZOMBIES',
  VIDEO_PLAYER = 'VIDEO_PLAYER',
  SHARK_SHARE = 'SHARK_SHARE',
  MUSIC_PLAYER = 'MUSIC_PLAYER'
}

export interface AppConfig {
  id: AppID;
  title: string;
  icon: string; // Lucide icon name
  defaultWidth: number;
  defaultHeight: number;
}

export interface WindowState {
  id: string; // Unique instance ID
  appId: AppID;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
}

export interface Position {
  x: number;
  y: number;
}