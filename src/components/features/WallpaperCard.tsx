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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05, y: -8 }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-surface/50 backdrop-blur-xl border border-white/10"
        whileHover={{ boxShadow: '0 25px 50px rgba(218, 175, 71, 0.15)' }}
      >
        {/* Image */}
        <div className="aspect-video overflow-hidden">
          <motion.img
            src={wallpaper.thumbnail}
            alt={wallpaper.title}
            loading="lazy"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.5 }}
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
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
            {wallpaper.title}
          </h3>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span>{wallpaper.resolution}</span>
            <span>•</span>
            <span>{wallpaper.category}</span>
          </div>
        </motion.div>

        {/* Hover Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 flex flex-col gap-2"
        >
          <motion.button
            onClick={handleFavorite}
            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            aria-label="Toggle favorite"
            whileHover={{ scale: 1.15, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            {isFavorite(wallpaper.id) ? (
              <motion.div animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1.2, 1] }} transition={{ duration: 0.6 }}>
                <HeartSolidIcon className="w-5 h-5 text-accent" />
              </motion.div>
            ) : (
              <HeartIcon className="w-5 h-5 text-white" />
            )}
          </motion.button>
          <motion.button
            onClick={() => onPreview(wallpaper)}
            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            aria-label="Preview"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowsPointingOutIcon className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            onClick={() => onDownload(wallpaper)}
            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            aria-label="Download"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowDownTrayIcon className="w-5 h-5 text-white" />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
