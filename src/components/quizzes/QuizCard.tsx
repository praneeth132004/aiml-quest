
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";

export interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  questions: number;
  timeEstimate: number;
  completed: boolean;
  score?: number;
  moduleId: string;
}

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="border card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{quiz.title}</CardTitle>
          <Badge 
            className={getDifficultyColor(quiz.difficulty)} 
            variant="secondary"
          >
            {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{quiz.description}</p>
        
        <div className="flex space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{quiz.timeEstimate} min</span>
          </div>
          <div>
            {quiz.questions} questions
          </div>
        </div>

        {quiz.completed && (
          <div className="mt-4 flex items-center text-sm font-medium">
            <Award className="h-4 w-4 mr-1 text-yellow-500" />
            <span>Your score: <span className="text-aiml-primary">{quiz.score}%</span></span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={quiz.completed ? "outline" : "default"} asChild>
          <Link to={`/quizzes/${quiz.id}`}>
            {quiz.completed ? "Review Quiz" : "Start Quiz"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
