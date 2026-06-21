import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/outline';
import logoImg from '@/images/jyora1.png';

export const Footer: React.FC = () => {
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="bg-surface/50 backdrop-blur-xl border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-4"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <motion.img
              src={logoImg}
              alt="Jyora"
              className="w-8 h-8 rounded-lg"
              whileHover={{ rotate: 10, scale: 1.1 }}
            />
            <span className="text-white font-bold text-xl">Jyora</span>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-white/60 text-sm flex items-center gap-1"
          >
            Made with{' '}
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 2 }}
            >
              <HeartIcon className="w-4 h-4 text-accent" />
            </motion.span>{' '}
            for wallpaper enthusiasts
          </motion.p>

          <motion.div variants={itemVariants} className="flex items-center gap-6 text-sm text-white/60">
            {['Privacy', 'Terms', 'Contact'].map((link, index) => (
              <motion.a
                key={link}
                href="#"
                className="hover:text-white transition-colors"
                whileHover={{ scale: 1.1, color: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
              >
                {link}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};
