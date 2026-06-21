import React, { useState } from 'react';
import { WallpaperGrid, WallpaperModals, SearchModal, FilterSidebar, BackToTop } from '@/components/features';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';
import { useRandomAllWallpapers, useWallpaperModals } from '@/hooks';
import { useAppStore } from '@/store';

export const AllWallpapersPage: React.FC = () => {
  const { setIsSearchOpen } = useAppStore();
  const { data: wallpapers, isLoading } = useRandomAllWallpapers();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const wallpaperModals = useWallpaperModals();

  return (
    <>
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold text-white">
            All Wallpapers
          </h1>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2"
              size="sm"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              Search
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2"
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
            </Button>
          </div>
        </div>

        {/* Grid */}
        <WallpaperGrid
          wallpapers={wallpapers || []}
          isLoading={isLoading}
          onPreview={wallpaperModals.handlePreview}
          onDownload={wallpaperModals.handleDownload}
        />
      </div>

      {/* Modals */}
      <WallpaperModals
        fullscreenWallpaper={wallpaperModals.fullscreenWallpaper}
        downloadWallpaper={wallpaperModals.downloadWallpaper}
        onCloseFullscreen={wallpaperModals.closeFullscreen}
        onCloseDownload={wallpaperModals.closeDownload}
        onFullscreenDownload={wallpaperModals.handleFullscreenDownload}
      />
      
      <SearchModal />
      
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <BackToTop />
    </>
  );
};
