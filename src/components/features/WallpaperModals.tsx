import React from 'react';
import { Wallpaper } from '@/types';
import { WallpaperFullscreenModal } from './WallpaperFullscreenModal';
import { DownloadResolutionModal } from './DownloadResolutionModal';

interface WallpaperModalsProps {
  fullscreenWallpaper: Wallpaper | null;
  downloadWallpaper: Wallpaper | null;
  onCloseFullscreen: () => void;
  onCloseDownload: () => void;
  onFullscreenDownload: () => void;
}

export const WallpaperModals: React.FC<WallpaperModalsProps> = ({
  fullscreenWallpaper,
  downloadWallpaper,
  onCloseFullscreen,
  onCloseDownload,
  onFullscreenDownload,
}) => (
  <>
    <WallpaperFullscreenModal
      wallpaper={fullscreenWallpaper}
      isOpen={!!fullscreenWallpaper}
      onClose={onCloseFullscreen}
      onDownload={onFullscreenDownload}
    />
    <DownloadResolutionModal
      wallpaper={downloadWallpaper}
      isOpen={!!downloadWallpaper}
      onClose={onCloseDownload}
    />
  </>
);
