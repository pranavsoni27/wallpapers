import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ArrowDownTrayIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Wallpaper } from '@/types';
import { useFavorites } from '@/hooks';
import { useAuth } from '@/contexts/AuthProvider';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  onPreview: (wallpaper: Wallpaper) => void;
  onDownload: (wallpaper: Wallpaper) => void;
}

export const WallpaperCard: React.FC<WallpaperCardProps> = ({
  wallpaper,
  onPreview,
  onDownload,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    toggleFavorite(wallpaper.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-surface/50 backdrop-blur-xl border border-white/10">
        {/* Image */}
        <div className="aspect-video overflow-hidden">
          <img
            src={wallpaper.thumbnail}
            alt={wallpaper.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
            {wallpaper.title}
          </h3>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span>{wallpaper.resolution}</span>
            <span>•</span>
            <span>{wallpaper.category}</span>
            {/* <span>•</span> */}
            {/* <span>{wallpaper.downloadCount.toLocaleString()} downloads</span> */}
          </div>
        </div>

        {/* Hover Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 flex flex-col gap-2"
        >
          <button
            onClick={handleFavorite}
            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            aria-label="Toggle favorite"
          >
            {isFavorite(wallpaper.id) ? (
              <HeartSolidIcon className="w-5 h-5 text-accent" />
            ) : (
              <HeartIcon className="w-5 h-5 text-white" />
            )}
          </button>
          <button
            onClick={() => onPreview(wallpaper)}
            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            aria-label="Preview"
          >
            <ArrowsPointingOutIcon className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => onDownload(wallpaper)}
            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            aria-label="Download"
          >
            <ArrowDownTrayIcon className="w-5 h-5 text-white" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
