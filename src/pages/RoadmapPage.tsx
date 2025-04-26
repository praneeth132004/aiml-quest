import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { useRoadmap } from '@/hooks/use-roadmap';
import { supabase } from '@/integrations/supabase/client';
import RoadmapCard from '@/components/roadmap/RoadmapCard';
import { Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function RoadmapPage() {
  useAuthCheck();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Get the current user ID
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || '');
    };

    getUserId();
  }, []);

  const { modules, loading, error, hasRoadmap, updateProgress } = useRoadmap(userId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-gray-600">Generating your personalized learning roadmap...</p>
        <p className="text-gray-500 text-sm mt-2">This may take a moment as we tailor content to your preferences.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error loading roadmap: {error.message}</p>
      </div>
    );
  }

  if (!hasRoadmap) {
    return (
      <div className="container mx-auto py-16 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">No Learning Path Found</CardTitle>
            <CardDescription>
              You haven't created a personalized learning path yet. Let's set one up for you!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              To create your personalized AI/ML learning roadmap, we need to know a bit about your goals,
              experience level, and learning preferences.
            </p>
            <p className="text-gray-600">
              This will only take a minute and will help us tailor the perfect learning journey for you.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/onboarding')} className="w-full">
              Create My Learning Path <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Learning Path</h1>
          <p className="text-gray-600 mt-2">Follow your personalized roadmap to master AI and Machine Learning</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" onClick={() => navigate('/onboarding')}>
            Update Preferences
          </Button>
        </div>
      </div>

      {/* Vertical Timeline Layout */}
      <div className="relative flex flex-col items-center px-4">
        {/* The vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 transform -translate-x-1/2" style={{ zIndex: -1 }}></div>

        {modules.map((module, index) => (
          <div key={module.id} className="relative w-full max-w-3xl mb-8 flex justify-center">
            {/* Dot on the timeline */}
            <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full ${module.status === 'completed' ? 'bg-green-500' : module.status === 'in-progress' ? 'bg-yellow-400' : 'bg-gray-400'} border-2 border-white dark:border-gray-800`}></div>
            <div className="w-full">
              <RoadmapCard
                module={module}
                onProgressUpdate={(progress) => updateProgress(module.id, progress)}
              />
            </div>
          </div>
        ))}
      </div>
      {/* 
      // Old Grid Layout - commented out for reference
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <RoadmapCard
            key={module.id}
            module={module}
            onProgressUpdate={(progress) => updateProgress(module.id, progress)}
          />
        ))}
      </div> 
      */}
    </div>
  );
}
