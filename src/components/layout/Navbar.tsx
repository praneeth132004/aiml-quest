
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, User, BarChart2, Users, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b w-full">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-aiml-primary to-aiml-secondary flex items-center justify-center mr-2">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">AIML Odyssey</span>
          </Link>
        </div>

        {isMobile ? (
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-6 mr-4">
              <NavLink to="/roadmap">Roadmap</NavLink>
              <NavLink to="/courses">Courses</NavLink>
              <NavLink to="/quizzes">Quizzes</NavLink>
              <NavLink to="/community">Community</NavLink>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="default" size="sm">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 top-16 bg-white z-40 transform transition-transform duration-300 ease-in-out",
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col p-4">
            <MobileNavLink to="/roadmap" icon={<BarChart2 size={18} />} onClick={toggleMenu}>
              Roadmap
            </MobileNavLink>
            <MobileNavLink to="/courses" icon={<BookOpen size={18} />} onClick={toggleMenu}>
              Courses
            </MobileNavLink>
            <MobileNavLink to="/quizzes" icon={<User size={18} />} onClick={toggleMenu}>
              Quizzes
            </MobileNavLink>
            <MobileNavLink to="/community" icon={<Users size={18} />} onClick={toggleMenu}>
              Community
            </MobileNavLink>
            <div className="mt-4">
              <Button className="w-full">Sign In</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to} className="text-gray-700 hover:text-primary transition-colors">
    {children}
  </Link>
);

const MobileNavLink = ({ 
  to, 
  children, 
  icon, 
  onClick 
}: { 
  to: string; 
  children: React.ReactNode; 
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <Link 
    to={to} 
    className="flex items-center py-3 px-2 text-lg border-b border-gray-100"
    onClick={onClick}
  >
    <span className="mr-3">{icon}</span>
    {children}
  </Link>
);

export default Navbar;
