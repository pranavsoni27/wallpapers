import { useQuery } from '@tanstack/react-query';
import { wallpaperService } from '@/services/wallpaperService';
import type { WallpaperFilters } from '@/types';

export const useWallpapers = (filters?: WallpaperFilters) => {
  const query = useQuery({
    queryKey: ['wallpapers', filters],
    queryFn: async () => {
      const wallpapers = await wallpaperService.fetchWallpapers();
      if (filters) {
        return wallpaperService.filterWallpapers(wallpapers, filters);
      }
      return wallpapers;
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
      return wallpaperService.getFeaturedWallpapers(wallpapers);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
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
