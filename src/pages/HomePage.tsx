import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hero, WallpaperGrid, WallpaperModals, SearchModal, FilterSidebar, BackToTop } from '@/components/features';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';
import { useRandomHomeWallpapers, useWallpaperModals } from '@/hooks';
import { useAppStore } from '@/store';

export const HomePage: React.FC = () => {
  const { filters } = useAppStore();
  const { data: wallpapers, isLoading } = useRandomHomeWallpapers(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const wallpaperModals = useWallpaperModals();

  // Display random wallpapers that change daily
  const displayWallpapers = wallpapers || [];

  return (
    <>
      <Hero />

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {filters.category ? filters.category : 'Wallpapers'}
          </motion.h2>
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/all-wallpapers">
                <Button className="flex items-center gap-2">
                  All Wallpapers
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <WallpaperGrid
          wallpapers={displayWallpapers}
          isLoading={isLoading}
          onPreview={wallpaperModals.handlePreview}
          onDownload={wallpaperModals.handleDownload}
        />
      </div>

      <WallpaperModals
        fullscreenWallpaper={wallpaperModals.fullscreenWallpaper}
        downloadWallpaper={wallpaperModals.downloadWallpaper}
        onCloseFullscreen={wallpaperModals.closeFullscreen}
        onCloseDownload={wallpaperModals.closeDownload}
        onFullscreenDownload={wallpaperModals.handleFullscreenDownload}
      />

      <SearchModal />
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
      <BackToTop />
    </>
  );
};
