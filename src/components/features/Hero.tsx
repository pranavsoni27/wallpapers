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
      <div className="relative w-full aspect-video min-h-[320px] max-h-[70vh] bg-surface animate-pulse" />
    );
  }

  const currentWallpaper = featuredWallpapers?.[currentIndex];

  return (
    <section className="relative w-full aspect-video min-h-[320px] max-h-[70vh] overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        {currentWallpaper && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={currentWallpaper.url}
              alt={currentWallpaper.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-white mb-4"
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
          className="text-xl text-white/80 mb-8 max-w-2xl"
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

        {/* Dots */}
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
    </section>
  );
};
