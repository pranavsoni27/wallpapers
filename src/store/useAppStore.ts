import { create } from 'zustand';
import { WallpaperFilters } from '@/types';

interface AppStore {
  filters: WallpaperFilters;
  setFilters: (filters: Partial<WallpaperFilters>) => void;
  resetFilters: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  selectedWallpaper: string | null;
  setSelectedWallpaper: (id: string | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  filters: {},
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  resetFilters: () => set({ filters: {} }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  isSearchOpen: false,
  setIsSearchOpen: (open) => set({ isSearchOpen: open }),
  selectedWallpaper: null,
  setSelectedWallpaper: (id) => set({ selectedWallpaper: id }),
}));
