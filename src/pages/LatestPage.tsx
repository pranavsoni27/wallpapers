import React from 'react';
import { WallpaperGrid, WallpaperModals, SearchModal, BackToTop } from '@/components/features';
import { useNewestWallpapers, useWallpaperModals } from '@/hooks';

export const LatestPage: React.FC = () => {
  const { data: wallpapers, isLoading } = useNewestWallpapers();
  const wallpaperModals = useWallpaperModals();

  return (
    <>
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Latest Wallpapers</h1>

        <WallpaperGrid
          wallpapers={wallpapers || []}
          isLoading={isLoading}
          onPreview={wallpaperModals.handlePreview}
          onDownload={wallpaperModals.handleDownload}
        />

        <WallpaperModals
          fullscreenWallpaper={wallpaperModals.fullscreenWallpaper}
          downloadWallpaper={wallpaperModals.downloadWallpaper}
          onCloseFullscreen={wallpaperModals.closeFullscreen}
          onCloseDownload={wallpaperModals.closeDownload}
          onFullscreenDownload={wallpaperModals.handleFullscreenDownload}
        />

        <BackToTop />
      </div>

      <SearchModal />
    </>
  );
};
