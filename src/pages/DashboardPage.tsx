import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRoadmap } from '../hooks/use-roadmap'; // Assuming this hook provides roadmap progress
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card'; // Assuming path
import { Button } from '../components/ui/button'; // Assuming path
import { Badge } from '../components/ui/badge'; // Assuming path
import { Progress } from '../components/ui/progress'; // Assuming path for progress bar
import { ClockIcon, BookOpenIcon, CheckCircleIcon, Loader2 } from 'lucide-react'; // Example icons, added Loader2

// Mock data for quizzes (replace with actual data fetching)
// You might fetch this based on user progress or roadmap module
const mockRecentQuizzes = [
  { id: "quiz-1", title: "Python Basics for ML", completed: true, score: 85, moduleId: "module-1" },
  { id: "quiz-2", title: "Data Manipulation with Pandas", completed: false, score: undefined, moduleId: "module-2" },
];

// Mock data for next steps (replace with actual data fetching from roadmap)
const mockNextSteps = [
    { id: "module-2", title: "Module 2: Data Manipulation with Pandas", type: "module" },
    { id: "lesson-2.1", title: "Lesson 2.1: Intro to DataFrames", type: "lesson" },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  // Pass userId to the hook
  const { modules, loading: roadmapLoading, error: roadmapError, hasRoadmap } = useRoadmap(user?.id || '');

  // Derive progress information from the modules array
  const completedModules = modules.filter(m => m.status === 'completed');
  const currentModule = modules.find(m => m.status === 'in-progress') || modules.find(m => m.status === 'locked'); // First in-progress or first locked
  const totalModules = modules.length;
  const progressPercentage = totalModules > 0 ? (completedModules.length / totalModules) * 100 : 0;

  // Derive next steps from modules (example: next 2 after current)
  const currentModuleIndex = currentModule ? modules.findIndex(m => m.id === currentModule.id) : -1;
  const nextStepsModules = currentModuleIndex !== -1
    ? modules.slice(currentModuleIndex + 1, currentModuleIndex + 3) // Get next 2 modules
    : modules.slice(0, 2); // Or first 2 if no current module found

  // Format next steps for display
  const derivedNextSteps = nextStepsModules.map(m => ({
      id: m.id,
      title: m.title,
      type: 'module' // Assuming steps are modules for now
  }));


  if (roadmapLoading) {
    return (
        <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="ml-2 text-gray-600">Loading your dashboard...</p>
        </div>
    );
  }

  if (roadmapError) {
      return (
          <div className="container mx-auto px-4 py-12 text-center">
              <p className="text-red-600">Error loading roadmap data: {roadmapError.message}</p>
          </div>
      );
  }

   // Handle case where user has no roadmap (needs onboarding)
   if (!hasRoadmap && !roadmapLoading) {
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


  return (
    <div className="container mx-auto px-4 py-12">
      {/* Welcome Section */}
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Welcome back, {user?.user_metadata?.full_name || 'Learner'}!
      </h1>
      <p className="text-gray-600 mb-8">Let's pick up where you left off.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Roadmap Progress Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Learning Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            {currentModule ? (
              <>
                <p className="text-sm text-gray-600 mb-2">Currently on:</p>
                <h3 className="text-lg font-semibold mb-4">{currentModule.title}</h3>
                <Progress value={progressPercentage} className="w-full mb-4" />
                <p className="text-sm text-gray-500">{Math.round(progressPercentage)}% completed</p>
              </>
            ) : (
              <p className="text-gray-600">Start your learning journey on the Roadmap page!</p>
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
            {derivedNextSteps.length > 0 ? (
              <ul className="space-y-3">
                {derivedNextSteps.map(step => (
                  <li key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                    <div className="flex items-center space-x-3">
                      <BookOpenIcon className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{step.title}</p>
                        <Badge variant="secondary" className="mt-1">{step.type}</Badge>
                      </div>
                    </div>
                    <Link to={step.type === 'module' ? `/roadmap#${step.id}` : `/roadmap/lesson/${step.id}`}> {/* Adjust link as needed */}
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
                    <Link to="/quizzes"> {/* Link to the main quizzes page, could potentially link to specific quiz */}
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

      {/* Add other sections like Course Overview or Community Activity here if needed */}

    </div>
  );
};

export default DashboardPage;
