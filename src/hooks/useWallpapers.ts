import { useQuery } from '@tanstack/react-query';
import { wallpaperService } from '@/services/wallpaperService';
import type { WallpaperFilters } from '@/types';

export const useWallpapers = (filters?: WallpaperFilters) => {
  const query = useQuery({
    queryKey: ['wallpapers', filters],
    queryFn: async () => {
      return await wallpaperService.fetchWallpapers();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return query;
};

export const useFeaturedWallpapers = () => {
  return useQuery({
    queryKey: ['featured-wallpapers'],
    queryFn: async () => {
      const wallpapers = await wallpaperService.fetchWallpapers();
      return wallpaperService.getRandomFeaturedWallpapers(wallpapers, 5);
    },
    staleTime: 60 * 60 * 1000, // 1 hour - cache for a full day's use
  });
};

export const useTrendingWallpapers = () => {
  return useQuery({
    queryKey: ['trending-wallpapers'],
    queryFn: async () => {
      const wallpapers = await wallpaperService.fetchWallpapers();
      return wallpaperService.getTrendingWallpapers(wallpapers);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useNewestWallpapers = () => {
  return useQuery({
    queryKey: ['newest-wallpapers'],
    queryFn: async () => {
      const wallpapers = await wallpaperService.fetchWallpapers();
      return wallpaperService.getNewestWallpapers(wallpapers);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRandomHomeWallpapers = (count: number = 10) => {
  return useQuery({
    queryKey: ['random-home-wallpapers', count],
    queryFn: async () => {
      const wallpapers = await wallpaperService.fetchWallpapers();
      return wallpaperService.getRandomWallpapers(wallpapers, count);
    },
    staleTime: 60 * 60 * 1000, // 1 hour - cache for a full day's use
  });
};

export const useRandomAllWallpapers = () => {
  return useQuery({
    queryKey: ['random-all-wallpapers'],
    queryFn: async () => {
      const wallpapers = await wallpaperService.fetchWallpapers();
      return wallpaperService.getAllWallpapersRandomized(wallpapers);
    },
    staleTime: 60 * 60 * 1000, // 1 hour - cache for a full day's use
  });
};
