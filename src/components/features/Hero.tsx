import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useFeaturedWallpapers } from '@/hooks';
import { useAppStore } from '@/store';
import { cn } from '@/utils';

export const Hero: React.FC = () => {
  const { data: featuredWallpapers, isLoading } = useFeaturedWallpapers();
  const { setIsSearchOpen, setSearchQuery } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (!featuredWallpapers || featuredWallpapers.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredWallpapers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredWallpapers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setIsSearchOpen(false);
  };

  if (isLoading) {
    return (
      <div className="relative w-full -mt-16 bg-black">
        <div className="w-full aspect-[16/9] min-h-[360px] max-h-[85vh] animate-pulse bg-surface" />
      </div>
    );
  }

  const currentWallpaper = featuredWallpapers?.[currentIndex];

  return (
    <section className="relative w-full -mt-16 bg-black overflow-hidden">
      {/* Image area — edge-to-edge full width */}
      <div className="relative w-full aspect-[16/9] min-h-[360px] max-h-[85vh]">
        <AnimatePresence mode="wait">
          {currentWallpaper && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img
                src={currentWallpaper.url}
                alt={currentWallpaper.title}
                className="block w-full h-full min-w-full object-cover object-top"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom-only overlay for text readability — does not hide top of image */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
      </div>

      {/* Content sits over the image */}
      <div className="absolute inset-0 pt-16 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full mx-auto flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg"
          >
            Discover Stunning
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Desktop Wallpapers
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-white/90 mb-8 max-w-2xl drop-shadow-md"
          >
            Browse thousands of high-quality wallpapers for every screen size.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onSubmit={handleSearch}
            className="w-full max-w-2xl"
          >
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/60" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search wallpapers..."
                className={cn(
                  'w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-xl',
                  'border border-white/20 text-white placeholder-white/60',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                  'transition-all'
                )}
              />
            </div>
          </motion.form>

          {featuredWallpapers && featuredWallpapers.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex gap-2 mt-8"
            >
              {featuredWallpapers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    index === currentIndex ? 'bg-primary w-6' : 'bg-white/40'
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
