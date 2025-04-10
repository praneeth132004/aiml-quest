import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

/**
 * A hook that checks if the user is authenticated on each page load
 * and redirects to the auth page if not.
 */
export const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth status:', error);
          navigate('/auth');
          return;
        }
        
        if (!data.session) {
          console.log('No active session found, redirecting to auth page');
          navigate('/auth');
        }
      } catch (err) {
        console.error('Error in auth check:', err);
        navigate('/auth');
      }
    };

    checkAuth();
  }, [navigate]);
};
