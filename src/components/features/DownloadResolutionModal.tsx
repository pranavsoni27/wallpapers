import React, { useEffect, useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Modal, Button } from '@/components/ui';
import { Wallpaper, DOWNLOAD_RESOLUTIONS } from '@/types';
import { useWallpaperDownload } from '@/hooks/useWallpaperDownload';
import { DEMO_DOWNLOAD_LIMIT } from '@/lib/supabase';
import { cn } from '@/utils';

interface DownloadResolutionModalProps {
  wallpaper: Wallpaper | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadResolutionModal: React.FC<DownloadResolutionModalProps> = ({
  wallpaper,
  isOpen,
  onClose,
}) => {
  const [selectedResolutions, setSelectedResolutions] = useState<string[]>([]);
  const {
    isDownloading,
    downloadProgress,
    downloadError,
    downloadMultiple,
    resetError,
    isAuthenticated,
    hasUnlimitedAccess,
    canDownload,
    remainingDownloads,
  } = useWallpaperDownload(wallpaper);

  useEffect(() => {
    if (isOpen) {
      setSelectedResolutions([]);
      resetError();
    }
  }, [isOpen, wallpaper?.id, resetError]);

  if (!wallpaper) return null;

  const toggleResolution = (label: string) => {
    setSelectedResolutions((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleDownload = async () => {
    if (selectedResolutions.length === 0) return;
    await downloadMultiple(selectedResolutions);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md" zIndex="z-[70]">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-1">Select Resolution</h2>
        <p className="text-white/60 text-sm mb-6">{wallpaper.title}</p>

        {!isAuthenticated ? (
          <p className="text-white/80 text-sm mb-4">
            Please login or sign up to download wallpapers.
          </p>
        ) : hasUnlimitedAccess ? (
          <p className="text-green-300 text-sm mb-4">Unlimited download access enabled.</p>
        ) : (
          <p className="text-white/80 text-sm mb-4">
            Demo access: {remainingDownloads} of {DEMO_DOWNLOAD_LIMIT} free downloads remaining.
          </p>
        )}

        <div className="space-y-2 mb-6">
          {DOWNLOAD_RESOLUTIONS.map((resolution) => {
            const isSelected = selectedResolutions.includes(resolution.label);

            return (
              <button
                key={resolution.label}
                type="button"
                onClick={() => toggleResolution(resolution.label)}
                disabled={isDownloading}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors text-left',
                  isSelected
                    ? 'border-primary bg-primary/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                )}
              >
                <span className="font-medium">{resolution.label}</span>
                <span className="text-sm text-white/60">
                  {resolution.width} × {resolution.height}
                </span>
              </button>
            );
          })}
        </div>

        {selectedResolutions.length === 0 && (
          <p className="text-amber-300/90 text-sm mb-4">
            Select at least one resolution to download.
          </p>
        )}

        {downloadError && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {downloadError}
          </div>
        )}

        {!canDownload && isAuthenticated && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            Download limit reached. Contact admin for free access or upgrade to paid.
          </div>
        )}

        <Button
          className="w-full"
          size="lg"
          onClick={handleDownload}
          disabled={isDownloading || selectedResolutions.length === 0 || !canDownload}
        >
          {isDownloading ? (
            <span>Downloading... {downloadProgress}%</span>
          ) : (
            <span className="flex items-center gap-2">
              <ArrowDownTrayIcon className="w-5 h-5" />
              Download
              {selectedResolutions.length > 0 ? ` (${selectedResolutions.length})` : ''}
            </span>
          )}
        </Button>
      </div>
    </Modal>
  );
};
