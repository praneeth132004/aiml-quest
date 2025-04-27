import React, { useState } from 'react'; // Import useState
import { courses, CourseItemData } from '@/data/coursesData'; // Import CourseItemData
import CourseCard from '@/components/courses/CourseCard';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog"; // Import Dialog components
import { X } from 'lucide-react'; // Import X icon for close button

const CoursesPage: React.FC = () => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const handlePlayVideo = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  const handleCloseDialog = () => {
    setSelectedVideoId(null);
  };

  return (
    // Removed PageLayout wrapper as it's applied in App.tsx routes
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Courses</h1>
      <p className="mb-8 text-muted-foreground">Explore curated video resources for your AI/ML journey.</p>
        <div className="space-y-12">
          {courses.map((category, index) => (
            <section key={index} aria-labelledby={`category-title-${index}`}>
              <h2 id={`category-title-${index}`} className="mb-6 text-2xl font-semibold tracking-tight">
              {category.categoryTitle}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Pass onPlayVideo prop */}
              {category.items.map((item: CourseItemData, itemIndex: number) => (
                <CourseCard
                  key={itemIndex}
                  item={item}
                  onPlayVideo={handlePlayVideo} // Pass the handler function
                />
              ))}
            </div>
            {index < courses.length - 1 && <Separator className="my-12" />}
          </section>
          ))}
        </div>

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideoId} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            {/* Optional: Add title if needed */}
            {/* <DialogTitle>Video Player</DialogTitle> */}
            <DialogClose
              onClick={handleCloseDialog}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          {selectedVideoId && (
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    // Removed PageLayout wrapper as it's applied in App.tsx routes
  );
};

export default CoursesPage;
