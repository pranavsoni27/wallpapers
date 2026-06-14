import React, { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Modal } from '@/components/ui';
import { useAppStore } from '@/store';
import { useWallpapers, useDebounce, useWallpaperModals } from '@/hooks';
import { WallpaperCard } from './WallpaperCard';
import { WallpaperModals } from './WallpaperModals';
import { cn } from '@/utils';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery } = useAppStore();
  const [localQuery, setLocalQuery] = useState('');
  const debouncedQuery = useDebounce(localQuery, 300);
  const wallpaperModals = useWallpaperModals();

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const { data: wallpapers, isLoading } = useWallpapers(
    debouncedQuery ? { searchQuery: debouncedQuery } : undefined
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    setIsSearchOpen(false);
  };

  return (
    <>
      <Modal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} className="max-w-4xl">
        <div className="p-6">
          <form onSubmit={handleSearch} className="relative mb-6">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/60" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search wallpapers..."
              className={cn(
                'w-full pl-12 pr-12 py-4 rounded-xl bg-white/10 backdrop-blur-xl',
                'border border-white/20 text-white placeholder-white/60',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                'transition-all'
              )}
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setLocalQuery('');
                setSearchQuery('');
              }}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </form>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="aspect-video rounded-xl bg-white/10 animate-pulse" />
              ))}
            </div>
          ) : wallpapers && wallpapers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-auto">
              {wallpapers.slice(0, 12).map((wallpaper) => (
                <WallpaperCard
                  key={wallpaper.id}
                  wallpaper={wallpaper}
                  onPreview={wallpaperModals.handlePreview}
                  onDownload={wallpaperModals.handleDownload}
                />
              ))}
            </div>
          ) : debouncedQuery ? (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">No wallpapers found for "{debouncedQuery}"</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">Start typing to search wallpapers</p>
            </div>
          )}
        </div>
      </Modal>

      <WallpaperModals
        fullscreenWallpaper={wallpaperModals.fullscreenWallpaper}
        downloadWallpaper={wallpaperModals.downloadWallpaper}
        onCloseFullscreen={wallpaperModals.closeFullscreen}
        onCloseDownload={wallpaperModals.closeDownload}
        onFullscreenDownload={wallpaperModals.handleFullscreenDownload}
      />
    </>
  );
};
