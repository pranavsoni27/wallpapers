import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAppStore } from '@/store';
import { useFavorites } from '@/hooks';
import { useAuth } from '@/contexts/AuthProvider';
import { Button } from '@/components/ui';
import { cn } from '@/utils';
import logoImg from '@/images/jyora1.png';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsSearchOpen } = useAppStore();
  const { count } = useFavorites();
  const { isAuthenticated, isAdmin, user, signOut, openAuthModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const logoutRef = useRef<HTMLButtonElement | null>(null);
  const mobileLogoutRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'All Wallpapers', path: '/all-wallpapers' },
    { name: 'Latest', path: '/latest' },
    { name: 'Popular', path: '/popular' },
    { name: 'Categories', path: '/categories' },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin', path: '/admin' });
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    setIsMobileMenuOpen(false);
    try {
      await signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getUserInitials = () => {
    const email = user?.email || '';
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
    const displayName = name || email;
    return displayName.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    if (!showLogoutConfirm) {
      setAnchorRect(null);
    }
  }, [showLogoutConfirm]);

  // Close popup when clicking outside
  useEffect(() => {
    if (!showLogoutConfirm) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Don't close if clicking on the logout button itself or inside the popup
      if (
        popupRef.current && !popupRef.current.contains(target) &&
        !logoutRef.current?.contains(target) &&
        !mobileLogoutRef.current?.contains(target)
      ) {
        setShowLogoutConfirm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLogoutConfirm]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImg} alt="Jyora" className="w-8 h-8 rounded-lg" />
            <span className="text-white font-bold text-xl" style={{color: "#daaf47"}}>Jyora</span>
          </Link>

          <motion.div
            className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={cn(
                    'text-sm font-medium transition-colors flex items-center gap-1.5 relative group',
                    isActive(item.path) ? 'text-primary' : 'text-white/70 hover:text-white'
                  )}
                >
                  {item.name === 'Admin' && <ShieldCheckIcon className="w-4 h-4" />}
                  {item.name}
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full"
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Search"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-white" />
            </motion.button>

            <motion.button
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/favorites');
                } else {
                  openAuthModal('login');
                }
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors relative"
              aria-label="Favorites"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {count > 0 ? (
                <HeartSolidIcon className="w-5 h-5 text-accent" />
              ) : (
                <HeartIcon className="w-5 h-5 text-white" />
              )}
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full text-xs text-white flex items-center justify-center">
                  {count}
                </span>
              )}
            </motion.button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                  {getUserInitials()}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  ref={logoutRef}
                  onClick={() => {
                    const rect = logoutRef.current?.getBoundingClientRect() ?? null;
                    setAnchorRect(rect);
                    setShowLogoutConfirm(true);
                  }}
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openAuthModal('login')}>
                  Login
                </Button>
                <Button size="sm" onClick={() => openAuthModal('signup')}>
                  Sign Up
                </Button>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-5 h-5 text-white" />
              ) : (
                <Bars3Icon className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'block py-2 px-4 text-sm font-medium transition-colors',
                  isActive(item.path) ? 'text-primary bg-white/5' : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                {item.name}
              </Link>
            ))}

            <div className="px-4 pt-4 mt-2 border-t border-white/10">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                      {getUserInitials()}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    ref={mobileLogoutRef}
                    onClick={() => {
                      const rect = mobileLogoutRef.current?.getBoundingClientRect() ?? null;
                      setAnchorRect(rect);
                      setShowLogoutConfirm(true);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      openAuthModal('login');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      openAuthModal('signup');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        {showLogoutConfirm && (
          <div
            ref={popupRef}
            style={{
              position: 'fixed',
              top: anchorRect ? anchorRect.bottom + 8 : undefined,
              right: anchorRect ? window.innerWidth - (anchorRect.left + anchorRect.width) : undefined,
              minWidth: 200,
            }}
            className="z-50 bg-surface border border-white/10 rounded-lg p-3 shadow-lg"
          >
            <div className="text-sm text-white font-semibold mb-1">Confirm logout</div>
            <div className="text-xs text-white/70 mb-3">Are you sure you want to logout?</div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};