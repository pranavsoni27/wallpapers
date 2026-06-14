import React from 'react';
import { cn } from '@/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-white/10 rounded-lg',
        className
      )}
    />
  );
};
