
import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PageLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, requireAuth = false }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated when requireAuth is true
  useEffect(() => {
    if (requireAuth && !isLoading && !user) {
      console.log('User not authenticated, redirecting to auth page');
      navigate('/auth');
    }
  }, [requireAuth, user, isLoading, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
