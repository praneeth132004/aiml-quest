import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Import the updated interface and helper function
import { CourseItemData, getYouTubeVideoId } from '@/data/coursesData';

// Update interface name and prop name
interface CourseCardProps {
  item: CourseItemData;
}

// Rename component and update prop name
const CourseCard: React.FC<CourseCardProps> = ({ item }) => {
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

  return (
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        {/* Update link and label */}
        <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`View course: ${item.title}`}>
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
        </a>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-base font-medium leading-tight">
          {/* Update link and title */}
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {item.title}
          </a>
        </CardTitle>
      </CardContent>
    </Card>
  );
};

// Update default export
export default CourseCard;
