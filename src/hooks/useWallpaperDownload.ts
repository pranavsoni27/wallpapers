import { useState, useCallback } from 'react';
import { Wallpaper } from '@/types';
import { imageResizer } from '@/utils';
import { wallpaperService } from '@/services';
import { useAuth } from '@/contexts/AuthProvider';
import { DEMO_DOWNLOAD_LIMIT } from '@/lib/supabase';

export function useWallpaperDownload(wallpaper: Wallpaper | null) {
  const {
    isAuthenticated,
    hasUnlimitedAccess,
    canDownload,
    remainingDownloads,
    recordDownload,
    openAuthModal,
  } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState('');

  const downloadAtResolution = useCallback(
    async (resolution: string) => {
      if (!wallpaper) return false;
      setDownloadError('');

      if (!isAuthenticated) {
        openAuthModal('login');
        return false;
      }

      if (!canDownload) {
        setDownloadError(
          `Demo limit reached. You can download up to ${DEMO_DOWNLOAD_LIMIT} wallpapers.`
        );
        return false;
      }

      setIsDownloading(true);
      setDownloadProgress(0);

      try {
        const dimensions = imageResizer.getResolutionDimensions(resolution);

        const progressInterval = setInterval(() => {
          setDownloadProgress((prev) => (prev >= 90 ? 90 : prev + 10));
        }, 200);

        const blob = await imageResizer.resizeImage(wallpaper.url, {
          width: dimensions.width,
          height: dimensions.height,
          format: 'jpg',
          quality: 0.92,
        });

        clearInterval(progressInterval);
        setDownloadProgress(100);

        await imageResizer.downloadImage(blob, `${wallpaper.title}-${resolution}.jpg`);
        await wallpaperService.trackDownload(wallpaper.id, resolution);

        if (!hasUnlimitedAccess) {
          const recorded = await recordDownload();
          if (!recorded) {
            setDownloadError('Download completed but usage could not be recorded.');
          }
        }

        return true;
      } catch (error) {
        console.error('Download failed:', error);
        setDownloadError('Download failed. Please try again.');
        return false;
      } finally {
        setIsDownloading(false);
        setDownloadProgress(0);
      }
    },
    [wallpaper, isAuthenticated, canDownload, hasUnlimitedAccess, openAuthModal, recordDownload]
  );

  const downloadMultiple = useCallback(
    async (resolutions: string[]) => {
      if (resolutions.length === 0) return;

      for (const resolution of resolutions) {
        const success = await downloadAtResolution(resolution);
        if (!success) break;
      }
    },
    [downloadAtResolution]
  );

  const resetError = useCallback(() => setDownloadError(''), []);

  return {
    isDownloading,
    downloadProgress,
    downloadError,
    downloadMultiple,
    resetError,
    isAuthenticated,
    hasUnlimitedAccess,
    canDownload,
    remainingDownloads,
  };
}
