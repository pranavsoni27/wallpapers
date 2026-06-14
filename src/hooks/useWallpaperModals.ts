import { useState, useCallback } from 'react';
import { Wallpaper } from '@/types';
import { useAuth } from '@/contexts/AuthProvider';

export function useWallpaperModals() {
  const [fullscreenWallpaper, setFullscreenWallpaper] = useState<Wallpaper | null>(null);
  const [downloadWallpaper, setDownloadWallpaper] = useState<Wallpaper | null>(null);
  const { isAuthenticated, openAuthModal } = useAuth();

  const handlePreview = useCallback((wallpaper: Wallpaper) => {
    setFullscreenWallpaper(wallpaper);
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenWallpaper(null);
  }, []);

  const closeDownload = useCallback(() => {
    setDownloadWallpaper(null);
  }, []);

  const openDownloadPicker = useCallback(
    (wallpaper: Wallpaper) => {
      if (!isAuthenticated) {
        openAuthModal('login');
        return;
      }
      setDownloadWallpaper(wallpaper);
    },
    [isAuthenticated, openAuthModal]
  );

  const handleDownload = useCallback(
    (wallpaper: Wallpaper) => {
      openDownloadPicker(wallpaper);
    },
    [openDownloadPicker]
  );

  const handleFullscreenDownload = useCallback(() => {
    if (fullscreenWallpaper) {
      openDownloadPicker(fullscreenWallpaper);
    }
  }, [fullscreenWallpaper, openDownloadPicker]);

  return {
    fullscreenWallpaper,
    downloadWallpaper,
    handlePreview,
    handleDownload,
    closeFullscreen,
    closeDownload,
    handleFullscreenDownload,
  };
};
