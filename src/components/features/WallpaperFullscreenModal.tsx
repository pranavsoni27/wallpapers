import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';
import { Wallpaper } from '@/types';

interface WallpaperFullscreenModalProps {
  wallpaper: Wallpaper | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export const WallpaperFullscreenModal: React.FC<WallpaperFullscreenModalProps> = ({
  wallpaper,
  isOpen,
  onClose,
  onDownload,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!wallpaper) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black"
        >
          <img
            src={wallpaper.url}
            alt={wallpaper.title}
            className="w-full h-full object-contain"
          />

          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent">
            <div>
              <h2 className="text-white font-semibold text-lg">{wallpaper.title}</h2>
              <p className="text-white/60 text-sm">{wallpaper.category}</p>
            </div>
            <Button variant="outline" onClick={onClose} aria-label="Close fullscreen">
              <XMarkIcon className="w-5 h-5 mr-2" />
              Close Full Screen
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent">
            <Button size="lg" onClick={onDownload} className="min-w-[200px]">
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Download
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
