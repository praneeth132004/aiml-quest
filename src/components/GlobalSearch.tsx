import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  BookOpen, 
  Users, 
  MessageSquare, 
  HelpCircle, 
  Home, 
  FileText, 
  User, 
  Settings, 
  LayoutDashboard 
} from 'lucide-react';
import { search, SearchResult } from '@/services/searchService';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Filter results based on search term
  useEffect(() => {
    const searchResults = search(searchTerm);
    setResults(searchResults);
    setSelectedIndex(0); // Reset selection when results change
  }, [searchTerm]);

  // Handle navigation to selected result
  const handleResultClick = (path: string) => {
    navigate(path);
    onClose();
    setSearchTerm('');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        if (results.length > 0 && selectedIndex >= 0) {
          handleResultClick(results[selectedIndex].path);
        }
        break;
    }
  };

  // Get icon based on result type and path
  const getIconForType = (type: string, path: string) => {
    // First check specific paths
    if (path === '/profile') {
      return <User className="h-5 w-5" />;
    } else if (path === '/settings') {
      return <Settings className="h-5 w-5" />;
    } else if (path === '/dashboard') {
      return <LayoutDashboard className="h-5 w-5" />;
    } else if (path === '/') {
      return <Home className="h-5 w-5" />;
    } else if (path === '/roadmap') {
      return <FileText className="h-5 w-5" />;
    }
    
    // Then fall back to type-based icons
    switch (type) {
      case 'quiz':
        return <HelpCircle className="h-5 w-5" />;
      case 'course':
        return <BookOpen className="h-5 w-5" />;
      case 'post':
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <span key={i} className="bg-yellow-100 font-medium">{part}</span> 
            : part
        )}
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <Input
            placeholder="Search quizzes, courses, and posts..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
        <div className="mt-4 max-h-[300px] overflow-y-auto">
          {results.length > 0 ? (
            <ul className="space-y-2">
              {results.map((result, index) => (
                <li key={result.id}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left ${index === selectedIndex ? 'bg-gray-100' : ''}`}
                    onClick={() => handleResultClick(result.path)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center">
                      <div className="mr-3 text-blue-600">
                        {getIconForType(result.type, result.path)}
                      </div>
                      <div>
                        <p className="font-medium">
                          {highlightMatch(result.title, searchTerm)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {result.type !== 'page' && (
                            <span className="inline-block bg-gray-100 text-gray-700 rounded px-1 mr-2 text-xs">
                              {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                            </span>
                          )}
                          {highlightMatch(result.description, searchTerm)}
                        </p>
                      </div>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-4">No results found</p>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Press <kbd className="px-1 py-0.5 bg-gray-100 rounded border">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 rounded border">K</kbd> to open search
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;
