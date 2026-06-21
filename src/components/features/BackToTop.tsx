import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      onClick={scrollToTop}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        'fixed bottom-8 right-8 p-3 rounded-full bg-gradient-primary',
        'shadow-lg shadow-primary/25 hover:shadow-primary/40',
        'transition-all z-30',
        !isVisible && 'pointer-events-none'
      )}
      aria-label="Back to top"
    >
      <motion.div
        animate={{ y: isVisible ? [0, -5, 0] : 0 }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronUpIcon className="w-6 h-6 text-white" />
      </motion.div>
    </motion.button>
  );
};
