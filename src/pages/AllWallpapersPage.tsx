import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WallpaperGrid, WallpaperModals, SearchModal, FilterSidebar, BackToTop } from '@/components/features';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';
import { useWallpapers, useWallpaperModals } from '@/hooks';
import { useAppStore } from '@/store';
import { wallpaperService } from '@/services';

export const AllWallpapersPage: React.FC = () => {
  const { setIsSearchOpen, filters } = useAppStore();
  const { data: allWallpapers, isLoading } = useWallpapers();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const wallpaperModals = useWallpaperModals();

  // Apply filters to wallpapers
  const filteredWallpapers = React.useMemo(() => {
    if (!allWallpapers) return [];
    
    // Apply filters from store
    if (Object.keys(filters).length === 0) {
      return allWallpapers;
    }
    
    return wallpaperService.filterWallpapers(allWallpapers, filters);
  }, [allWallpapers, filters]);

  return (
    <>
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.h1
            className="text-4xl font-bold text-white"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            All Wallpapers
          </motion.h1>
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2"
                size="sm"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                Search
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2"
              >
                <FunnelIcon className="w-5 h-5" />
                Filters
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Grid */}
        <WallpaperGrid
          wallpapers={filteredWallpapers}
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
