import { Wallpaper, WallpaperFilters } from '@/types';

const API_URL = 'https://xbccmcszhnybxzlirjgk.supabase.co/storage/v1/object/public/wallpaper/gallery.json';
const ANALYTICS_URL = 'https://xbccmcszhnybxzlirjgk.supabase.co/functions/v1/wallpaper-download-counter';

interface GalleryCategory {
  id: string;
  label: string;
}

interface GalleryWallpaper {
  id: string;
  file: string;
  label: string;
  categoryId: string;
  updatedAt: string;
  thumbnailUrl: string;
  downloadCount: number;
}

interface GalleryData {
  categories: GalleryCategory[];
  themes: {
    dark?: GalleryWallpaper[];
    light?: GalleryWallpaper[];
  };
}

function transformGalleryData(data: GalleryData): Wallpaper[] {
  const categoryMap = new Map(data.categories.map((category) => [category.id, category.label]));
  const items = [...(data.themes?.dark ?? []), ...(data.themes?.light ?? [])];

  return items.map((item) => ({
    id: item.id,
    title: item.label,
    url: item.file,
    thumbnail: item.thumbnailUrl,
    resolution: '4K',
    width: 3840,
    height: 2160,
    category: categoryMap.get(item.categoryId) ?? item.categoryId,
    tags: [],
    downloadCount: item.downloadCount ?? 0,
    uploadDate: item.updatedAt,
    featured: item.categoryId === 'featured',
  }));
}

export const wallpaperService = {
  async fetchWallpapers(): Promise<Wallpaper[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch wallpapers');
      }
      const data: GalleryData = await response.json();
      return transformGalleryData(data);
    } catch (error) {
      console.error('Error fetching wallpapers:', error);
      throw error;
    }
  },

  async trackDownload(wallpaperId: string, resolution: string): Promise<void> {
    try {
      await fetch(ANALYTICS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallpaperId,
          timestamp: new Date().toISOString(),
          resolution,
        }),
      });
    } catch (error) {
      console.error('Error tracking download:', error);
      // Don't throw error to avoid blocking download
    }
  },

  filterWallpapers(wallpapers: Wallpaper[], filters: WallpaperFilters): Wallpaper[] {
    let filtered = [...wallpapers];

    if (filters.category) {
      filtered = filtered.filter(w => w.category === filters.category);
    }

    if (filters.resolution) {
      filtered = filtered.filter(w => w.resolution === filters.resolution);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(w =>
        w.title.toLowerCase().includes(query) ||
        w.category.toLowerCase().includes(query) ||
        w.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    switch (filters.sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'mostDownloaded':
        filtered.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'az':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  },

  getFeaturedWallpapers(wallpapers: Wallpaper[]): Wallpaper[] {
    return wallpapers.filter(w => w.featured).slice(0, 5);
  },

  getTrendingWallpapers(wallpapers: Wallpaper[]): Wallpaper[] {
    return [...wallpapers]
      .sort((a, b) => b.downloadCount - a.downloadCount)
      .slice(0, 10);
  },

  getNewestWallpapers(wallpapers: Wallpaper[]): Wallpaper[] {
    return [...wallpapers]
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      .slice(0, 10);
  },
};
