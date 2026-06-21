import React from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';
import { useAppStore } from '@/store';
import { CATEGORIES } from '@/types';
import { cn } from '@/utils';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, onClose }) => {
  const { filters, setFilters, resetFilters } = useAppStore();

  const handleCategoryChange = (category: string) => {
    setFilters({ category: filters.category === category ? undefined : category });
  };

  const handleSortChange = (sortBy: string) => {
    setFilters({ sortBy: sortBy as any });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 right-0 h-full w-80 bg-surface/95 backdrop-blur-xl border-l border-white/10 z-50',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-white">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close filters"
            >
              <XMarkIcon className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6 space-y-8">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-white/80 mb-3">Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={cn(
                      'w-full px-4 py-2 rounded-lg text-left transition-colors',
                      filters.category === category
                        ? 'bg-primary text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="text-sm font-semibold text-white/80 mb-3">Sort By</h3>
              <div className="space-y-2">
                {['latest', 'popular', 'mostDownloaded', 'az'].map((sort) => (
                  <button
                    key={sort}
                    onClick={() => handleSortChange(sort)}
                    className={cn(
                      'w-full px-4 py-2 rounded-lg text-left transition-colors capitalize',
                      filters.sortBy === sort
                        ? 'bg-primary text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    )}
                  >
                    {sort === 'az' ? 'A-Z' : sort}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 space-y-3">
            <Button
              variant="outline"
              onClick={resetFilters}
              className="w-full"
            >
              Reset Filters
            </Button>
            <Button
              onClick={onClose}
              className="w-full"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
