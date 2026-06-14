import React from 'react';
import { WallpaperGrid, WallpaperModals, SearchModal, BackToTop } from '@/components/features';
import { useWallpapers, useFavorites, useWallpaperModals } from '@/hooks';

export const FavoritesPage: React.FC = () => {
  const { data: allWallpapers, isLoading } = useWallpapers();
  const { favorites } = useFavorites();
  const wallpaperModals = useWallpaperModals();

  const favoriteWallpapers = allWallpapers?.filter((wallpaper) => favorites.includes(wallpaper.id)) || [];

  return (
    <>
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">My Favorites</h1>

        <WallpaperGrid
          wallpapers={favoriteWallpapers}
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
