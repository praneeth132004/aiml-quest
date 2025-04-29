import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { ClockIcon, BookOpenIcon, CheckCircleIcon, Loader2 } from 'lucide-react';

// We'll get quiz data from the backend later
interface Quiz {
  id: string;
  title: string;
  completed: boolean;
  score?: number;
  moduleId: string;
}

// Temporary quiz data until backend integration
const mockRecentQuizzes: Quiz[] = [
  { id: "quiz-1", title: "Python Basics for ML", completed: false, moduleId: "module-1" },
  { id: "quiz-2", title: "Data Manipulation with Pandas", completed: false, moduleId: "module-2" },
];

const DashboardPage: React.FC = () => {
  const { user, profile, roadmapData, isLoading, isExtendedDataLoading } = useAuth();

  // Handle main loading state
  if (isLoading || isExtendedDataLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  // Handle case where user has no roadmap (needs onboarding)
  if (!roadmapData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Set Up Your Learning Path</h2>
        <p className="text-gray-600 mb-6">Let's personalize your roadmap based on your goals and preferences.</p>
        <Link to="/onboarding">
          <Button>Start Onboarding</Button>
        </Link>
      </div>
    );
  }

  // Calculate progress
  const allModules = roadmapData.modules || [];
  const completedModules = allModules.filter(moduleId => 
    roadmapData.preferences?.completedModules?.includes(moduleId)
  );
  
  const progressPercentage = allModules.length > 0 
    ? (completedModules.length / allModules.length) * 100 
    : 0;

  // Get next steps (next 2 incomplete modules)
  const nextStepsModules = allModules
    .filter(moduleId => !roadmapData.preferences?.completedModules?.includes(moduleId))
    .slice(0, 2)
    .map(moduleId => ({
      id: moduleId,
      title: `Module ${moduleId}`, // You might want to fetch actual module titles from somewhere
      type: 'module'
    }));

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Welcome Section */}
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Welcome back, {profile?.full_name || user?.user_metadata?.full_name || 'Learner'}!
      </h1>
      <p className="text-gray-600 mb-8">Let's pick up where you left off.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Roadmap Progress Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Learning Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            {nextStepsModules.length > 0 ? (
              <>
                <p className="text-sm text-gray-600 mb-2">Currently on:</p>
                <h3 className="text-lg font-semibold mb-4">{nextStepsModules[0].title}</h3>
                <Progress value={progressPercentage} className="w-full mb-4" />
                <p className="text-sm text-gray-500">{Math.round(progressPercentage)}% completed</p>
              </>
            ) : (
              <p className="text-gray-600">All modules completed! Check the Roadmap page for advanced content.</p>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/roadmap">
              <Button variant="outline">View Full Roadmap</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Quick Links Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Link to="/roadmap"><Button variant="ghost" className="w-full justify-start">Roadmap</Button></Link>
            <Link to="/courses"><Button variant="ghost" className="w-full justify-start">Courses</Button></Link>
            <Link to="/quizzes"><Button variant="ghost" className="w-full justify-start">Quizzes</Button></Link>
            <Link to="/community"><Button variant="ghost" className="w-full justify-start">Community</Button></Link>
            <Link to="/profile"><Button variant="ghost" className="w-full justify-start">Profile</Button></Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Continue Learning Section */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
          </CardHeader>
          <CardContent>
            {nextStepsModules.length > 0 ? (
              <ul className="space-y-3">
                {nextStepsModules.map(step => (
                  <li key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                    <div className="flex items-center space-x-3">
                      <BookOpenIcon className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{step.title}</p>
                        <Badge variant="secondary" className="mt-1">{step.type}</Badge>
                      </div>
                    </div>
                    <Link to={`/roadmap/module/${step.id}`}>
                      <Button size="sm" variant="outline">Go</Button>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">You've completed all available modules!</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Quizzes Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            {mockRecentQuizzes.length > 0 ? (
              <ul className="space-y-3">
                {mockRecentQuizzes.map(quiz => (
                  <li key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{quiz.title}</p>
                      {quiz.completed ? (
                        <div className="flex items-center text-xs text-green-600 mt-1">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Completed - Score: {quiz.score}%
                        </div>
                      ) : (
                        <div className="flex items-center text-xs text-yellow-600 mt-1">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          Pending
                        </div>
                      )}
                    </div>
                    <Link to={`/quizzes/${quiz.id}`}>
                      <Button size="sm" variant={quiz.completed ? "outline" : "default"}>
                        {quiz.completed ? "Review" : "Start"}
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No recent quiz activity.</p>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/quizzes">
              <Button variant="outline">View All Quizzes</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;