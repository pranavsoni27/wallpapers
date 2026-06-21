import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';

/**
 * Hook that redirects to home page when user logs out
 */
export const useRedirectOnLogout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const prevUserRef = useRef<typeof user>(user);

  useEffect(() => {
    // Check if user was authenticated and is now logged out
    if (prevUserRef.current !== null && user === null) {
      navigate('/', { replace: true });
    }

    // Update the reference
    prevUserRef.current = user;
  }, [user, navigate]);
};
