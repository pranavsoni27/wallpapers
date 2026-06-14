import React, { useState } from 'react';
import { ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/outline';
import { Modal, Button } from '@/components/ui';
import { Wallpaper, DOWNLOAD_RESOLUTIONS } from '@/types';
import { imageResizer } from '@/utils';
import { wallpaperService } from '@/services';
import { useFavorites } from '@/hooks';
import { useAuth } from '@/contexts/AuthProvider';
import { DEMO_DOWNLOAD_LIMIT } from '@/lib/supabase';
import { cn } from '@/utils';

interface WallpaperDetailsModalProps {
  wallpaper: Wallpaper | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WallpaperDetailsModal: React.FC<WallpaperDetailsModalProps> = ({
  wallpaper,
  isOpen,
  onClose,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const {
    isAuthenticated,
    hasUnlimitedAccess,
    remainingDownloads,
    canDownload,
    openAuthModal,
    recordDownload,
  } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState('');

  if (!wallpaper) return null;

  const recommendedResolution = imageResizer.getRecommendedResolution();
  const recommendedDimensions = imageResizer.getResolutionDimensions(recommendedResolution);

  const handleDownload = async (resolution: string) => {
    setDownloadError('');

    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (!canDownload) {
      setDownloadError(
        `Demo limit reached. You can download up to ${DEMO_DOWNLOAD_LIMIT} wallpapers. Upgrade or contact admin for free access.`
      );
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const dimensions = imageResizer.getResolutionDimensions(resolution);

      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
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

      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 500);
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadError('Download failed. Please try again.');
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: wallpaper.title,
          text: `Check out this amazing wallpaper: ${wallpaper.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 overflow-hidden max-w-[1200px]">
      <div className="flex flex-col">
        <div className="relative w-full aspect-video bg-black">
          <img
            src={wallpaper.url}
            alt={wallpaper.title}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="p-6 md:p-8 flex flex-col">
          <h2 className="text-3xl font-bold text-white mb-2">{wallpaper.title}</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
              {wallpaper.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm">
              {wallpaper.resolution}
            </span>
          </div>

          <div className="flex items-center gap-4 text-white/60 text-sm mb-6">
            <span>{wallpaper.downloadCount.toLocaleString()} downloads</span>
            <span>•</span>
            <span>{new Date(wallpaper.uploadDate).toLocaleDateString()}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {wallpaper.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mb-6 p-4 rounded-xl bg-gradient-primary/20 border border-primary/30">
            <p className="text-white/80 text-sm mb-2">Recommended for your screen:</p>
            <p className="text-white font-semibold text-lg">
              {recommendedResolution} ({recommendedDimensions.width}x{recommendedDimensions.height})
            </p>
          </div>

          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            {!isAuthenticated ? (
              <p className="text-white/80 text-sm">
                Login or sign up to download wallpapers. Demo users get {DEMO_DOWNLOAD_LIMIT} free downloads.
              </p>
            ) : hasUnlimitedAccess ? (
              <p className="text-green-300 text-sm">You have unlimited download access.</p>
            ) : (
              <p className="text-white/80 text-sm">
                Demo access: {remainingDownloads} of {DEMO_DOWNLOAD_LIMIT} free downloads remaining.
              </p>
            )}
          </div>

          {downloadError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {downloadError}
            </div>
          )}

          <div className="space-y-3 mb-6">
            <Button
              onClick={() => handleDownload(recommendedResolution)}
              disabled={isDownloading}
              className="w-full"
              size="lg"
            >
              {isDownloading ? (
                <span className="flex items-center gap-2">
                  Downloading... {downloadProgress}%
                </span>
              ) : !isAuthenticated ? (
                <span className="flex items-center gap-2">
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  Login to Download
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  Download Recommended
                </span>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              {DOWNLOAD_RESOLUTIONS.map((res) => (
                <Button
                  key={res.label}
                  variant="outline"
                  onClick={() => handleDownload(res.label)}
                  disabled={isDownloading}
                  size="sm"
                >
                  {res.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-auto">
            <Button
              variant="ghost"
              onClick={() => toggleFavorite(wallpaper.id)}
              className={cn(
                'flex-1',
                isFavorite(wallpaper.id) && 'text-accent'
              )}
            >
              {isFavorite(wallpaper.id) ? '♥ Favorited' : '♡ Add to Favorites'}
            </Button>
            <Button
              variant="ghost"
              onClick={handleShare}
              className="flex-1"
            >
              <ShareIcon className="w-5 h-5 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
