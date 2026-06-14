export interface Wallpaper {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  resolution: string;
  width: number;
  height: number;
  category: string;
  tags: string[];
  downloadCount: number;
  uploadDate: string;
  featured?: boolean;
}

export interface WallpaperFilters {
  category?: string;
  resolution?: string;
  sortBy?: 'latest' | 'popular' | 'mostDownloaded' | 'az';
  searchQuery?: string;
}

export const WALLPAPERS_PER_PAGE = 50;

export interface DownloadResolution {
  label: string;
  width: number;
  height: number;
}

export const DOWNLOAD_RESOLUTIONS: DownloadResolution[] = [
  { label: 'Full HD', width: 1920, height: 1080 },
  { label: '2K', width: 2560, height: 1440 },
  { label: '4K', width: 3840, height: 2160 },
  { label: '5K', width: 5120, height: 2880 },
  { label: '8K', width: 7680, height: 4320 },
];

export const CATEGORIES = [
  'Featured',
  'Cars',
  'Anime',
  'Ethereal',
  'Space',
] as const;

export type Category = typeof CATEGORIES[number];
