import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { courses } from '@/data/coursesData';
// Update import to use the renamed component
import CourseCard from '@/components/courses/CourseCard';
import { Separator } from '@/components/ui/separator';

const CoursesPage: React.FC = () => {
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
              {/* Update map to use 'items' and render 'CourseCard' with 'item' prop */}
              {category.items.map((item, itemIndex) => (
                <CourseCard key={itemIndex} item={item} />
              ))}
            </div>
            {index < courses.length - 1 && <Separator className="my-12" />}
          </section>
          ))}
        </div>
      </div>
    // Removed PageLayout wrapper as it's applied in App.tsx routes
  );
};

export default CoursesPage;
