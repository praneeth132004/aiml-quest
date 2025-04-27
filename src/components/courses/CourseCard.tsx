import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Import the updated interface and helper function
import { CourseItemData, getYouTubeVideoId } from '@/data/coursesData';

import { DialogTrigger } from '@/components/ui/dialog'; // Import DialogTrigger

// Update interface name and prop name
interface CourseCardProps {
  item: CourseItemData;
  onPlayVideo: (videoId: string) => void; // Add prop for click handler
}

// Rename component and update prop name
const CourseCard: React.FC<CourseCardProps> = ({ item, onPlayVideo }) => {
  // Thumbnail logic: Prioritize item.thumbnailUrl, then YouTube, then placeholder
  let finalThumbnailUrl = '/placeholder.svg'; // Default placeholder

  if (item.thumbnailUrl) {
    // 1. Use provided thumbnail if available
    finalThumbnailUrl = item.thumbnailUrl;
  } else {
    // 2. Try to generate YouTube thumbnail if no direct URL
    const videoId = getYouTubeVideoId(item.url);
    if (videoId) {
      finalThumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    // 3. If neither works, it remains the placeholder
  }

  const videoId = getYouTubeVideoId(item.url);

  const handleClick = () => {
    if (videoId) {
      onPlayVideo(videoId);
    } else {
      // Optionally handle non-YouTube links (e.g., open in new tab)
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card
      className="overflow-hidden transition-shadow duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleClick} // Add click handler to the card
      aria-label={`Play video: ${item.title}`} // Improve accessibility
    >
      <CardHeader className="p-0">
        {/* Removed link wrapper */}
        <img
          src={finalThumbnailUrl} // Use the determined thumbnail URL
          alt={`Thumbnail for ${item.title}`}
            className="aspect-video w-full object-cover"
            onError={(e) => {
              // Fallback if thumbnail fails to load (keep placeholder)
              (e.target as HTMLImageElement).src = '/placeholder.svg';
              (e.target as HTMLImageElement).alt = 'Placeholder image';
            }}
          />
        {/* Removed link wrapper */}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-base font-medium leading-tight">
          {/* Removed link wrapper */}
          {item.title}
        </CardTitle>
      </CardContent>
    </Card>
  );
};

// Update default export
export default CourseCard;
