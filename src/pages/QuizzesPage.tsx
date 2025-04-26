
import { useState } from "react";
// Removed PageLayout import as it's handled by routing now
import QuizCard, { Quiz } from "@/components/quizzes/QuizCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

// Mock data for quizzes
const mockQuizzes: Quiz[] = [
  {
    id: "quiz-1",
    title: "Python Basics for ML",
    description: "Test your knowledge of Python fundamentals relevant to machine learning.",
    difficulty: "beginner",
    questions: 15,
    timeEstimate: 20,
    completed: true,
    score: 85,
    moduleId: "module-1",
  },
  {
    id: "quiz-2",
    title: "Data Manipulation with Pandas",
    description: "Assess your skills in data cleaning, transformation, and analysis using Pandas.",
    difficulty: "intermediate",
    questions: 12,
    timeEstimate: 25,
    completed: true,
    score: 72,
    moduleId: "module-2",
  },
  {
    id: "quiz-3",
    title: "Advanced Pandas Techniques",
    description: "Challenge yourself with complex data operations and performance optimization in Pandas.",
    difficulty: "advanced",
    questions: 10,
    timeEstimate: 30,
    completed: false,
    moduleId: "module-2",
  },
  {
    id: "quiz-4",
    title: "Intro to Machine Learning Concepts",
    description: "Test your understanding of fundamental machine learning concepts and terminology.",
    difficulty: "beginner",
    questions: 20,
    timeEstimate: 25,
    completed: false,
    moduleId: "module-3",
  },
  {
    id: "quiz-5",
    title: "Neural Networks Basics",
    description: "Assess your knowledge of neural network foundations and architectures.",
    difficulty: "intermediate",
    questions: 15,
    timeEstimate: 30,
    completed: false,
    moduleId: "module-4",
  },
];

const QuizzesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter quizzes based on search and active tab
  const filteredQuizzes = mockQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "completed") return matchesSearch && quiz.completed;
    if (activeTab === "incomplete") return matchesSearch && !quiz.completed;
    if (activeTab === "beginner" || activeTab === "intermediate" || activeTab === "advanced") {
      return matchesSearch && quiz.difficulty === activeTab;
    }
    
    return matchesSearch;
  });

  return (
    // Removed PageLayout wrapper
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Quizzes & Assessments</h1>
      <p className="text-gray-600 mb-8">
          Test your knowledge and track your progress with these interactive quizzes.
        </p>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <Input
            placeholder="Search quizzes..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setActiveTab("all")}>All Quizzes</TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setActiveTab("completed")}>Completed</TabsTrigger>
            <TabsTrigger value="incomplete" onClick={() => setActiveTab("incomplete")}>To Do</TabsTrigger>
            <TabsTrigger value="beginner" onClick={() => setActiveTab("beginner")}>Beginner</TabsTrigger>
            <TabsTrigger value="intermediate" onClick={() => setActiveTab("intermediate")}>Intermediate</TabsTrigger>
            <TabsTrigger value="advanced" onClick={() => setActiveTab("advanced")}>Advanced</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))
          ) : (
            <div className="col-span-3 py-12 text-center">
              <p className="text-gray-500">No quizzes found matching your criteria.</p>
            </div>
          )}
        </div>
    </div>
    // Removed closing PageLayout tag
  );
};

export default QuizzesPage;
