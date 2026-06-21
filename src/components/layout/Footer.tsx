import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import logoImg from '@/images/jyora1.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface/50 backdrop-blur-xl border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="Jyora" className="w-8 h-8 rounded-lg" />
            <span className="text-white font-bold text-xl">Jyora</span>
          </div>

          <p className="text-white/60 text-sm flex items-center gap-1">
            Made with <HeartIcon className="w-4 h-4 text-accent" /> for wallpaper enthusiasts
          </p>

          <div className="flex items-center gap-6 text-sm text-white/60">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
