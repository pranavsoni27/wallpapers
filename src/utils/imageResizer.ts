export type ImageFormat = 'jpg' | 'png' | 'webp';

export interface ResizeOptions {
  width: number;
  height: number;
  format?: ImageFormat;
  quality?: number;
}

export const imageResizer = {
  async resizeImage(
    imageUrl: string,
    options: ResizeOptions
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        let targetWidth = options.width;
        let targetHeight = options.height;

        // Preserve aspect ratio
        if (aspectRatio > targetWidth / targetHeight) {
          targetHeight = targetWidth / aspectRatio;
        } else {
          targetWidth = targetHeight * aspectRatio;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw image with high quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Convert to blob
        const format = options.format || 'jpg';
        const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
        const quality = options.quality || 0.92;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image to blob'));
            }
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = imageUrl;
    });
  },

  async downloadImage(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  getRecommendedResolution(): string {
    const width = window.screen.width;
    const height = window.screen.height;

    if (width >= 7680 && height >= 4320) return '8K';
    if (width >= 5120 && height >= 2880) return '5K';
    if (width >= 3840 && height >= 2160) return '4K';
    if (width >= 2560 && height >= 1440) return '2K';
    if (width >= 1920 && height >= 1080) return 'Full HD';
    
    return 'Full HD';
  },

  getResolutionDimensions(resolution: string): { width: number; height: number } {
    const resolutions: Record<string, { width: number; height: number }> = {
      'Full HD': { width: 1920, height: 1080 },
      '2K': { width: 2560, height: 1440 },
      '4K': { width: 3840, height: 2160 },
      '5K': { width: 5120, height: 2880 },
      '8K': { width: 7680, height: 4320 },
    };

    return resolutions[resolution] || resolutions['Full HD'];
  },
};
