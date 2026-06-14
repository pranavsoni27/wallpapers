import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '@/types';
import { SearchModal } from '@/components/features';
import { motion } from 'framer-motion';

export const CategoriesPage: React.FC = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Categories</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                to={`/?category=${category}`}
                className="block p-6 rounded-2xl bg-surface/50 backdrop-blur-xl border border-white/10 hover:border-primary/50 transition-all group"
              >
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                  {category}
                </h3>
                <p className="text-white/60 text-sm">
                  Browse {category.toLowerCase()} wallpapers
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <SearchModal />
    </>
  );
};
