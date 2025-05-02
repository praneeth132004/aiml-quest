
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import GlobalSearch from '@/components/GlobalSearch';

interface PageLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  hideFooter?: boolean; // Add hideFooter prop
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, requireAuth = false, hideFooter = false }) => { // Destructure hideFooter
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Check if user is authenticated when requireAuth is true
  useEffect(() => {
    if (requireAuth && !isLoading && !user) {
      console.log('User not authenticated, redirecting to auth page');
      navigate('/auth');
    }
  }, [requireAuth, user, isLoading, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      <main className="flex-grow">
        {children}
      </main>
      {!hideFooter && <Footer />} {/* Conditionally render Footer */}
    </div>
  );
};

export default PageLayout;
