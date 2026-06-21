import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { WallpaperCard } from './WallpaperCard';
import { Wallpaper, WALLPAPERS_PER_PAGE } from '@/types';
import { Pagination, Skeleton } from '@/components/ui';
import { containerVariants } from '@/utils/animations';

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  isLoading: boolean;
  onPreview: (wallpaper: Wallpaper) => void;
  onDownload: (wallpaper: Wallpaper) => void;
}

export const WallpaperGrid: React.FC<WallpaperGridProps> = ({
  wallpapers,
  isLoading,
  onPreview,
  onDownload,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(wallpapers.length / WALLPAPERS_PER_PAGE);
  const startIndex = (currentPage - 1) * WALLPAPERS_PER_PAGE;
  const paginatedWallpapers = wallpapers.slice(startIndex, startIndex + WALLPAPERS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [wallpapers]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="aspect-video rounded-2xl">
            <Skeleton className="w-full h-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!wallpapers || wallpapers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-white/60 text-lg">No wallpapers found</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {paginatedWallpapers.map((wallpaper) => (
          <WallpaperCard
            key={wallpaper.id}
            wallpaper={wallpaper}
            onPreview={onPreview}
            onDownload={onDownload}
          />
        ))}
      </motion.div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={wallpapers.length}
        itemsPerPage={WALLPAPERS_PER_PAGE}
      />
    </>
  );
};
